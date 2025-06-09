
import React from 'react';
import { ExplanationMode } from '../types';

interface KeyQuestionsDisplayProps {
  questions: string[];
  isLoading: boolean;
  mode: ExplanationMode;
}

export const KeyQuestionsDisplay: React.FC<KeyQuestionsDisplayProps> = ({ questions, isLoading, mode }) => {
  if (isLoading || !questions || questions.length === 0) {
    return null;
  }

  const title = mode === ExplanationMode.PATIENT 
    ? "Key Questions for Your Doctor" 
    : "Key Questions for Further Consideration";

  return (
    <div className="mt-8 p-6 bg-slate-700/30 rounded-lg shadow-md border border-slate-600" role="region" aria-labelledby="key-questions-title">
      <h3 id="key-questions-title" className="text-lg font-semibold text-secondary-300 mb-3">
        {title}:
      </h3>
      <ul className="list-disc list-outside pl-5 space-y-2 text-slate-300">
        {questions.map((question, index) => (
          <li key={index} className="text-sm md:text-base">
            {question}
          </li>
        ))}
      </ul>
    </div>
  );
};
