
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MutationInputForm } from './components/MutationInputForm';
import { ExplanationDisplay } from './components/ExplanationDisplay';
import { KeyQuestionsDisplay } from './components/KeyQuestionsDisplay'; // New import
import { LoadingSpinner } from './components/LoadingSpinner';
import { ExplanationMode, GroundingMetadata } from './types';
import { generateExplanation, ExplanationResult } from './services/geminiService'; // Updated import

const MAX_HISTORY_ITEMS = 5;
const HISTORY_STORAGE_KEY = 'explainMyMutationsHistory';

const App: React.FC = () => {
  const [mutation, setMutation] = useState<string>('');
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>(ExplanationMode.PATIENT);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [keyQuestions, setKeyQuestions] = useState<string[] | null>(null); // New state
  const [groundingMetadata, setGroundingMetadata] = useState<GroundingMetadata | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [queryHistory, setQueryHistory] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setQueryHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    }
  }, []);

  const updateHistory = (newQuery: string) => {
    setQueryHistory(prevHistory => {
      const updatedHistory = [newQuery, ...prevHistory.filter(item => item !== newQuery)].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (e) {
        console.error("Failed to save history to localStorage:", e);
      }
      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setQueryHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear history from localStorage:", e);
    }
  };

  const handleExplainMutation = useCallback(async (currentMutation: string, currentMode: ExplanationMode) => {
    if (!currentMutation.trim()) {
      setError('Please enter a mutation or select an example/history item.');
      setExplanation(null);
      setGroundingMetadata(null);
      setKeyQuestions(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setExplanation(null);
    setGroundingMetadata(null);
    setKeyQuestions(null);
    
    try {
      const result: ExplanationResult = await generateExplanation(currentMutation, currentMode);
      setExplanation(result.text);
      if (result.groundingMetadata) {
        setGroundingMetadata(result.groundingMetadata);
      }
      if (result.keyQuestions) {
        setKeyQuestions(result.keyQuestions);
      }
      updateHistory(currentMutation);
    } catch (err) {
      console.error('Error generating explanation:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please ensure your API key is configured correctly and the model is available.');
    } finally {
      setIsLoading(false);
    }
  }, [updateHistory]); // updateHistory is stable

  const handleHistoryItemClick = (historyMutation: string) => {
    setMutation(historyMutation);
    handleExplainMutation(historyMutation, explanationMode);
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 text-gray-100 selection:bg-primary-500 selection:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-slate-800 shadow-2xl rounded-lg p-6 md:p-8">
          <MutationInputForm
            mutation={mutation}
            setMutation={setMutation}
            explanationMode={explanationMode}
            setExplanationMode={setExplanationMode}
            onSubmit={handleExplainMutation}
            isLoading={isLoading}
            history={queryHistory}
            onHistoryItemClick={handleHistoryItemClick}
            onClearHistory={clearHistory}
          />
          {isLoading && <LoadingSpinner />}
          {error && (
            <div className="mt-6 bg-red-500/20 border border-red-700 text-red-300 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {explanation && !isLoading && (
            <ExplanationDisplay 
              mutationQuery={mutation}
              explanation={explanation} 
              mode={explanationMode}
              groundingMetadata={groundingMetadata}
            />
          )}

          {keyQuestions && keyQuestions.length > 0 && !isLoading && (
            <KeyQuestionsDisplay 
              questions={keyQuestions} 
              isLoading={isLoading} 
              mode={explanationMode}
            />
          )}
        </div>
        {!explanation && !isLoading && !error && (
          <div className="mt-8 text-center text-slate-400">
            <p className="text-lg">Enter a genetic mutation (or click an example/history item) to get an explanation.</p>
            <p className="text-sm mt-2">The AI will also generate some key questions you might want to ask your doctor or specialist.</p>
            <p className="text-sm mt-1">Choose between patient-friendly or clinician-focused language.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;