
import React from 'react';
import { ExplanationMode } from '../types';

interface MutationInputFormProps {
  mutation: string;
  setMutation: (mutation: string) => void;
  explanationMode: ExplanationMode;
  setExplanationMode: (mode: ExplanationMode) => void;
  onSubmit: (mutation: string, mode: ExplanationMode) => void;
  isLoading: boolean;
  history: string[];
  onHistoryItemClick: (mutation: string) => void;
  onClearHistory: () => void;
}

const exampleMutations = ["KRAS p.G12D", "TP53 c.743G>A", "BRAF V600E", "EGFR L858R"];

export const MutationInputForm: React.FC<MutationInputFormProps> = ({
  mutation,
  setMutation,
  explanationMode,
  setExplanationMode,
  onSubmit,
  isLoading,
  history,
  onHistoryItemClick,
  onClearHistory,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mutation, explanationMode);
  };

  const handleExampleClick = (example: string) => {
    setMutation(example);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="mutation" className="block text-sm font-medium text-primary-300 mb-1">
          Enter Gene Mutation
        </label>
        <div className="relative">
          <input
            type="text"
            id="mutation"
            value={mutation}
            onChange={(e) => setMutation(e.target.value)}
            placeholder="e.g., KRAS p.G12D, TP53 c.743G>A"
            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 placeholder-slate-500 text-gray-100 text-lg pr-10"
            disabled={isLoading}
            aria-describedby="mutation-examples"
          />
          {mutation && !isLoading && (
            <button
              type="button"
              onClick={() => setMutation('')}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200"
              aria-label="Clear mutation input"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <div id="mutation-examples" className="mt-2 text-xs text-slate-400">
          Examples: {exampleMutations.map((ex, index) => (
            <React.Fragment key={ex}>
              <button
                type="button"
                onClick={() => handleExampleClick(ex)}
                className="ml-1 text-primary-400 hover:text-primary-300 hover:underline focus:outline-none focus:ring-1 focus:ring-primary-500 rounded"
                disabled={isLoading}
                aria-label={`Use example mutation: ${ex}`}
              >
                {ex}
              </button>
              {index < exampleMutations.length - 1 ? ',' : ''}
            </React.Fragment>
          ))}
        </div>
      </div>

      {history && history.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-primary-300">Recent Queries</h3>
            <button
              type="button"
              onClick={onClearHistory}
              disabled={isLoading}
              className="text-xs text-slate-400 hover:text-slate-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear recent queries history"
            >
              Clear History
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => onHistoryItemClick(item)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md text-xs text-slate-200 transition-colors duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Use recent query: ${item}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="block text-sm font-medium text-primary-300 mb-2">
          Explanation Mode
        </span>
        <div className="flex space-x-2 sm:space-x-4">
          {(Object.keys(ExplanationMode) as Array<keyof typeof ExplanationMode>).map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setExplanationMode(ExplanationMode[key])}
              disabled={isLoading}
              className={`flex-1 py-3 px-2 sm:px-4 rounded-md text-sm font-medium transition-all duration-150 ease-in-out
                ${explanationMode === ExplanationMode[key] 
                  ? 'bg-primary-600 text-white shadow-lg ring-2 ring-primary-500 ring-offset-2 ring-offset-slate-800' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 hover:border-slate-500'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {ExplanationMode[key] === ExplanationMode.PATIENT ? 'Patient-Friendly' : 'Clinician-Focused'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !mutation.trim()}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Explaining...
          </>
        ) : (
          'Explain Mutation'
        )}
      </button>
    </form>
  );
};
