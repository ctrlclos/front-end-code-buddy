import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as progressService from "../../services/progressService.js";
import * as submissionService from "../../services/submissionService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

// Maps difficulty levels to Tailwind class sets
const DIFFICULTY_CLASSES = {
  easy:   { text: 'text-success', bg: 'bg-success', border: 'border-success' },
  medium: { text: 'text-warning', bg: 'bg-warning', border: 'border-warning' },
  hard:   { text: 'text-error',   bg: 'bg-error',   border: 'border-error' },
};

// Maps submission status to Tailwind class sets
const STATUS_CLASSES = {
  passed:    { bg: 'bg-success', text: 'text-success' },
  failed:    { bg: 'bg-error',   text: 'text-error' },
  error:     { bg: 'bg-error',   text: 'text-error' },
  submitted: { bg: 'bg-muted',   text: 'text-muted' },
};

// Maps stat card colors to Tailwind text classes
const STAT_CARD_COLORS = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  muted:   "text-muted",
};

// Converts snake_case to space separated label (eg. hello_world -> hello world)
const formatLabel = (value) => value ? value.replace(/_/g, " ") : "";


const ProgressDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [expandedChallenge, setExpandedChallenge] = useState(null);
  const [challengeHistory, setChallengeHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  // Fetch stats and activity on mount
  useEffect(() => {
    const fetchData = async () => {
      const [statsData, activityData] = await Promise.all([
        progressService.getStats(),
        progressService.getActivity(),
      ]);

      if (statsData) setStats(statsData);
      if (activityData) setActivity(activityData);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Toggle submission history for a challenge
  const handleToggleHistory = async (itemId, challengeId) => {
    if (expandedChallenge === itemId) {
      setExpandedChallenge(null);
      setChallengeHistory([]);
      return;
    }

    const submissions = await submissionService.getSubmissions(challengeId);
    if (submissions) {
      setChallengeHistory(submissions);
    }
    setExpandedChallenge(itemId);
  };

  if (loading) return <main className="max-w-4xl mx-auto px-8 py-8">Loading...</main>;

  return (
    <main className="max-w-4xl mx-auto px-8 py-8">

      {/* Page Title */}
      <h1 className="mb-2 text-3xl font-bold">Progress Dashboard</h1>
      <p className="text-muted mb-8">
        Welcome back, {user.username}! Here's how you're doing.
      </p>

      {/* Stat Cards */}
      <section className="flex gap-4 mb-8 flex-wrap">
        {[
          {
            label: "Challenges Solved",
            value: stats ? stats.solved : 0,
            color: "success",
          },
          {
            label: "Solve Rate",
            value: stats ? `${stats.solve_rate}%` : "0%",
            color: "primary",
          },
          {
            label: "Attempted",
            value: stats
              ? `${stats.attempted} of ${stats.total_challenges}`
              : "0",
            color: "warning",
          },
          {
            label: "Total Submissions",
            value: stats ? stats.total_submissions : 0,
            color: "muted",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex-1 min-w-[180px] bg-bg-card rounded-xl p-5 text-center border border-border-subtle shadow-sm"
          >
            <div className={`text-3xl font-bold ${STAT_CARD_COLORS[card.color]}`}>
              {card.value}
            </div>
            <div className="text-muted text-sm mt-1">
              {card.label}
            </div>
          </div>
        ))}
      </section>

      {/* Difficulty Breakdown */}
      <section className="mb-8 bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
        <h2 className="mb-4 text-xl font-bold">By Difficulty</h2>

        {stats && stats.by_difficulty && stats.by_difficulty.length > 0 ? (
          stats.by_difficulty.map((item) => (
            <div key={item.difficulty} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1 text-sm">
                <span className={`font-semibold capitalize ${DIFFICULTY_CLASSES[item.difficulty]?.text || 'text-muted'}`}>
                  {item.difficulty}
                </span>
                <span className="text-muted">
                  {item.solved} / {item.attempted} solved
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-border-default rounded overflow-hidden">
                <div
                  className={`h-full rounded transition-all duration-500 ease-in-out ${DIFFICULTY_CLASSES[item.difficulty]?.bg || 'bg-primary'}`}
                  style={{
                    width: item.attempted > 0
                      ? `${(item.solved / item.attempted) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">
            No submissions yet. <Link to="/challenges" className="text-primary hover:text-primary-dark">Try a challenge!</Link>
          </p>
        )}
      </section>

      {/* Data Structure Breakdown */}
      {stats && stats.by_data_structure && stats.by_data_structure.length > 0 && (
        <section className="mb-8 bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
          <h2 className="mb-4 text-xl font-bold">By Data Structure</h2>

          {stats.by_data_structure.map((item) => (
            <div key={item.data_structure_type} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1 text-sm">
                <span className="text-primary font-semibold capitalize">
                  {formatLabel(item.data_structure_type)}
                </span>
                <span className="text-muted">
                  {item.solved} / {item.attempted} solved
                </span>
              </div>
              <div className="h-2.5 bg-border-default rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500 ease-in-out bg-primary"
                  style={{
                    width: item.attempted > 0
                      ? `${(item.solved / item.attempted) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Recent Activity Feed */}
      <section>
        <h2 className="mb-4 text-xl font-bold">Recent Activity</h2>

        {activity.length > 0 ? (
          activity.map((item) => (
            <div key={item.id}>
              {/* Activity Item Card */}
              <div className={`bg-bg-card border border-border-subtle rounded-lg px-5 py-4 shadow-sm ${
                expandedChallenge === item.id ? 'mb-0 rounded-b-none' : 'mb-3'
              }`}>
                <div className="flex justify-between items-center flex-wrap gap-2">
                  {/* Challenge name + metadata */}
                  <div>
                    <Link
                      to={`/challenges/${item.challenge_id}`}
                      className="font-semibold text-primary hover:text-primary-dark"
                    >
                      {item.challenge_title}
                    </Link>
                    <div className="text-sm text-muted mt-1">
                      {item.difficulty && (
                        <span className={`capitalize mr-3 ${DIFFICULTY_CLASSES[item.difficulty]?.text || 'text-muted'}`}>
                          {item.difficulty}
                        </span>
                      )}
                      {item.data_structure_type && (
                        <span className="mr-3 capitalize">
                          {formatLabel(item.data_structure_type)}
                        </span>
                      )}
                      <span className="mr-3">
                        {item.language}
                      </span>
                      <span>
                        {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status badge + history toggle */}
                  <div className="flex items-center gap-3">
                    <span className={`${STATUS_CLASSES[item.status]?.bg || 'bg-muted'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                      {item.status}
                    </span>

                    <button
                      onClick={() => handleToggleHistory(item.id, item.challenge_id)}
                      className="bg-transparent border border-primary text-primary px-2 py-1 rounded cursor-pointer text-sm hover:bg-primary/10 transition-colors"
                    >
                      {expandedChallenge === item.id
                        ? "Hide History"
                        : "View History"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded History Panel */}
              {expandedChallenge === item.id && (
                <div className="bg-bg-darker border border-border-subtle border-t-0 rounded-b-lg px-5 py-4 mb-3">
                  {challengeHistory.length > 0 ? (
                    <>
                      <p className="text-sm text-muted mb-3">
                        {challengeHistory.length} total attempt{challengeHistory.length !== 1 ? "s" : ""}
                      </p>

                      {/* First vs. latest attempt comparison */}
                      <div className="flex gap-4 flex-wrap">
                        {/* History is ordered DESC — last element is the first attempt */}
                        {(() => {
                          const first = challengeHistory[challengeHistory.length - 1];
                          const latest = challengeHistory[0];
                          return (
                            <>
                              <div className="flex-1 min-w-[250px] bg-bg-card rounded-lg p-4 border border-border-subtle shadow-sm">
                                <div className="text-sm text-muted mb-2">
                                  First Attempt &mdash; {new Date(first.submitted_at).toLocaleDateString()}
                                </div>
                                <span className={`${STATUS_CLASSES[first.status]?.bg || 'bg-muted'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                                  {first.status}
                                </span>
                                <div className="text-sm text-muted mt-2">
                                  Language: {first.language}
                                </div>
                              </div>

                              {/* Latest attempt (only if more than one attempt) */}
                              {challengeHistory.length > 1 && (
                                <div className="flex-1 min-w-[250px] bg-bg-card rounded-lg p-4 border border-border-subtle shadow-sm">
                                  <div className="text-sm text-muted mb-2">
                                    Latest Attempt &mdash; {new Date(latest.submitted_at).toLocaleDateString()}
                                  </div>
                                  <span className={`${STATUS_CLASSES[latest.status]?.bg || 'bg-muted'} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                                    {latest.status}
                                  </span>
                                  <div className="text-sm text-muted mt-2">
                                    Language: {latest.language}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    <p className="text-muted text-sm">
                      No submission history found.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-muted">
            No activity yet. <Link to="/challenges" className="text-primary hover:text-primary-dark">Start solving challenges!</Link>
          </p>
        )}
      </section>
    </main>
  );
};

export default ProgressDashboard;
