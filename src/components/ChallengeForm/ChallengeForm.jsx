import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as challengeService from "../../services/challengeService";

const ChallengeForm = ({ handleAddChallenge, handleUpdateChallenge }) => {
  const { challengeId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "easy",
    data_structure_type: "",
  });

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengeData = await challengeService.show(challengeId);
      setFormData(challengeData);
    };
    if (challengeId) fetchChallenge();
    return () =>
      setFormData({
        title: "",
        description: "",
        difficulty: "easy",
        data_structure_type: "",
      });
  }, [challengeId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (challengeId) {
      handleUpdateChallenge(challengeId, formData);
    } else {
      handleAddChallenge(formData);
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
        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default ChallengeForm;
