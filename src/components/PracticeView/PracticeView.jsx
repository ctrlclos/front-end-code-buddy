import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import * as challengeService from '../../services/challengeService';
import * as submissionService from '../../services/submissionService';
import VoiceCoach from "../VoiceCoach/VoiceCoach";
const LANGUAGES = [
  { value: "python",label: "Python" },
  { value: "javascript", label: "JavaScript" },
];

const LANGUAGE_EXTENSIONS = {
  python: () => langs.py(),
  javascript: () => langs.js(),
}

const STATUS_STYLES = {
  passed: { border: 'border-success', bg: 'bg-success/10', text: 'text-success' },
  failed: { border: 'border-error', bg: 'bg-error/10', text: 'text-error' },
  error:  { border: 'border-error', bg: 'bg-error/10', text: 'text-error' },
};

const BTN_BASE = "px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors";

const PracticeView = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const getStarterCode = (lang) => {
    return challenge?.starter_code?.[lang] || "";
  };

  const formatInput = (rawInput) => {
    const params = challenge?.function_params;
    if(!params || params.length === 0) return rawInput;
    try {
      const args = JSON.parse(rawInput)
      return params.map((p, i) => `${p.name} = ${JSON.stringify(args[i], null, 0)}`).join("\n");
    }catch{
      return rawInput;
    }
  }

  const formatOutput = (rawOutput) => {
    if(!challenge?.function_name) return rawOutput;
    try {
      const parsed = JSON.parse(rawOutput);
      return JSON.stringify(parsed, null, 0);
    } catch {
      return rawOutput;
    }
  }

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengeData = await challengeService.show(challengeId);
      setChallenge(challengeData);
      setCode(challengeData?.starter_code?.[language] || "");
    };
    fetchChallenge();
  }, [challengeId]);

  //timer
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCodeChange = useCallback((val) => {
    setCode(val);
  }, []);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    setCode(getStarterCode(newLang));
    setResult(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await submissionService.submit(challengeId, {
        code,
        language,
        notes: "",
      });
      setResult(response);
    } catch(err) {
      setResult({ error: "Submission failed. Please try again." });
    }
    setIsSubmitting(false);
  }

  const handleReset = () => {
    setCode(getStarterCode(language));
    setResult(null);
  };

