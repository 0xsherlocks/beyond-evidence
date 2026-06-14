"use client";

import { useState } from 'react';
import PageHero from '@/src/components/PageHero';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function QuizClient({ questions }: { questions: QuizQuestion[] }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleNext = () => {
    if (selectedOption === questions[currentStep].correctAnswer) {
      setScore(s => s + 1);
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
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <PageHero
        eyebrow="Interactive Testing"
        title="Knowledge Check"
        description="Verify your understanding of forensic protocols and terminology with our practice modules."
      />

      <div className="max-w-3xl mx-auto px-6 mt-12">
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
              className="card-panel p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Quiz Completed</h2>
              <p className="text-slate-500 mb-8">You scored {score} out of {questions.length} points.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={resetQuiz}
                  className="pill-button border border-slate-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Retake Quiz
                </button>
                <button className="pill-button bg-cta text-white hover:bg-blue-800">
                  Review Protocols
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
