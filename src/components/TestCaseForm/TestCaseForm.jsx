import { useState, useEffect } from "react";

const INPUT_BASE = "w-full px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm focus:border-primary focus:outline-none";

const TestCaseForm = ({ existingTestCase, onSave, onCancel, challenge }) => {
  const isEditing = !!existingTestCase;
  const isFunctionBased = !!challenge?.function_name;

  const [formData, setFormData] = useState({
    input: "",
    expected_output: "",
    is_hidden: false,
  });
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (existingTestCase) {
      setFormData({
        input: existingTestCase.input ?? "",
        expected_output: existingTestCase.expected_output ?? "",
        is_hidden: existingTestCase.is_hidden ?? false,
      });
    } else {
      setFormData({ input: "", expected_output: "", is_hidden: false });
    }
    setValidationError(null);
  }, [existingTestCase]);

  const handleChange = (evt) => {
    const { name, value, type, checked } = evt.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    if (validationError) setValidationError(null);
  };

  const validateFunctionInput = (input) => {
    if (!input.trim()) return null;
    try {
      const parsed = JSON.parse(input);
      if (!Array.isArray(parsed)) {
        return "Input must be a JSON array of arguments, e.g. [[1,2,3], 5]";
      }
      const expectedCount = challenge?.function_params?.length ?? 0;
      if (expectedCount > 0 && parsed.length !== expectedCount) {
        return `Expected ${expectedCount} argument${expectedCount !== 1 ? "s" : ""} (${challenge.function_params.map((p) => p.name).join(", ")}), but got ${parsed.length}`;
      }
    } catch {
      return "Input is not valid JSON. Must be a JSON array, e.g. [[1,2,3], 5]";
    }
    return null;
  };

  const validateFunctionOutput = (output) => {
    try {
      JSON.parse(output);
    } catch {
      return "Expected output must be valid JSON, e.g. [0, 1] or \"hello\" or 42";
    }
    return null;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    if (isFunctionBased) {
      const inputError = validateFunctionInput(formData.input);
      if (inputError) {
        setValidationError(inputError);
        return;
      }
      const outputError = validateFunctionOutput(formData.expected_output);
      if (outputError) {
        setValidationError(outputError);
        return;
      }
    }

    onSave(formData);
  };

  const inputHint = isFunctionBased
    ? `JSON array of arguments passed to ${challenge.function_name}(). Each element maps to a parameter.`
    : "Raw text piped to stdin when the solution runs.";

  const outputHint = isFunctionBased
    ? `JSON value returned by ${challenge.function_name}(). Compared via JSON string match.`
    : "Raw text expected on stdout. Compared after trimming whitespace.";

  const inputPlaceholder = isFunctionBased
    ? `e.g. [${challenge.function_params?.map((p) => {
        const examples = { "int": "5", "float": "3.14", "string": '"hello"', "bool": "true", "int[]": "[1,2,3]", "float[]": "[1.0,2.5]", "string[]": '["a","b"]', "int[][]": "[[1,2],[3,4]]" };
        return examples[p.type] ?? "null";
      }).join(", ") ?? ""}]`
    : "e.g. hello world";

  const outputPlaceholder = isFunctionBased
    ? `e.g. [0, 1] or "result" or 42`
    : "e.g. expected output text";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-border-default rounded-lg bg-bg-darker">
      <h3 className="text-sm font-bold">{isEditing ? "Edit Test Case" : "New Test Case"}</h3>

      {isFunctionBased && (
        <div className="px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-sm">
          <p className="font-medium text-primary mb-1">Function-based challenge</p>
          <p className="font-mono text-xs text-muted">
            {challenge.function_name}(
            {challenge.function_params?.map((p) => `${p.name}: ${p.type}`).join(", ")}
            ) &rarr; {challenge.return_type}
          </p>
          <p className="text-xs text-muted mt-1">
            Input must be a JSON array of arguments. Output must be the JSON return value.
          </p>
        </div>
      )}

      {!isFunctionBased && (
        <div className="px-3 py-2 rounded-lg border border-border-subtle bg-bg-card text-sm">
          <p className="font-medium mb-1">Stdin / Stdout challenge</p>
          <p className="text-xs text-muted">
            Input is piped as raw text to stdin. Output is compared as plain text against stdout (whitespace-trimmed).
          </p>
        </div>
      )}

      {validationError && (
        <div className="px-3 py-2 rounded-lg border border-error bg-error/10">
          <p className="text-sm text-error">{validationError}</p>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="tc-input" className="text-sm font-medium">Input</label>
        <p className="text-xs text-muted">{inputHint}</p>
        <textarea
          name="input"
          id="tc-input"
          value={formData.input}
          onChange={handleChange}
          placeholder={inputPlaceholder}
          className={`${INPUT_BASE} min-h-[80px] font-mono text-sm placeholder:text-muted`}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="tc-expected-output" className="text-sm font-medium">Expected Output</label>
        <p className="text-xs text-muted">{outputHint}</p>
        <textarea
          required
          name="expected_output"
          id="tc-expected-output"
          value={formData.expected_output}
          onChange={handleChange}
          placeholder={outputPlaceholder}
          className={`${INPUT_BASE} min-h-[80px] font-mono text-sm placeholder:text-muted`}
        />
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_hidden"
          checked={formData.is_hidden}
          onChange={handleChange}
          className="accent-primary"
        />
        <span className="text-sm font-medium">Hidden test case</span>
        <span className="text-xs text-muted">(practitioners see pass/fail only)</span>
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark"
        >
          {isEditing ? "Update Test Case" : "Add Test Case"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg border border-border-default text-muted font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TestCaseForm;
