import { useState } from "react";
import { Link } from "react-router";

const DIFFICULTIES = ["easy", "medium", "hard"]

const ChallengeList = ({ challenges, fetchChallenges }) => {
  const [activeDifficulty, setActiveDifficulty] = useState("");
  const [activeSort, setActiveSort] = useState("created_at");

  const handleDifficultyFilter = (difficulty) => {
    const newDifficulty = activeDifficulty === difficulty ? "" : difficulty;
    setActiveDifficulty(newDifficulty)
    fetchChallenges({
      difficulty: newDifficulty || undefined,
      sort_by: activeSort,
    });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setActiveSort(newSort);

    fetchChallenges({
      difficulty: activeDifficulty || undefined,
      sort_by: newSort,
    });
  };

  return (
    <main>
      <section style={{ marginBottom: "1.5rem"}}>
        <div style={{ margiBottom: "0.75rem"}}>
          <label htmlFor="sort-select">Sort by: </label>
          <select id="sort-select" value={activeSort} onChange={handleSortChange}>
            <option value="created_at">Newest First</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        <div style={{display: "flex", gap: "0.5rem", justifyContent: "center"}}>
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyFilter(difficulty)}
              style={{
                borderColor: activeDifficulty === difficulty ? "#646cff" : "transparent",
              }}>
                {difficulty}
            </button>
          ))}
          {activeDifficulty && (
            <button
              onClick={() => handleDifficultyFilter("")}
              style={{borderColor: "transparent"}}
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
          </article>
        </Link>
      ))}
    </main>
  );
};

export default ChallengeList;
