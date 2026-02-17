import { useEffect } from "react";
import useSilenceDetector from "../../hooks/useSilenceDetector";
import useNudgeEngine from "../../hooks/useNudgeEngine";
import NudgeDisplay from "../NudgeDisplay/NudgeDisplay";

const SILENCE_THRESHOLD_MS = 5000;

const BTN_BASE = "px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors";

const VoiceCoach = () => {
  const { isListening, volume, silentForMs, isSilent, isSupported, start, stop } = useSilenceDetector();

  const { currentNudge, nudgeCount, clearNudge, reset } = useNudgeEngine({
    silentForMs,
    isListening,
    silenceThresholdMs: SILENCE_THRESHOLD_MS,
  });

  useEffect(() => {
    if(!isSilent && currentNudge) {
      clearNudge();
    }
  }, [isSilent, currentNudge, clearNudge]);

  const handleToggle = () => {
    if (isListening) {
      stop();
      reset();
    } else {
      start();
    }
  };

  const silenceProgress = Math.min(
    (silentForMs / SILENCE_THRESHOLD_MS) * 100,
    100
  )

  const volumePercent = Math.min((volume / 60) * 100, 100);

  if(!isSupported) {
    return (
      <div className="px-4 py-3 rounded-lg border border-border-subtle bg-bg-darker">
        <p className="text-sm text-muted">
          Voice coaching requires microphone access. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`${BTN_BASE} ${
              isListening ? "border-error bg-error/10 text-error" : "border-primary bg-primary/10 text-primary"
            }`}
          >
            {isListening ? "Stop Coach" : "Start Coach"}
          </button>
          {/* show nudge count while listening */}
          { isListening && (
            <span className="text-xs text-muted">
              Nudges: {nudgeCount}
            </span>
          )}
        </div>
      </div>

      {isListening && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted w-12">Volume</span>
            <div className="flex-1 h-2 bg-bg-darker rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-100 ${
                  isSilent ? "bg-muted" : "bg-success"
                }`}
                style={{ width: `${volumePercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted w-12">Silence</span>
            <div className="flex-1 h-2 bg-bg-darker rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  silenceProgress >= 100
                    ? "bg-error"
                    : silenceProgress >= 60
                      ? "bg-warning"
                      : "bg-muted"
                }`}
                style={{ width: `${silenceProgress}%` }}
              />
            </div>
            {isSilent && (
              <span className="text-xs text-muted">
                {Math.floor(silentForMs / 1000)}s
              </span>
            )}
          </div>
        </div>
      )}
      <NudgeDisplay message={currentNudge} onDismiss={clearNudge} />
    </div>
  )
}
export default VoiceCoach;
