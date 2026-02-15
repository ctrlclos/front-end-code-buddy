import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as challengeService from "../../services/challengeService";

const PARAM_TYPES = [
  "int", "float", "string", "bool", "int[]", "float[]", "string[]", "int[][]",
];

const INPUT_BASE = "w-full px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm focus:border-primary focus:outline-none";

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
    <main className="max-w-2xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">{challengeId ? "Edit Challenge" : "New Challenge"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title-input" className="text-sm font-medium">Title</label>
          <input
            required
            type="text"
            name="title"
            id="title-input"
            value={formData.title}
            onChange={handleChange}
            className={INPUT_BASE}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description-input" className="text-sm font-medium">Description</label>
          <textarea
            required
            name="description"
            id="description-input"
            value={formData.description}
            onChange={handleChange}
            className={`${INPUT_BASE} min-h-[120px]`}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="difficulty-input" className="text-sm font-medium">Difficulty</label>
          <select
            required
            name="difficulty"
            id="difficulty-input"
            value={formData.difficulty}
            onChange={handleChange}
            className={`${INPUT_BASE} cursor-pointer`}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="data-structure-type-input" className="text-sm font-medium">Data Structure Type</label>
          <select
            name="data_structure_type"
            id="data-structure-type-input"
            value={formData.data_structure_type}
            onChange={handleChange}
            className={`${INPUT_BASE} cursor-pointer`}
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
        </div>
        <div className="my-4 p-4 border border-border-default rounded-lg bg-bg-darker">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={functionMode}
              onChange={(e) => setFunctionMode(e.target.checked)}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Enable function-based testing.</span>
          </label>
          {functionMode && (
            <div className="mt-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="function-name-input" className="text-sm font-medium">Function Name</label>
                <input
                  required
                  type="text"
                  name="function_name"
                  id="function_name_input"
                  value={formData.function_name}
                  onChange={handleChange}
                  placeholder="e.g. twoSum"
                  className={`${INPUT_BASE} placeholder:text-muted`}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="return-type-input" className="text-sm font-medium">Return Type</label>
                <select
                  name="return_type"
                  id="return-type-input"
                  value={formData.return_type}
                  onChange={handleChange}
                  className={`${INPUT_BASE} cursor-pointer`}
                >
                  {PARAM_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium">Parameters</label>
                {formData.function_params.map((param, idx) => (
                  <div key={idx} className="flex gap-2 mb-2 items-center">
                    <input
                      type="text"
                      value={param.name}
                      onChange={(e) => handleParamChange(idx, "name", e.target.value)}
                      placeholder="param name"
                      className="flex-1 px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm placeholder:text-muted focus:border-primary focus:outline-none"
                    />
                    <select
                      value={param.type}
                      onChange={(e) => handleParamChange(idx, "type", e.target.value)}
                      className="px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm cursor-pointer focus:border-primary focus:outline-none"
                    >
                      {PARAM_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => handleRemoveParam(idx)} className="px-3 py-1.5 text-sm text-error border border-border-default rounded-lg hover:border-error hover:bg-error/10 transition-colors">
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddParam} className="text-sm text-primary font-medium border border-dashed border-primary/50 rounded-lg px-3 py-2 hover:bg-primary/10 transition-colors">
                  + Add Parameter
                </button>
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="w-full py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">SUBMIT</button>
      </form>
    </main>
  );
};

export default ChallengeForm;
