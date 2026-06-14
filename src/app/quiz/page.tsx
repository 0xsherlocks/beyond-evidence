import { getQuizQuestions } from '@/src/sanity/queries';
import QuizClient from './QuizClient';

const FALLBACK_QUESTIONS = [
  {
    question: "What is the primary purpose of the chain of custody in forensic science?",
    options: ["To identify the suspect", "To maintain the integrity and traceability of evidence", "To determine the time of death", "To analyze DNA samples"],
    correctAnswer: 1
  },
  {
    question: "Which of the following is considered 'trace evidence'?",
    options: ["A murder weapon", "A laptop computer", "A single strand of hair", "A detailed witness statement"],
    correctAnswer: 2
  },
  {
    question: "In DNA profiling, what does STR stand for?",
    options: ["Sequence Tandem Repeat", "Short Tandem Repeat", "Standard Toxicological Result", "Signal Trace Recovery"],
    correctAnswer: 1
  }
];

export default async function QuizPage() {
  let questions;
  try {
    questions = await getQuizQuestions();
  } catch (e) {
    questions = null;
  }

  const resolvedQuestions = questions && questions.length > 0 ? questions : FALLBACK_QUESTIONS;

  return <QuizClient questions={resolvedQuestions} />;
}
