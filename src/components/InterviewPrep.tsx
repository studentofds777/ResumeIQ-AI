import React, { useState } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Award, 
  MessageSquare, 
  Zap, 
  BookOpen, 
  ThumbsUp, 
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { SAMPLE_INTERVIEW_QUESTIONS } from '../data/mockData';
import { InterviewQuestion, InterviewFeedback } from '../types';
import { useAuth } from '../context/AuthContext';

export const InterviewPrep: React.FC = () => {
  const { history, user, updateProfile } = useAuth();
  
  const [questions, setQuestions] = useState<InterviewQuestion[]>(SAMPLE_INTERVIEW_QUESTIONS);
  const [targetRole, setTargetRole] = useState<string>(user?.targetRole || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (user?.targetRole !== undefined) {
      setTargetRole(user.targetRole);
    }
  }, [user?.targetRole]);

  const handleRoleChange = (newRole: string) => {
    setTargetRole(newRole);
    updateProfile({ targetRole: newRole });
  };

  const [activeQuestionId, setActiveQuestionId] = useState<string>(SAMPLE_INTERVIEW_QUESTIONS[0].id);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedbacks, setFeedbacks] = useState<Record<string, InterviewFeedback>>({});
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || questions[0];

  const generateNewQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-interview-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          resumeText: history[0]?.extractedText || 'Experienced Senior Candidate'
        })
      });

      if (!response.ok) throw new Error('Failed to generate questions');
      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setActiveQuestionId(data.questions[0].id);
      }
    } catch (e) {
      alert('Failed to generate new interview questions.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (qId: string) => {
    const answer = userAnswers[qId];
    if (!answer || answer.trim().length < 10) {
      alert('Please enter a complete response before evaluating.');
      return;
    }

    setEvaluatingId(qId);
    try {
      const response = await fetch('/api/evaluate-interview-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          userAnswer: answer
        })
      });

      const evaluation: InterviewFeedback = await response.json();
      setFeedbacks((prev) => ({ ...prev, [qId]: evaluation }));
    } catch (e) {
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluatingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>AI Interview Preparation</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Tailored interview questions based on your resume and target role with live AI grading.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            placeholder="Target Role (e.g. Accountant, Engineer...)"
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          />
          <button
            id="generate-interview-q-btn"
            onClick={generateNewQuestions}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors flex items-center space-x-1.5 shrink-0"
          >
            {isLoading ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            <span>Generate New Questions</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Question List (Left) vs Practice Arena (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Question Selector Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Generated Interview Questions ({questions.length})
          </h3>

          <div className="space-y-2">
            {questions.map((q, idx) => {
              const isSelected = q.id === activeQuestionId;
              const hasFeedback = !!feedbacks[q.id];

              return (
                <div
                  key={q.id}
                  onClick={() => setActiveQuestionId(q.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {q.category}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      q.difficulty === 'Hard' ? 'text-rose-600' : 'text-amber-600'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                    {idx + 1}. {q.question}
                  </p>

                  {hasFeedback && (
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Graded: {feedbacks[q.id].score}/100</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Practice Arena & AI Evaluator (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeQuestion && (
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
              
              {/* Question Banner */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    {activeQuestion.category} Question
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Difficulty: {activeQuestion.difficulty}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeQuestion.question}
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  <strong className="text-slate-700 dark:text-slate-300 not-italic">Interviewer Intent:</strong> {activeQuestion.interviewerIntent}
                </p>
              </div>

              {/* Sample Talking Points */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                  <span>Key Talking Points to Include</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeQuestion.keyTalkingPoints.map((tp, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs">
                      • {tp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interactive Candidate Practice Textarea */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-900 dark:text-white">
                  Type Your Practice Answer (Use STAR Method)
                </label>

                <textarea
                  rows={5}
                  value={userAnswers[activeQuestion.id] || ''}
                  onChange={(e) => setUserAnswers({ ...userAnswers, [activeQuestion.id]: e.target.value })}
                  placeholder="Structure your answer with Situation, Task, Action, and Result..."
                  className="w-full p-3.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => {
                      setUserAnswers({
                        ...userAnswers,
                        [activeQuestion.id]: activeQuestion.sampleAnswer
                      });
                    }}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Load AI Sample Model Answer
                  </button>

                  <button
                    id="submit-answer-eval-btn"
                    onClick={() => submitAnswer(activeQuestion.id)}
                    disabled={evaluatingId === activeQuestion.id}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xs transition-all flex items-center space-x-2"
                  >
                    {evaluatingId === activeQuestion.id ? (
                      <>
                        <Sparkles className="h-4 w-4 animate-spin" />
                        <span>Grading Answer...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Submit for AI Evaluation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI Evaluation Output Banner */}
              {feedbacks[activeQuestion.id] && (
                <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-lg space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-blue-900/60 pb-3">
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Award className="h-5 w-5 text-amber-400" />
                      <span>AI Answer Scorecard</span>
                    </h4>
                    <span className="text-xl font-black text-emerald-400">
                      {feedbacks[activeQuestion.id].score} / 100
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="font-bold text-emerald-300 mb-1">Strengths:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {feedbacks[activeQuestion.id].strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-amber-300 mb-1">Areas for Improvement:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-300">
                        {feedbacks[activeQuestion.id].improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-900/60 text-xs">
                    <p className="font-bold text-blue-200 mb-1">Revised Polished Model Answer:</p>
                    <p className="p-3 rounded-lg bg-blue-950/80 text-slate-200 font-mono leading-relaxed">
                      "{feedbacks[activeQuestion.id].revisedAnswer}"
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
