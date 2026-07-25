import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Converts modern CSS color function strings (oklch, oklab, lab, lch, color)
 * into standard #hex or rgb()/rgba() color strings using Canvas 2D rendering context.
 */
function convertCssColorToHexOrRgb(colorStr: string): string {
  if (!colorStr || typeof colorStr !== 'string') return colorStr;
  if (!colorStr.match(/oklch|oklab|lab|lch|color\(/i)) return colorStr;

  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#0f172a'; // fallback dark neutral
      ctx.fillStyle = colorStr;
      const res = ctx.fillStyle; // Canvas getter converts valid CSS color string to #hex or rgba(...)
      if (res && !res.match(/oklch|oklab|lab|lch|color\(/i)) {
        return res;
      }
    }
  } catch {
    // ignore canvas error
  }

  // Safe fallback if conversion fails
  const lower = colorStr.toLowerCase();
  if (lower.includes('border') || lower.includes('bg') || lower.includes('background')) {
    return '#ffffff';
  }
  return '#0f172a';
}

/**
 * Replaces all occurrences of unsupported CSS color functions in a string with standard Hex/RGB colors.
 */
function sanitizeCssString(cssText: string): string {
  if (!cssText || typeof cssText !== 'string') return cssText;
  if (!cssText.match(/oklch|oklab|lab|lch|color\(/i)) return cssText;

  return cssText.replace(/(oklch|oklab|lab|lch|color)\s*\([^)]+\)/gi, (match) => {
    return convertCssColorToHexOrRgb(match);
  });
}

/**
 * Copies computed layout, typography, and visual styles from live source elements
 * onto cloned target elements, replacing any oklch/lab colors with standard RGB/Hex values.
 */
function syncElementStyles(origNode: Element, clonedNode: Element) {
  if (!origNode || !clonedNode) return;

  const origElements = [origNode, ...Array.from(origNode.querySelectorAll('*'))];
  const clonedElements = [clonedNode, ...Array.from(clonedNode.querySelectorAll('*'))];

  const propsToSync = [
    'color',
    'backgroundColor',
    'borderColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'borderTopStyle',
    'borderRightStyle',
    'borderBottomStyle',
    'borderLeftStyle',
    'borderRadius',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'textTransform',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'display',
    'flexDirection',
    'alignItems',
    'justifyContent',
    'flexWrap',
    'gap',
    'gridTemplateColumns',
    'fill',
    'stroke',
    'strokeWidth',
    'opacity',
    'boxShadow'
  ];

  for (let i = 0; i < origElements.length; i++) {
    const orig = origElements[i];
    const cloned = clonedElements[i];
    if (!orig || !cloned || !(cloned instanceof HTMLElement || cloned instanceof SVGElement)) continue;

    try {
      const computed = window.getComputedStyle(orig);
      if (!computed) continue;

      propsToSync.forEach((prop) => {
        const val = (computed as any)[prop];
        if (val && val !== 'initial' && val !== 'unset') {
          const safeVal = sanitizeCssString(val);
          (cloned.style as any)[prop] = safeVal;
        }
      });

      // Maintain explicit SVG / image pixel dimensions
      const tag = orig.tagName.toLowerCase();
      if (tag === 'svg' || tag === 'img') {
        const rect = orig.getBoundingClientRect();
        if (rect.width > 0) cloned.style.width = `${rect.width}px`;
        if (rect.height > 0) cloned.style.height = `${rect.height}px`;
      }
    } catch {
      // Ignore individual element style errors
    }
  }
}

export async function exportElementToPDF(elementId: string, pdfFileName: string = 'Resume.pdf') {
  const origElement = document.getElementById(elementId);
  if (!origElement) {
    const errorMsg = `Target DOM element #${elementId} was not found on the page.`;
    console.error('[PDF Generator]', errorMsg);
    throw new Error(errorMsg);
  }

  try {
    // Wait for document fonts to load if available
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(origElement, {
      scale: 2,
      useCORS: true,
      allowTaint: false, // Prevents canvas security tainting
      logging: false,
      backgroundColor: '#ffffff',
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // 1. Remove dark mode from cloned document
        clonedDoc.documentElement.classList.remove('dark');
        clonedDoc.body.classList.remove('dark');

        // 2. Remove external stylesheet links that might contain unparsed oklch rules
        clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
          try {
            link.remove();
          } catch {
            // ignore
          }
        });

        // 3. Sanitize all <style> elements in clonedDoc
        clonedDoc.querySelectorAll('style').forEach((styleEl) => {
          if (styleEl.textContent) {
            styleEl.textContent = sanitizeCssString(styleEl.textContent);
          }
        });

        // 4. Style target element for pristine A4 export layout
        const clonedTarget = clonedDoc.getElementById(elementId);
        if (clonedTarget) {
          // Unconstrain parent containers so clonedTarget gets full width
          let parent = clonedTarget.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.width = 'auto';
            parent.style.maxWidth = 'none';
            parent.style.minWidth = '0';
            parent.style.overflow = 'visible';
            parent = parent.parentElement;
          }

          clonedTarget.style.width = '794px';
          clonedTarget.style.maxWidth = '794px';
          clonedTarget.style.minWidth = '794px';
          clonedTarget.style.margin = '0 auto';
          clonedTarget.style.transform = 'none';
          clonedTarget.style.boxShadow = 'none';
          clonedTarget.style.borderRadius = '0';
          clonedTarget.style.backgroundColor = '#ffffff';
          clonedTarget.style.color = '#0f172a';
          clonedTarget.style.boxSizing = 'border-box';

          // 5. Freeze live computed styles onto cloned target and all descendants with pure RGB/Hex
          syncElementStyles(origElement, clonedTarget);
        }
      }
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error('Canvas rendering produced an empty or invalid image.');
    }

    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/png');
    } catch (dataUrlErr: any) {
      console.error('[PDF Generator] toDataURL error:', dataUrlErr);
      throw new Error('Failed to extract canvas image data.');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = pdf.internal.pageSize.getWidth(); // 210 mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 297 mm

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const imgHeightInMm = (imgHeight * pdfWidth) / imgWidth;

    if (imgHeightInMm > pdfHeight) {
      let heightLeft = imgHeightInMm;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightInMm, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightInMm, undefined, 'FAST');
    }

    const saveName = pdfFileName.trim() ? pdfFileName : 'Resume.pdf';
    pdf.save(saveName);
  } catch (err: any) {
    console.error('[PDF Export Fatal Error]:', err);
    throw new Error(err?.message || 'Failed to generate PDF document.');
  }
}
