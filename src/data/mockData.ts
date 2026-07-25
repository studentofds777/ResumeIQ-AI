import { AnalysisResult, ResumeData, InterviewQuestion } from '../types';

export const INITIAL_ANALYSIS_HISTORY: AnalysisResult[] = [];

export const INITIAL_RESUME_BUILDER_DATA: ResumeData = {
  id: 'builder-1',
  userId: 'demo-user-1',
  title: 'My Professional Resume',
  template: 'modern',
  design: {
    fontFamily: 'inter',
    fontSize: 'normal',
    primaryColor: '#1e3a8a',
    accentColor: '#3b82f6',
    sectionSpacing: 'standard',
    pageMargins: 'standard',
    layoutStyle: 'one-column',
    showProfilePhoto: false,
    headerStyle: 'left',
    iconStyle: 'minimal'
  },
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    website: '',
    summary: ''
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: []
};

export const SAMPLE_RESUMES = {
  tech: {
    resumeText: `ALEX MORGAN
Senior Software Engineer | San Francisco, CA | alex.morgan@example.com | (555) 234-5678 | linkedin.com/in/alexmorgan | github.com/alexmorgan

PROFESSIONAL SUMMARY
Senior Software Engineer with 6+ years of experience engineering high-throughput microservices, web applications, and cloud systems. Specialized in React, TypeScript, Node.js, PostgreSQL, and AWS. Proven track record of optimizing latency by 35% and scaling systems to 2M+ daily active users.

WORK EXPERIENCE
TechCorp Solutions — Senior Full Stack Engineer (2022 - Present)
• Architected automated CI/CD pipeline using GitHub Actions, reducing release deployment time from 45 minutes to 8 minutes.
• Engineered high-concurrency Node.js and TypeScript microservices handling 2,000+ Requests Per Second with 99.99% uptime.
• Refactored legacy monolithic PostgreSQL queries, reducing database P99 latency by 38% across 12 core API endpoints.
• Mentored 5 junior and mid-level engineers in clean code standards, unit testing, and system architecture.

DataDrive Systems — Software Engineer (2019 - 2022)
• Developed real-time user analytics dashboard using React, Tailwind CSS, and WebSockets serving 500k monthly active users.
• Integrated Stripe payment gateway and automated webhook idempotency, processing $4.2M in annual recurring revenue.
• Authored 200+ Jest and Cypress test suites, increasing overall codebase test coverage from 62% to 91%.

SKILLS
Programming Languages: TypeScript, JavaScript, SQL, Python, HTML5, CSS3
Frameworks & Libraries: React, Node.js, Express, Next.js, Tailwind CSS, Redux Toolkit
Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2, Lambda), REST APIs, GraphQL

EDUCATION
Bachelor of Science in Computer Science — University of California, Berkeley (2015 - 2019)`,
    jobDescription: `We are seeking a Senior Full Stack Software Engineer to lead the design and development of our next-generation cloud analytics platform. 
Requirements:
- 5+ years of software engineering experience with modern JavaScript/TypeScript stacks.
- Expertise in React, Node.js, REST APIs, and microservices architecture.
- Demonstrated experience with SQL databases (PostgreSQL/MySQL) and caching solutions (Redis).
- Familiarity with DevOps workflows, Docker, CI/CD pipelines, and cloud platforms (AWS or GCP).
- Excellent communication and leadership skills.`
  },
  product: {
    resumeText: `SARAH JENKINS
Senior Product Manager | New York, NY | sarah.jenkins@example.com | (555) 876-5432 | linkedin.com/in/sarahjenkins

SUMMARY
Results-driven Product Manager with 5+ years of experience driving SaaS product strategy, roadmap execution, and user growth. Adept at translating customer feedback into actionable engineering requirements, boosting active user retention by 28%.

EXPERIENCE
CloudScale Inc. — Product Manager (2021 - Present)
• Spearheaded product vision and roadmap for Enterprise Analytics module, driving $3.5M in new ARR in FY2023.
• Partnered with UX research and engineering teams to execute 14 A/B experiments, improving onboarding conversion by 22%.
• Managed backlogs in Jira, leading bi-weekly sprint planning and backlog grooming for 12 cross-functional team members.

FinFlow Systems — Associate Product Manager (2019 - 2021)
• Conducted 40+ user interviews to identify key customer friction points in mobile checkout flow.
• Launched streamlined automated invoice feature adopted by 15,000 active small business clients in the first quarter.

SKILLS
Product Strategy, Roadmap Planning, A/B Testing, User Research, Agile/Scrum, Jira, Mixpanel, SQL, Wireframing (Figma)`,
    jobDescription: `Looking for a Senior Product Manager to lead user acquisition and feature retention across our web and mobile applications.
Requirements:
- 4+ years in B2B or B2C product management.
- Strong proficiency in product analytics (Mixpanel/Amplitude) and SQL.
- Proven track record of launching user-centric features and optimizing funnel conversion.`
  }
};

export const SAMPLE_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'Technical',
    difficulty: 'Hard',
    question: 'In your resume, you mentioned reducing API response times from 450ms to 95ms. Walk me through your step-by-step diagnostic and optimization process.',
    interviewerIntent: 'Evaluates system profiling abilities, database indexing knowledge, and practical performance engineering skills.',
    sampleAnswer: 'I began by collecting APM telemetry using Datadog to identify bottlenecks. I discovered 70% of latency stemmed from N+1 query patterns in PostgreSQL and unindexed foreign keys. I introduced composite indexes, refactored queries using batching, and placed a Redis caching layer for read-heavy user sessions.',
    keyTalkingPoints: [
      'Diagnostic tools used (APM, query logs)',
      'Specific root cause identified (N+1 queries, missing indexes)',
      'Caching strategy (Redis read-through cache)',
      'Measured business outcome (95ms latency, improved UX)'
    ]
  },
  {
    id: 'q2',
    category: 'Behavioral',
    difficulty: 'Medium',
    question: 'Tell me about a time you led a major architectural change (like your microservices migration at TechCorp) against pushback from teammates.',
    interviewerIntent: 'Assesses technical leadership, empathy, influence without authority, and risk mitigation strategy.',
    sampleAnswer: 'When proposing the serverless microservices migration, two senior engineers raised valid concerns about local dev setup complexity. To address this, I built a Docker Compose sandbox environment proving local parity, ran a benchmark test on a non-critical service first, and held lunch-and-learn workshops to upskill the team before full migration.',
    keyTalkingPoints: [
      'Acknowledge validity of pushback',
      'Proof-of-Concept & risk mitigation',
      'Enabling the team with documentation & tools',
      'Final positive consensus and outcome'
    ]
  },
  {
    id: 'q3',
    category: 'Resume Deep-Dive',
    difficulty: 'Medium',
    question: 'How did you design your real-time analytics engine to handle 2M DAU while maintaining 99.99% SLA uptime?',
    interviewerIntent: 'Checks if resume claims are authentic and evaluates real-world scalability design principles.',
    sampleAnswer: 'We decoupled event ingestion from processing using an event streaming pipeline. Incoming telemetry was validated at edge endpoints, buffered in an asynchronous queue, and processed in worker pools, preventing load spikes from bringing down the core REST services.',
    keyTalkingPoints: [
      'Decoupling Ingestion vs Processing',
      'Asynchronous buffering & load balancing',
      'Graceful degradation & circuit breakers',
      'Monitoring & alerting thresholds'
    ]
  }
];
