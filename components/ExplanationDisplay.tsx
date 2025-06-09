
import React, { useState, useEffect } from 'react';
import { ExplanationMode, GroundingMetadata, GroundingChunk } from '../types';

interface ExplanationDisplayProps {
  mutationQuery: string;
  explanation: string;
  mode: ExplanationMode;
  groundingMetadata: GroundingMetadata | null;
}

const renderChunk = (chunk: GroundingChunk, index: number) => {
  const source = chunk.web || chunk.retrievedContext;
  if (source && source.uri) {
    return (
      <li key={index} className="mb-1">
        <a
          href={source.uri}
          target="_blank"
          rel="noopener noreferrer"
          title={source.title}
          className="text-primary-400 hover:text-primary-300 hover:underline truncate block"
        >
          {source.title || source.uri}
        </a>
      </li>
    );
  }
  return null;
};

export const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ mutationQuery, explanation, mode, groundingMetadata }) => {
  const validChunks = groundingMetadata?.groundingChunks?.filter(chunk => (chunk.web?.uri || chunk.retrievedContext?.uri)) || [];
  const [copyButtonText, setCopyButtonText] = useState<string>('Copy');
  const [shareButtonText, setShareButtonText] = useState<string>('Share');

  useEffect(() => {
    setCopyButtonText('Copy');
    setShareButtonText('Share');
  }, [explanation]);

  const handleCopyToClipboard = async (textToCopy: string, type: 'explanation' | 'summary') => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      if (type === 'explanation') {
        setCopyButtonText('Copied!');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      } else {
        setShareButtonText('Summary Copied!');
        setTimeout(() => setShareButtonText('Share'), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      if (type === 'explanation') {
        setCopyButtonText('Error');
        setTimeout(() => setCopyButtonText('Copy'), 2000);
      } else {
        setShareButtonText('Error');
        setTimeout(() => setShareButtonText('Share'), 2000);
      }
    }
  };

  const createShareableSummary = () => {
    const appUrl = window.location.href;
    return `
Mutation: ${mutationQuery}
Mode: ${mode === ExplanationMode.PATIENT ? 'Patient-Friendly' : 'Clinician-Focused'}

Explanation:
${explanation}

---
Shared from BioInCRO's Open Source ExplainMyMutations.AI
${appUrl}
    `.trim();
  };
  
  return (
    <div className="mt-8 p-6 bg-slate-700/50 rounded-lg shadow-inner">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-primary-300">
          Explanation ({mode === ExplanationMode.PATIENT ? 'Patient-Friendly' : 'Clinician-Focused'})
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => handleCopyToClipboard(explanation, 'explanation')}
            className="flex items-center px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md transition-colors duration-150"
            aria-label="Copy explanation to clipboard"
            title="Copy full explanation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376H3.375M15.75 17.25H18V7.875h-2.25m-3 10.376h3M10.5 13.5H7.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m-7.5-12h15C20.328 6 21 6.672 21 7.5V18c0 .828-.672 1.5-1.5 1.5H4.5A1.5 1.5 0 0 1 3 18V7.5C3 6.672 3.672 6 4.5 6Z M12 6V4.5A1.875 1.875 0 0 0 10.125 2.625H7.875A1.875 1.875 0 0 0 6 4.5V6" />
            </svg>
            {copyButtonText}
          </button>
          <button
            onClick={() => handleCopyToClipboard(createShareableSummary(), 'summary')}
            className="flex items-center px-3 py-1.5 text-sm bg-slate-600 hover:bg-slate-500 text-slate-200 rounded-md transition-colors duration-150"
            aria-label="Copy shareable summary to clipboard"
            title="Copy summary for sharing"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v1.066c0 .98-.942 1.719-2.054.398L3.779 10.18a.75.75 0 0 1 1.06-1.06l1.328 1.328c.305.305.798.175 1.051-.228Zm0 0c.102-.02.205-.038.309-.053Zm1.025 4.06c.385.284.81.492 1.268.632M16.005 7.06a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Zm0 0v1.066c0 .98.942 1.719 2.054.398L20.222 6.18a.75.75 0 0 0-1.061-1.06l-1.328 1.328c-.305.305-.798.175-1.051-.228Zm0 0A25.212 25.212 0 0 0 15.06 7M7.217 10.907a25.212 25.212 0 0 1 .944-3.847M16.005 7.06a25.212 25.212 0 0 0-.944 3.847m0 0v6.126c0 .98-.942 1.719-2.054.398L9.779 16.18a.75.75 0 0 1 1.06-1.06l1.328 1.328c.305.305.798.175 1.051-.228Zm0 0c.102-.02.205-.038.309-.053M7.217 10.907v6.126c0 .98.942 1.719 2.054.398L13.222 13.18a.75.75 0 0 0-1.061-1.06l-1.328 1.328c-.305.305-.798.175-1.051-.228Zm0 0A25.212 25.212 0 0 0 8.16 7" />
            </svg>
            {shareButtonText}
          </button>
        </div>
      </div>
      <div className="prose prose-sm md:prose-base prose-invert max-w-none text-slate-200 whitespace-pre-wrap selection:bg-primary-500 selection:text-white">
        {explanation}
      </div>
      {validChunks.length > 0 && (
         <div className="mt-6 pt-4 border-t border-slate-600">
           <h3 className="text-md font-semibold text-secondary-300 mb-2">Sources & Further Reading:</h3>
           <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
             {validChunks.map(renderChunk)}
           </ul>
         </div>
       )}
    </div>
  );
};
