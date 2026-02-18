const BTN_BASE = "px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors";

const TestCaseList = ({ testCases, isAuthor, onEdit, onDelete }) => {
  if (!testCases || testCases.length === 0) {
    return (
      <p className="text-sm text-muted italic">No test cases yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {testCases.map((tc, idx) => {
        const isHiddenForViewer = tc.is_hidden && !isAuthor;

        return (
          <div
            key={tc.id}
            className={`px-4 py-3 rounded-lg border ${
              tc.is_hidden
                ? "border-border-strong bg-bg-darker"
                : "border-border-subtle bg-bg-card"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">
                {isHiddenForViewer
                  ? "Hidden Test Case"
                  : `Test Case #${idx + 1}`}
                {tc.is_hidden && isAuthor && (
                  <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded border border-border-strong text-muted uppercase">
                    Hidden
                  </span>
                )}
              </span>
              {isAuthor && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(tc)}
                    className={`${BTN_BASE} border-primary text-primary hover:bg-primary/10`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(tc.id)}
                    className={`${BTN_BASE} border-error text-error hover:bg-error/10`}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {!isHiddenForViewer && (
              <div className="text-sm">
                <div className="mb-1">
                  <strong>Input:</strong>
                  <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap">
                    {tc.input || "(empty)"}
                  </pre>
                </div>
                <div>
                  <strong>Expected Output:</strong>
                  <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap">
                    {tc.expected_output}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestCaseList;
