import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import CodeMirror from "@uiw/react-codemirror";
import { langs } from "@uiw/codemirror-extensions-langs";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import * as challengeService from '../../services/challengeService';
import * as submissionService from '../../services/submissionService';

const LANGUAGES = [
  { value: "python",label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

const LANGUAGE_EXTENSIONS = {
  python: () => langs.py(),
  javascript: () => langs.js(),
  java: () => langs.java(),
  cpp: () => langs.cpp(),
}
const newLine = `\n`;
const tab = `\t`;

const pythonStarterCode = `# Write your solution here${newLine}${newLine}def solution():${newLine}${tab}pass${newLine}`;
const javascriptStarterCode = `// Write your solution here${newLine}${newLine}function solution() {${newLine}${tab}${newLine}}${newLine}`;
const javaStarterCode = `// Write your solution here${newLine}${newLine}class Solution {${newLine}${tab}public void solve() {${newLine}${tab}${tab}${newLine}${tab}}${newLine}}${newLine}`;
const cppStarterCode = `// Write your solution here${newLine}${newLine}#include <iostream>${newLine}using namespace std;${newLine}${newLine}int main() {${newLine}${tab}${newLine}${tab}return 0;${newLine}}${newLine}`;


const STARTER_CODE = {
  python: pythonStarterCode,
  javascript: javascriptStarterCode,
  java: javaStarterCode,
  cpp: cppStarterCode
}

const PracticeView = () => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [code, setCode] = useState(STARTER_CODE.python);
  const [language, setLanguage] = useState("python");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengeData = await challengeService.show(challengeId);
      setChallenge(challengeData);
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
    setCode(STARTER_CODE[newLang]);
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
    setCode(STARTER_CODE[language]);
    setResult(null);
  };
if (!challenge) return <main style={{ textAlign: "center", padding: "2rem" }}>Loading...</main>
return (
  <main style={{ display: "flex", gap: "1.5rem", textAlign: "left", maxWidth: "100%" }}>
    {/* Left panel - Challenge description */}
    <section style={{ flex: "1", minWidth: "0", overflowY: "auto" }}>
      <Link to={`/challenges/${challengeId}`} style={{ display: "inline-block", marginBottom: "1rem", fontSize: "0.9em" }}>
        &larr; Back to challenge
      </Link>
      <header>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
          {challenge.difficulty && (
            <span style={{
              fontSize: "0.75em",
              fontWeight: "bold",
              padding: "0.2em 0.6em",
              borderRadius: "4px",
              border: "1px solid #646cff",
              color: "#646cff",
            }}>
              {challenge.difficulty.toUpperCase()}
            </span>
          )}
          {challenge.data_structure_type && (
            <span style={{
              fontSize: "0.75em",
              fontWeight: "bold",
              padding: "0.2em 0.6em",
              borderRadius: "4px",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              opacity: 0.8,
            }}>
              {challenge.data_structure_type.replace("_", " ").toUpperCase()}
            </span>
          )}
        </div>
        <h1 style={{ margin: "0.5rem 0", fontSize: "1.8em" }}>{challenge.title}</h1>
      </header>
      <p style={{ lineHeight: "1.6", opacity: 0.9 }}>{challenge.description}</p>
    </section>
    {/* Right panel - Code Editor */}
    <section style={{ flex: "1.5", minWidth: "0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label htmlFor="language-select">Language:</label>
          <select
            id="language-select"
            value={language}
            onChange={handleLanguageChange}
            style={{
              padding: "0.4em 0.8em",
              borderRadius: "8px",
              border: "1px solid #646cff",
              background: "#1a1a1a",
              color: "inherit",
              fontSize: "0.9em",
              cursor: "pointer",
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{
            fontFamily: "monospace",
            fontSize: "1.1em",
            fontWeight: "bold",
            minWidth: "3.5rem",
            textAlign: "center",
          }}>
            {formatTime(timer)}
          </span>
          <button
            onClick={() => setTimerActive(!timerActive)}
            style={{ borderColor: timerActive ? "#646cff" : "transparent" }}
          >
            {timerActive ? "Pause" : "Start timer"}
          </button>
          <button onClick={() => { setTimer(0); setTimerActive(false); }}>
            Reset
          </button>
        </div>
      </div>
      {/* Editor */}
      <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #333" }}>
        <CodeMirror
          value={code}
          height="400px"
          theme={vscodeDark}
          extensions={[LANGUAGE_EXTENSIONS[language]()]}
          onChange={handleCodeChange}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            background: "#646cff",
            color: "#fff",
            borderColor: "#646cff",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer",
          }}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
        <button onClick={handleReset}>Reset Code</button>
      </div>
      {/* Result */}
      {result && (
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          border: `1px solid ${result.error ? "#e53e3e" : "#48bb78"}`,
          background: result.error ? "rgba(229, 62, 62, 0.1)" : "rgba(72, 187, 120, 0.1)",
        }}>
          {result.error ? (
            <p style={{ margin: 0, color: "#e53e3e" }}>
              {result.error}
            </p>
          ) : (
            <>
              <p style={{ margin: "0 0 0.25rem 0", color: "#48bb78", fontWeight: "bold" }}>
                Status: {result.status || "Submitted"}
              </p>
              {result.id && (
                <p style={{ margin: 0, fontSize: "0.85em", opacity: 0.8 }}>
                  Submission ID: {result.id}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  </main>
  )
};

export default PracticeView;
