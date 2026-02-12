import { useState } from "react";
import { Link } from "react-router";

const DIFFICULTIES = ["easy", "medium", "hard"];
const DATA_STRUCTURES = [
  "array", "string", "linked_list", "stack", "queue",
  "hash_table", "tree", "graph", "heap", "recursion",
];

const formatLabel = (value) => value.replace("_", " ");

const ChallengeList = ({ challenges, fetchChallenges }) => {
  const [activeDifficulty, setActiveDifficulty] = useState("");
  const [activeDataStructure, setActiveDataStructure] = useState("");
  const [activeSort, setActiveSort] = useState("created_at");

  const buildFilters = (overrides = {}) => ({
    difficulty: activeDifficulty || undefined,
    data_structure_type: activeDataStructure || undefined,
    sort_by: activeSort,
    ...overrides,
  });

  const handleDifficultyFilter = (difficulty) => {
    const newDifficulty = activeDifficulty === difficulty ? "" : difficulty;
    setActiveDifficulty(newDifficulty);
    fetchChallenges(buildFilters({ difficulty: newDifficulty || undefined }));
  };

  const handleDataStructureFilter = (dataStructure) => {
    const newDs = activeDataStructure === dataStructure ? "" : dataStructure;
    setActiveDataStructure(newDs);
    fetchChallenges(buildFilters({ data_structure_type: newDs || undefined }));
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setActiveSort(newSort);
    fetchChallenges(buildFilters({ sort_by: newSort }));
  };

  return (
    <main>
      <section style={{ marginBottom: "1.5rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <label htmlFor="sort-select">Sort by: </label>
          <select id="sort-select" value={activeSort} onChange={handleSortChange}>
            <option value="created_at">Newest First</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyFilter(difficulty)}
              style={{
                borderColor: activeDifficulty === difficulty ? "#646cff" : "transparent",
              }}
            >
              {difficulty}
            </button>
          ))}
          {activeDifficulty && (
            <button
              onClick={() => handleDifficultyFilter("")}
              style={{ borderColor: "transparent" }}
            >
              Clear
            </button>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap", marginTop: "0.75rem" }}>
          {DATA_STRUCTURES.map((ds) => (
            <button
              key={ds}
              onClick={() => handleDataStructureFilter(ds)}
              style={{
                borderColor: activeDataStructure === ds ? "#646cff" : "transparent",
              }}
            >
              {formatLabel(ds)}
            </button>
          ))}
          {activeDataStructure && (
            <button
              onClick={() => handleDataStructureFilter("")}
              style={{ borderColor: "transparent" }}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {challenges.map((challenge) => (
        <Link key={challenge.id} to={`/challenges/${challenge.id}`}>
          <article>
            <header>
              <h2>{challenge.title}</h2>
              <p>
                {`${challenge.author_username} posted on
                ${new Date(challenge.created_at).toLocaleDateString()}`}
              </p>
            </header>
            <p>{challenge.description}</p>
            <p>{challenge.difficulty}</p>
            {challenge.data_structure_type && (
              <p>{formatLabel(challenge.data_structure_type)}</p>
            )}
          </article>
        </Link>
      ))}
    </main>
  );
};

export default ChallengeList;
