import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as challengeService from "../../services/challengeService";

const PARAM_TYPES = [
  "int", "float", "string", "bool", "int[]", "float[]", "string[]", "int[][]",
];

const ChallengeForm = ({ handleAddChallenge, handleUpdateChallenge }) => {
  const { challengeId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    data_structure_type: "",
    function_name: "",
    function_params: [],
    return_type: "string"
  });

  const [functionMode, setFunctionMode] = useState(false)

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengeData = await challengeService.show(challengeId);
      setFormData({
        title: challengeData.title || "",
        description: challengeData.description || "",
        difficulty: challengeData.difficulty || "easy",
        data_structure_type: challengeData.data_structure_type || "",
        function_name: challengeData.function_name || "",
        function_params: challengeData.function_params || [],
        return_type: challengeData.return_type || "string",
      });
      if (challengeData.function_name) setFunctionMode(true);
    };
    if (challengeId) fetchChallenge();
    return () => {
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        data_structure_type: "",
        function_name: "",
        function_params: [],
        return_type: "string",
      });
      setFunctionMode(false);
    };
  }, [challengeId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleAddParam = () => {
    setFormData({
      ...formData,
      function_params: [...formData.function_params, { name: "", type: "int"}],
    });
  };

  const handleRemoveParam = (index) => {
    setFormData({
      ...formData,
      function_params: formData.function_params.filter((_, i) => i !== index),
    });
  };

  const handleParamChange = (index, field, value) => {
    const updated = [...formData.function_params]
    updated[index] = {...updated[index], [field]: value};
    setFormData({...formData, function_params: updated});
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const payload = {
      ...formData,
      function_name: functionMode && formData.function_name ? formData.function_name : null,
      function_params: functionMode && formData.function_params ? formData.function_params : [],
      return_type: functionMode ? formData.return_type : "string",
    };
    if (challengeId) {
      handleUpdateChallenge(challengeId, payload);
    } else {
      handleAddChallenge(payload);
    }
  };

  return (
    <main>
      <h1>{challengeId ? "Edit Challenge" : "New Challenge"}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">Title</label>
        <input
          required
          type="text"
          name="title"
          id="title-input"
          value={formData.title}
          onChange={handleChange}
        />
        <label htmlFor="description-input">Description</label>
        <textarea
          required
          name="description"
          id="description-input"
          value={formData.description}
          onChange={handleChange}
        />
        <label htmlFor="difficulty-input">Difficulty</label>
        <select
          required
          name="difficulty"
          id="difficulty-input"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label htmlFor="data-structure-type-input">Data Structure Type</label>
        <select
          name="data_structure_type"
          id="data-structure-type-input"
          value={formData.data_structure_type}
          onChange={handleChange}
        >
          <option value="">-- Select (optional) --</option>
          <option value="array">Array</option>
          <option value="string">String</option>
          <option value="linked_list">Linked List</option>
          <option value="stack">Stack</option>
          <option value="queue">Queue</option>
          <option value="hash_table">Hash Table</option>
          <option value="tree">Tree</option>
          <option value="graph">Graph</option>
          <option value="heap">Heap</option>
          <option value="recursion">Recursion</option>
        </select>
        {/* function based testing section */}
        <div style={{ margin: "1rem 0", padding: "1rem", border: "1px solid #333", borderRadius: "8px" }}>
          <label>
            <input
              type="checkbox"
              checked={functionMode}
              onChange={(e) => setFunctionMode(e.target.checked)}
            />
            Enable function-based testing.
          </label>
          {functionMode && (
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label htmlFor="function-name-input">Function Name</label>
                <input
                  required
                  type="text"
                  name="function_name"
                  id="function_name_input"
                  value={formData.function_name}
                  onChange={handleChange}
                  placeholder="e.g. twoSum"
                />
              </div>
              <div>
                <label htmlFor="return-type-input">
                  Return Type
                </label>
                <select
                name="return_type"
                id="return-type-input"
                value={formData.return_type}
                onChange={handleChange}>
                  {PARAM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Parameters</label>
                {formData.function_params.map((param, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem", alignItems: "center" }}>
                    <input
                    type="text"
                    value={param.name}
                    onChange={(e) => handleParamChange(idx, "name", e.target.value)}
                    placeholder="param name"
                    style={{flex: 1}}
                    />
                    <select
                    value={param.type}
                    onChange={(e) => handleParamChange(idx, "type", e.target.value)}
                    >
                      {PARAM_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <button type="button" onClick={() => handleRemoveParam(idx)}
                      style={{ padding: "0.3em 0.6em", fontSize: "0.8em" }}>
                        Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddParam}
                style={{ fontSize: "0.85em" }}>
                  + Add Parameter
                </button>
              </div>
            </div>
          )}
        </div>
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default ChallengeForm;
