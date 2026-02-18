import { useState } from "react";
import useTestCaseGenerator from "../../hooks/useTestCaseGenerator";

const BTN_BASE =
  "px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors";

const GenerateTestCasesButton = ({ challengeId, onSaveTestCase }) => {
  // Use the generator hook to manage generation state
  const { generatedCases, isGenerating, error, generate, clear } =
    useTestCaseGenerator();

  // Track which test cases have been saved (by index) so we can remove them from the preview
  const [savedIndices, setSavedIndices] = useState(new Set());

  // Error message specific to saving (separate from generation errors)
  const [saveError, setSaveError] = useState(null);

  // Trigger generation by passing the challenge ID to the hook
  const handleGenerate = () => {
    setSavedIndices(new Set());
    setSaveError(null);
    generate(challengeId);
  };

  // Save a single test case and mark it as saved in the preview
  const handleSave = async (testCase, index) => {
    try {
      setSaveError(null);
      await onSaveTestCase(testCase);
      setSavedIndices((prev) => new Set(prev).add(index));
    } catch (err) {
      setSaveError(err.message || "Failed to save test case. Please try again.");
    }
  };

  // Save all remaining (unsaved) test cases at once
  const handleSaveAll = async () => {
    setSaveError(null);
    for (let i = 0; i < generatedCases.length; i++) {
      if (!savedIndices.has(i)) {
        try {
          await onSaveTestCase(generatedCases[i]);
          setSavedIndices((prev) => new Set(prev).add(i));
        } catch (err) {
          setSaveError(err.message || `Failed to save test case #${i + 1}. Remaining cases were not saved.`);
          return;
        }
      }
    }
  };

  // Discard all generated cases and reset state
  const handleDiscard = () => {
    clear();
    setSavedIndices(new Set());
    setSaveError(null);
  };

  // The unsaved cases that still need review
  const unsavedCount = generatedCases.filter(
    (_, i) => !savedIndices.has(i)
  ).length;

  return (
    <div className="flex flex-col gap-3">
      {/* Generate button */}
      {generatedCases.length === 0 && (
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`${BTN_BASE} ${
            isGenerating
              ? "border-border-strong text-muted cursor-wait"
              : "border-primary text-primary hover:bg-primary/10"
          }`}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Generating...
            </span>
          ) : (
            "✦ AI Generate"
          )}
        </button>
      )}

      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 rounded-lg border border-error bg-error/10">
          <p className="text-sm text-error">{error}</p>
          <button
            onClick={handleGenerate}
            className="mt-2 text-sm text-error underline hover:no-underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      )}

      {/* Save error banner */}
      {saveError && (
        <div className="px-4 py-3 rounded-lg border border-error bg-error/10">
          <p className="text-sm text-error">{saveError}</p>
        </div>
      )}

      {/* Generated test cases preview */}
      {generatedCases.length > 0 && unsavedCount > 0 && (
        <div className="flex flex-col gap-3 p-4 rounded-lg border border-primary/30 bg-primary/5">
          {/* Preview header */}
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-primary">
              AI-Generated Test Cases
              <span className="ml-2 text-xs font-normal text-muted">
                Review before saving
              </span>
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleSaveAll}
                className={`${BTN_BASE} border-success text-success hover:bg-success/10`}
              >
                Save All ({unsavedCount})
              </button>
              <button
                onClick={handleDiscard}
                className={`${BTN_BASE} border-error text-error hover:bg-error/10`}
              >
                Discard
              </button>
            </div>
          </div>

          {/* Individual test case cards */}
          {generatedCases.map((tc, idx) => {
            // Skip already-saved test cases
            if (savedIndices.has(idx)) return null;

            return (
              <div
                key={idx}
                className="px-4 py-3 rounded-lg border border-border-subtle bg-bg-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold">
                    Test Case #{idx + 1}
                    {tc.is_hidden && (
                      <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded border border-border-strong text-muted uppercase">
                        Hidden
                      </span>
                    )}
                  </span>
                  <button
                    onClick={() => handleSave(tc, idx)}
                    className={`${BTN_BASE} border-success text-success hover:bg-success/10`}
                  >
                    Save
                  </button>
                </div>

                <div className="text-sm">
                  <div className="mb-1">
                    <strong>Input:</strong>
                    <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap text-xs">
                      {tc.input || "(empty)"}
                    </pre>
                  </div>
                  <div>
                    <strong>Expected Output:</strong>
                    <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap text-xs">
                      {tc.expected_output}
                    </pre>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All saved confirmation */}
      {generatedCases.length > 0 && unsavedCount === 0 && (
        <div className="px-4 py-3 rounded-lg border border-success bg-success/10">
          <p className="text-sm text-success font-medium">
            All generated test cases have been saved.
          </p>
          <button
            onClick={handleDiscard}
            className="mt-1 text-xs text-muted hover:text-success cursor-pointer"
          >
            Generate more
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateTestCasesButton;
