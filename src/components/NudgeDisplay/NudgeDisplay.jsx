const NudgeDisplay = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="px-4 py-3 rounded-lg border border-warning bg-warning/10 flex items-start gap-3">
      {/* left side - nudge message and subtitle */}
      <div className="flex-1">
        {/* actual nudge prompt */}
        <p className="text-sm font-medium text-warning">
          {message}
        </p>
        {/* encouraging subtitle */}
        <p className="text-xs text-muted mt-1">
          Keep talking — explain your thought process!
        </p>
      </div>
      {/* right side: dismiss button */}
      <button
        onClick={onDismiss}
        className="text-muted hover:text-warning text-sm cursor-pointer"
      >
        {/** The 'x' character */}
        &#x2715;
      </button>
    </div>
  );
};

export default NudgeDisplay;
