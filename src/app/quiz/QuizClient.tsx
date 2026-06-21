"use client";

import { useState } from 'react';
import PageHero from '@/src/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, BookOpen, AlertCircle, Search, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface SubjectItem {
  _id: string;
  name: string;
  slug: string;
  resolvedImage?: string;
  questionCount: number;
}

interface QuizQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  correctAnswer: number;
  explanation?: string;
}

export default function QuizClient({ subjects }: { subjects: SubjectItem[] }) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectItem | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const q = searchQuery.toLowerCase().trim();
  const filtered = q
    ? subjects.filter(s => s.name.toLowerCase().includes(q))
    : subjects;

  const startQuiz = async (subject: SubjectItem) => {
    setSelectedSubject(subject);
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${subject._id}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setQuestions(data);
      } else {
        setQuestions([]);
      }
    } catch (e) {
      setQuestions([]);
    }
    setLoading(false);
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      setUserAnswers(prev => [...prev, selectedOption]);
      if (selectedOption === questions[currentStep].correctAnswer) {
        setScore(s => s + 1);
      }
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(c => c + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  const goBack = () => {
    setSelectedSubject(null);
    setQuestions([]);
    setCurrentStep(0);
    setSelectedOption(null);
    setScore(0);
    setUserAnswers([]);
    setIsFinished(false);
  };

  // ─── Subject Selection Grid ────────────────────────────────
  if (!selectedSubject) {
    return (
      <div className="min-h-screen pb-24">
        <PageHero
          eyebrow="Interactive Testing"
          title="Quiz Centre"
          description="Select a subject to begin your forensic science knowledge check."
        />

        {/* Search */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-8 relative z-20">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subjects…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all shadow-sm"
            />
            {q && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((subject, i) => (
            <motion.button
              key={subject._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              onClick={() => startQuiz(subject)}
              className="card-panel group cursor-pointer flex flex-col p-6 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-500 h-[160px]"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-500">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-accent transition-colors mb-1 leading-tight">
                    {subject.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {subject.questionCount > 0 ? `${subject.questionCount} Questions` : 'Coming Soon'}
                  </span>
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-accent group-hover:text-accent">
                  Start Quiz <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    );
  }

  // ─── Loading State ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm font-light">Loading quiz for {selectedSubject.name}…</p>
        </div>
      </div>
    );
  }

  // ─── No Questions State ────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-screen pb-24">
        <PageHero
          eyebrow={selectedSubject.name}
          title="No Questions Yet"
          description="Quiz questions for this subject have not been added yet. Check back later."
        />
        <div className="max-w-3xl mx-auto px-6 mt-12 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-orange-400" />
          </div>
          <button onClick={goBack} className="pill-button bg-accent text-white hover:bg-[#6d28d9] flex items-center gap-2 mx-auto transition-all">
            <ArrowLeft className="w-4 h-4" /> Choose Another Subject
          </button>
        </div>
      </div>
    );
  }

  // ─── Quiz Flow ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow={selectedSubject.name}
        title="Knowledge Check"
        description={`Test your understanding of ${selectedSubject.name} with ${questions.length} questions.`}
      />

      <div className="max-w-3xl mx-auto px-6 mt-12">
        <button onClick={goBack} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-accent transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Subjects
        </button>

        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card-panel p-8 md:p-12"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="eyebrow">Question {currentStep + 1} of {questions.length}</span>
                <div className="h-1 flex-1 mx-6 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cta transition-all duration-500" 
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-2xl font-display font-semibold text-slate-900 mb-10">
                {questions[currentStep].question}
              </h2>

              <div className="space-y-4 mb-10">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedOption(idx)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border transition-all duration-200",
                      selectedOption === idx 
                        ? "border-cta bg-blue-50/50 text-cta" 
                        : "border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold",
                        selectedOption === idx ? "border-cta bg-cta text-white" : "border-slate-300 text-slate-400"
                      )}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm md:text-base font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  disabled={selectedOption === null}
                  onClick={handleNext}
                  className="pill-button bg-cta text-white hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {currentStep === questions.length - 1 ? "Finish Quiz" : "Next Question"} 
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-panel p-8 md:p-12 text-left"
            >
              <div className="text-center mb-10">
                <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">Quiz Completed</h2>
                <p className="text-slate-500">Subject: <strong className="text-slate-700">{selectedSubject.name}</strong></p>
                <div className="mt-4 text-2xl font-bold text-slate-900">
                  You scored {score} out of {questions.length}
                </div>
              </div>

              <div className="space-y-8 mb-12">
                <h3 className="font-display font-bold text-xl text-slate-900 border-b border-slate-100 pb-4">Detailed Review</h3>
                {questions.map((q, i) => {
                  const isCorrect = userAnswers[i] === q.correctAnswer;
                  return (
                    <div key={i} className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex items-start gap-4 mb-4">
                        <span className={cn(
                          "shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                          isCorrect ? "bg-green-500" : "bg-rose-500"
                        )}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium text-slate-900 text-lg leading-tight mb-2">{q.question}</p>
                          <div className="space-y-2 mt-4">
                            <p className="text-sm">
                              <span className="text-slate-500">Your Answer: </span>
                              <span className={cn("font-semibold", isCorrect ? "text-green-600" : "text-rose-600")}>
                                {q.options[userAnswers[i]]}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p className="text-sm">
                                <span className="text-slate-500">Correct Answer: </span>
                                <span className="font-semibold text-green-600">{q.options[q.correctAnswer]}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      {q.explanation && (
                        <div className="mt-4 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-600"><strong className="text-slate-900">Explanation: </strong>{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuiz}
                  className="pill-button border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <button onClick={goBack} className="pill-button bg-cta text-white hover:bg-blue-800 flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" /> Choose Another Subject
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