if (!challenge) return <main className="max-w-7xl mx-auto px-8 py-8 text-center">Loading...</main>
return (
  <main className="max-w-7xl mx-auto px-8 py-8 flex gap-6 text-left">
    {/* Left panel - Challenge description */}
    <section className="flex-1 min-w-0 overflow-y-auto bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
      <Link to={`/challenges/${challengeId}`} className="inline-block mb-4 text-sm text-primary hover:text-primary-dark">
        &larr; Back to challenge
      </Link>
      <header>
        <div className="flex gap-2 flex-wrap mb-2">
          {challenge.difficulty && (
            <span className="text-xs font-bold px-2 py-1 rounded border border-primary text-primary">
              {challenge.difficulty.toUpperCase()}
            </span>
          )}
          {challenge.data_structure_type && (
            <span className="text-xs font-bold px-2 py-1 rounded border border-border-strong text-muted">
              {challenge.data_structure_type.replace("_", " ").toUpperCase()}
            </span>
          )}
        </div>
        {challenge.function_name && (
          <p className="font-mono text-sm text-muted my-2">
            {challenge.function_name}(
            {challenge.function_params?.map((p) => `${p.name}: ${p.type}`).join(", ")}
            ) &rarr; {challenge.return_type}
          </p>
        )}
        <h1 className="my-2 text-3xl font-bold">{challenge.title}</h1>
      </header>
      <p className="leading-relaxed text-muted">{challenge.description}</p>
    </section>
    {/* Right panel - Code Editor */}
    <section className="flex-[1.5] min-w-0 flex flex-col gap-3 bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
      {/* Toolbar */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="language-select" className="text-sm font-medium">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm text-sm cursor-pointer focus:border-primary focus:outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-lg font-bold min-w-[3.5rem] text-center">
            {formatTime(timer)}
          </span>
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`${BTN_BASE} ${timerActive ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-muted hover:border-primary hover:text-primary'}`}
          >
            {timerActive ? "Pause" : "Start timer"}
          </button>
          <button
            onClick={() => { setTimer(0); setTimerActive(false); }}
            className={`${BTN_BASE} border-border-default text-muted hover:border-primary hover:text-primary`}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Voice Coach */}
      <VoiceCoach />

      {/* Editor */}
      <div className="rounded-lg overflow-hidden border border-border-strong shadow-sm">
        <CodeMirror
          value={code}
          height="400px"
          theme={vscodeDark}
          extensions={[LANGUAGE_EXTENSIONS[language]()]}
          onChange={handleCodeChange}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`${BTN_BASE} bg-primary text-white border-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button
          onClick={handleReset}
          className={`${BTN_BASE} border-border-default text-muted hover:border-primary hover:text-primary`}
        >
          Reset Code
        </button>
      </div>
      {/* Result */}
      {result && (
        <div className="flex flex-col gap-2">
          {result.error ? (
            <div className="px-4 py-3 rounded-lg border border-error bg-error/10">
              <p className="m-0 text-error">{result.error}</p>
            </div>
          ) : result.test_results ? (
            <>
              <div className={`px-4 py-3 rounded-lg border ${STATUS_STYLES[result.status]?.border || 'border-border-default'} ${STATUS_STYLES[result.status]?.bg || ''}`}>
                <p className={`m-0 font-bold ${STATUS_STYLES[result.status]?.text || ''}`}>
                  {result.status === "passed" ? "All Tests Passed" : "Some Tests Failed"}
                  {" "}&mdash; {result.passed_count} / {result.total_count} passed
                </p>
              </div>
              {result.test_results.map((tr, idx) => (
                <div key={tr.test_case_id} className={`px-4 py-3 rounded-lg border ${
                  tr.is_hidden
                    ? 'border-border-strong bg-bg-darker'
                    : tr.passed
                      ? 'border-success bg-success/5'
                      : 'border-error bg-error/5'
                }`}>
                  <div className={`flex justify-between items-center ${tr.is_hidden ? '' : 'mb-2'}`}>
                    <span className={`font-bold ${tr.passed ? 'text-success' : 'text-error'}`}>
                      {tr.passed ? "PASS" : "FAIL"} &mdash; {tr.is_hidden ? "Hidden Test Case" : `Test Case #${idx + 1}`}
                    </span>
                    {tr.time && (
                      <span className="text-sm text-muted">{tr.time}s</span>
                    )}
                  </div>
                  {!tr.is_hidden && (
                    <div className="text-sm">
                      <div className="mb-1">
                        <strong>{challenge.function_name ? "Arguments" : "Input"}</strong>
                        <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap">{tr.input ? formatInput(tr.input) : "(empty)"}</pre>
                      </div>
                      <div className="mb-1">
                        <strong>Expected:</strong>
                        <pre className="my-1 px-2 py-1 bg-bg-darker border border-border-subtle rounded font-mono whitespace-pre-wrap">{formatOutput(tr.expected_output)}</pre>
                      </div>
                      {!tr.passed && tr.actual_output !== null && (
                        <div className="mb-1">
                          <strong className="text-error">Your Output:</strong>
                          <pre className="my-1 px-2 py-1 bg-error/10 border border-error/20 rounded font-mono whitespace-pre-wrap">{tr.actual_output ? formatOutput(tr.actual_output) : "(empty)"}</pre>
                        </div>
                      )}
                      {tr.error && (
                        <div>
                          <strong className="text-error">Error:</strong>
                          <pre className="my-1 px-2 py-1 bg-error/10 border border-error/20 rounded font-mono whitespace-pre-wrap text-sm">{tr.error}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className="px-4 py-3 rounded-lg border border-success bg-success/10">
              <p className="mb-1 text-success font-bold">
                Status: {result.status || "Submitted"}
              </p>
              {result.id && (
                <p className="m-0 text-sm text-muted">
                  Submission ID: {result.id}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  </main>
  )
};

export default PracticeView;
