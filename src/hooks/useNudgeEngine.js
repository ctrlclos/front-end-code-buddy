import { useState, useRef, useCallback, useEffect } from "react";

const NUDGE_MESSAGES = [
  "What approach are you considering right now?",
  "Try explaining your next step out loud.",
  "Walk me through what this code does so far.",
  "What is the time complexity of your current approach?",
  "Are there any edge cases you should consider?",
  "Why did you choose this data structure?",
  "How would you test this solution?",
  "Can you think of a simpler approach?",
  "What trade-offs are you making with this approach?",
  "Describe what happens step by step when this runs.",
  "What would you tell the interviewer right now?",
  "What is the space complexity here?",
];

const NUDGE_COOLDOWN_MS = 15000;

const useNudgeEngine = ({
  silentForMs,
  isListening,
  silenceThresholdMs = 5000,
}) => {
  const [currentNudge, setCurrentNudge] = useState(null);

  const [nudgeCount, setNudgeCount] = useState(0);

  const lastNudgeTimeRef = useRef(0);
  const nudgeIndexRef = useRef(0);

  useEffect(() => {
    if (!isListening) return;

    const silenceExceedsThreshold = silentForMs >= silenceThresholdMs;

    const cooldownElapsed = Date.now() - lastNudgeTimeRef.current >= NUDGE_COOLDOWN_MS;

    if (silenceExceedsThreshold && cooldownElapsed && !currentNudge) {
      const nudge = NUDGE_MESSAGES[nudgeIndexRef.current % NUDGE_MESSAGES.length];

      nudgeIndexRef.current += 1;
      setCurrentNudge(nudge);
      setNudgeCount((prev) => prev + 1);

      lastNudgeTimeRef.current = Date.now();
    }},  [silentForMs, isListening, silenceThresholdMs, currentNudge]);

    const clearNudge = useCallback(() => {
      setCurrentNudge(null);
    }, []);

    const reset = useCallback(() => {
      setCurrentNudge(null);
      setNudgeCount(0);
      lastNudgeTimeRef.current = 0;
      nudgeIndexRef.current = 0;
    }, []);

    return {
      currentNudge,
      nudgeCount,
      clearNudge,
      reset,
    };
};

export default useNudgeEngine;
