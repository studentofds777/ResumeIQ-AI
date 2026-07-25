import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init for Gemini API
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
}

// Health endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    status: 'ok',
    geminiConfigured: hasKey,
    timestamp: new Date().toISOString()
  });
});

// Resume Analysis API
app.post('/api/analyze-resume', async (req, res) => {
  try {
    const { resumeText, jobDescription, targetRole, fileName } = req.body;

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume text.' });
    }

    const ai = getGeminiClient();

    const prompt = `
You are an expert ATS (Applicant Tracking System) recruiter and resume optimization consultant.
Analyze the following resume text and optional Job Description/Target Role.

Target Role Provided By User: ${targetRole || 'Not specified'}
FileName: ${fileName || 'Resume.pdf'}

--- RESUME TEXT ---
${resumeText.slice(0, 8000)}

--- JOB DESCRIPTION / CONTEXT (IF PROVIDED) ---
${jobDescription ? jobDescription.slice(0, 4000) : 'None provided. Evaluate against industry standard expectations for the target role.'}

Perform a rigorous evaluation and respond ONLY with a JSON object strictly following this JSON schema (no markdown wrap or backticks outside the JSON):

{
  "detectedTargetRole": string (The exact job title or target role extracted from the Job Description. If a Job Description is provided, extract the specific job title/position from it. If no Job Description is provided, extract the candidate's target job title from the resume or return the user's provided targetRole. If neither exists, return ""),
  "atsScore": number (0-100 overall ATS score),
  "scoreBreakdown": {
    "formatting": number (0-100),
    "keywords": number (0-100),
    "impactResults": number (0-100),
    "actionVerbs": number (0-100),
    "completeness": number (0-100)
  },
  "keyStrengths": [string array of 3-5 strong points],
  "criticalRedFlags": [string array of 2-4 areas needing urgent fix],
  "skillGaps": [
    {
      "category": "Technical" | "Soft Skills" | "Tools & Platforms" | "Certifications",
      "matchedSkills": [string array],
      "missingSkills": [string array],
      "recommendation": string
    }
  ],
  "jobMatch": {
    "matchPercentage": number (0-100),
    "matchedKeywords": [string array],
    "missingKeywords": [string array],
    "roleFitSummary": string,
    "tailoringAdvice": [string array]
  },
  "suggestions": [
    {
      "section": "Contact & Header" | "Summary" | "Experience" | "Education" | "Skills" | "Projects",
      "status": "excellent" | "warning" | "critical",
      "title": string,
      "currentText": string or null,
      "suggestedText": string or null,
      "issue": string,
      "recommendation": string
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const rawText = response.text || '';
    let jsonResult;
    try {
      jsonResult = JSON.parse(rawText);
    } catch (e) {
      // Fallback clean parsing
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      jsonResult = JSON.parse(cleaned);
    }

    const finalRole = jsonResult.detectedTargetRole?.trim() || targetRole?.trim() || '';

    res.json({
      id: 'analysis-' + Date.now(),
      createdAt: new Date().toISOString(),
      fileName: fileName || 'Uploaded_Resume.pdf',
      extractedText: resumeText,
      jobDescriptionText: jobDescription || '',
      detectedTargetRole: finalRole,
      targetRole: finalRole,
      ...jsonResult
    });

  } catch (error: any) {
    console.error('Error analyzing resume:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze resume.' });
  }
});

// AI Resume Builder Content Enhancer
app.post('/api/generate-resume-content', async (req, res) => {
  try {
    const { type, context } = req.body || {};

    if (type === 'summary') {
      const fullName = context?.fullName || 'Candidate';
      const jobTitle = context?.jobTitle || context?.targetRole || 'Professional';
      const isFresher = Boolean(context?.isFresher);
      const contactInfo = context?.contactInfo || '';
      const skills = context?.skills || '';
      const experience = context?.experience || '';
      const education = context?.education || '';
      const projects = context?.projects || '';

      try {
        const ai = getGeminiClient();
        const prompt = `You are an expert ATS resume writing consultant.
Generate a tailored, ATS-friendly 3 to 5 sentence professional executive summary for the candidate using ONLY the provided candidate details.

CANDIDATE DATA:
- Full Name: ${fullName}
- Target Role / Profession: ${jobTitle}
- Candidate Category: ${isFresher ? 'Student / Fresher / Entry-Level (No formal work experience listed)' : 'Experienced Candidate'}
- Contact / Location: ${contactInfo || 'Not provided'}
- Work Experience: ${experience || 'None listed (Entry-Level / Fresher)'}
- Education: ${education || 'None listed'}
- Skills & Competencies: ${skills || 'None listed'}
- Projects & Portfolio: ${projects || 'None listed'}

INSTRUCTIONS:
1. PROFESSION SPECIFICITY: Custom-tailor the terminology, tone, and focal points specifically for the target profession (${jobTitle}). This must work for ANY profession (e.g. Lawyer, Teacher, Doctor, Registered Nurse, Accountant, Civil Engineer, Mechanical Engineer, Software Engineer, Graphic Designer, Digital Marketer, Financial Analyst, Student, Fresher, Sales Executive, etc.).
2. FRESHER / STUDENT ADAPTATION: If the candidate is a student or fresher (or has no work experience listed), craft an ambitious entry-level summary highlighting their degree, core skills, practical projects, problem-solving ability, and career aspirations in ${jobTitle}. Do not invent fake work experience.
3. EXPERIENCED ADAPTATION: Highlight key achievements, domain expertise, tools/skills, and value brought to ${jobTitle} based strictly on their experience, education, skills, and projects.
4. STRICT LENGTH: Write EXACTLY 3 to 5 clear sentences.
5. NO PLACEHOLDERS OR FICTION: Use only the candidate's actual details. Do NOT mention software engineering or tech unless the candidate explicitly entered software engineering/tech details.
6. FORMAT: Output plain text paragraph only. Do NOT include markdown headings, bullet points, quotes, or conversational preamble.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            temperature: 0.4
          }
        });

        const generated = response.text?.trim();
        if (generated && generated.length > 20) {
          return res.json({ result: generated });
        } else {
          throw new Error('Gemini model returned empty or invalid text.');
        }
      } catch (geminiErr: any) {
        console.error('Gemini summary generation failed:', geminiErr);
        return res.status(500).json({ error: geminiErr.message || 'AI summary generation failed. Please try again.' });
      }
    }

    const ai = getGeminiClient();
    let prompt = '';
    if (type === 'bullet') {
      prompt = `Rewrite and polish this bullet point for a resume experience section: "${context?.bullet}". Make it quantify results, start with a high-power active verb, and remove passive wording. Output plain text polished bullet point only.`;
    } else if (type === 'skills') {
      prompt = `Suggest 10 essential industry skills for a ${context?.targetRole || 'Professional'}. Output JSON array of strings, e.g. ["Skill 1", "Skill 2"]`;
    } else {
      prompt = `Provide 3 actionable tips to improve this resume content: "${context?.text}". Output JSON array of strings.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        temperature: 0.3
      }
    });

    res.json({ result: response.text?.trim() });
  } catch (error: any) {
    console.error('Error generating resume content:', error);
    res.status(500).json({ error: error.message || 'Failed to generate content.' });
  }
});

// AI Interview Question Generator
app.post('/api/generate-interview-questions', async (req, res) => {
  try {
    const { resumeText, targetRole, jobDescription } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are a Lead Hiring Manager interviewing candidates.
Generate 6 realistic interview questions tailored specifically to this resume and target role.

Target Role: ${targetRole || 'Tech Specialist'}
Job Description: ${jobDescription || 'Standard requirements'}
Resume Snippet: ${resumeText ? resumeText.slice(0, 3000) : 'Experienced candidate'}

Respond ONLY with JSON format matching array of items:
[
  {
    "id": "q1",
    "question": "question text",
    "category": "Technical" | "Behavioral" | "Situational" | "Resume Deep-Dive",
    "difficulty": "Easy" | "Medium" | "Hard",
    "interviewerIntent": "what the hiring manager is looking for",
    "sampleAnswer": "model answer using STAR technique or technical depth",
    "keyTalkingPoints": ["talking point 1", "talking point 2"]
  }
]
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const raw = response.text || '[]';
    let questions;
    try {
      questions = JSON.parse(raw);
    } catch (e) {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      questions = JSON.parse(cleaned);
    }
    res.json({ questions });

  } catch (error: any) {
    console.error('Error generating interview questions:', error);
    res.status(500).json({ error: error.message || 'Failed to generate questions.' });
  }
});

// AI Interview Answer Evaluator
app.post('/api/evaluate-interview-answer', async (req, res) => {
  try {
    const { question, userAnswer } = req.body;
    const ai = getGeminiClient();

    const prompt = `
You are a senior interview coach. Evaluate this candidate's interview response.

Question: "${question}"
Candidate Answer: "${userAnswer}"

Respond ONLY with JSON format:
{
  "score": number (0-100),
  "strengths": [string array],
  "improvements": [string array],
  "revisedAnswer": "An improved, highly polished version of candidate answer"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const raw = response.text || '{}';
    let evaluation;
    try {
      evaluation = JSON.parse(raw);
    } catch (e) {
      const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
      evaluation = JSON.parse(cleaned);
    }
    res.json(evaluation);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    res.status(500).json({ error: error.message || 'Failed to evaluate answer.' });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ResumeIQ AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
