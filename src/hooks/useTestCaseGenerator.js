import { useState, useCallback } from "react";
import { generateTestCases } from "../services/testCaseService";

const useTestCaseGenerator = () => {
  const [generatedCases, setGeneratedCases] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generate = useCallback(async (challengeId) => {
    if (isGenerating) return;
    if (!challengeId) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedCases([]);

    try {
      const cases = await generateTestCases(challengeId);
      setGeneratedCases(cases);
    } catch(err) {
      console.error("Test case generation failed:", err);
      setError(err.message || "Failed to generate test cases. Please try again.")
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  const clear = useCallback(() => {
    setGeneratedCases([]);
    setError(null);
  }, []);

  return {
    generatedCases,
    isGenerating,
    error,
    generate,
    clear,
  };
};

export default useTestCaseGenerator;
