import { useState } from "react";
import { Link } from "react-router";

const DIFFICULTIES = ["easy", "medium", "hard"];
const DATA_STRUCTURES = [
  "array", "string", "linked_list", "stack", "queue",
  "hash_table", "tree", "graph", "heap", "recursion",
];

const formatLabel = (value) => value.replace("_", " ");

const FILTER_BASE = "px-3 py-1.5 rounded-lg text-sm font-medium border cursor-pointer transition-colors";

const ChallengeList = ({ challenges, fetchChallenges }) => {
  const [activeDifficulty, setActiveDifficulty] = useState("");
  const [activeDataStructure, setActiveDataStructure] = useState("");
  const [activeSort, setActiveSort] = useState("created_at");
  const [curatedFilter, setCuratedFilter] = useState("");

  const buildFilters = (overrides = {}) => ({
    difficulty: activeDifficulty || undefined,
    data_structure_type: activeDataStructure || undefined,
    is_curated: curatedFilter || undefined,
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

  const handleCuratedFilter = (value) => {
    const newValue = curatedFilter === value ? "" : value;
    setCuratedFilter(newValue);
    fetchChallenges(buildFilters({is_curated: newValue || undefined}));
  }

  return (
    <main className="max-w-4xl mx-auto px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Challenges</h1>

      {/* Filter section */}
      <section className="mb-6 bg-bg-card rounded-lg border border-border-subtle shadow-sm p-4">
        <div className="mb-3">
          <label htmlFor="sort-select" className="text-sm font-medium mr-2">Sort by: </label>
          <select id="sort-select" value={activeSort} onChange={handleSortChange} className="px-3 py-2 rounded-lg border border-border-strong bg-white shadow-sm cursor-pointer text-sm focus:border-primary focus:outline-none">
            <option value="created_at">Newest First</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        {/* Difficulty filters */}
        <div className="flex gap-2 justify-center flex-wrap">
          {DIFFICULTIES.map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyFilter(difficulty)}
              className={`${FILTER_BASE} ${activeDifficulty === difficulty ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-muted hover:border-primary hover:text-primary'}`}
            >
              {difficulty}
            </button>
          ))}
          {activeDifficulty && (
            <button
              onClick={() => handleDifficultyFilter("")}
              className={`${FILTER_BASE} border-border-default text-muted hover:text-error hover:border-error`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Data structure filters */}
        <div className="flex gap-2 justify-center flex-wrap mt-3">
          {DATA_STRUCTURES.map((ds) => (
            <button
              key={ds}
              onClick={() => handleDataStructureFilter(ds)}
              className={`${FILTER_BASE} ${activeDataStructure === ds ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-muted hover:border-primary hover:text-primary'}`}
            >
              {formatLabel(ds)}
            </button>
          ))}
          {activeDataStructure && (
            <button
              onClick={() => handleDataStructureFilter("")}
              className={`${FILTER_BASE} border-border-default text-muted hover:text-error hover:border-error`}
            >
              Clear
            </button>
          )}
        </div>

        {/* Curated filter */}
        <div className="flex gap-2 justify-center mt-3">
          <button
            onClick={() => handleCuratedFilter("true")}
            className={`${FILTER_BASE} ${curatedFilter === "true" ? 'border-primary bg-primary/10 text-primary' : 'border-border-default text-muted hover:border-primary hover:text-primary'}`}
          >
            Curated Questions
          </button>
          {curatedFilter && (
            <button
              onClick={() => handleCuratedFilter("")}
              className={`${FILTER_BASE} border-border-default text-muted hover:text-error hover:border-error`}
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Challenge cards */}
      {challenges.length > 0 ? (
        challenges.map((challenge) => (
          <Link key={challenge.id} to={`/challenges/${challenge.id}`} className="block no-underline text-inherit">
            <article className="p-4 mb-3 rounded-lg border border-border-subtle hover:border-primary transition-colors bg-bg-card shadow-sm">
              <header>
                <h2 className="text-lg font-bold mb-1">{challenge.title}</h2>
                <p className="text-muted text-sm mb-2">
                  {`${challenge.author_username} posted on
                  ${new Date(challenge.created_at).toLocaleDateString()}`}
                </p>
              </header>
              <p className="text-sm text-muted mb-2">{challenge.description}</p>
              <div className="flex gap-2 items-center">
                <span className="text-xs font-bold px-2 py-1 rounded border border-primary text-primary uppercase">{challenge.difficulty}</span>
                {challenge.is_curated && (
                  <span className="text-xs font-bold px-2 py-1 rounded border border-primary/50 text-primary bg-primary/10 uppercase">Curated</span>
                )}
                {challenge.data_structure_type && (
                  <span className="text-xs font-bold px-2 py-1 rounded border border-border-strong text-muted uppercase">{formatLabel(challenge.data_structure_type)}</span>
                )}
              </div>
            </article>
          </Link>
        ))
      ) : (
        <p className="text-muted text-center py-8">No challenges found. Try adjusting your filters or create a new challenge.</p>
      )}
    </main>
  );
};

export default ChallengeList;
