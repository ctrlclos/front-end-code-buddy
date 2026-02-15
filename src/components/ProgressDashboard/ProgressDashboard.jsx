import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import * as progressService from "../../services/progressService.js";
import * as submissionService from "../../services/submissionService.js";
import { UserContext } from "../../contexts/UserContext.jsx";

// Maps difficulty levels to display colors
const DIFFICULTY_COLORS = {
  easy: "#48bb78",
  medium: "#ecc94b",
  hard: "#e53e3e",
};

// Maps submission status to display colors
const STATUS_COLORS = {
  passed: "#48bb78",
  failed: "#e53e3e",
  error: "#e53e3e",
  submitted: "#a0aec0",
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
  const handleToggleHistory = async (challengeId) => {
    if (expandedChallenge === challengeId) {
      setExpandedChallenge(null);
      setChallengeHistory([]);
      return;
    }

    const submissions = await submissionService.getSubmissions(challengeId);
    if (submissions) {
      setChallengeHistory(submissions);
    }
    setExpandedChallenge(challengeId);
  };

  if (loading) return <main>Loading...</main>;

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>

      {/* Page Title */}
      <h1 style={{ marginBottom: "0.5rem" }}>Progress Dashboard</h1>
      <p style={{ color: "#a0aec0", marginBottom: "2rem" }}>
        Welcome back, {user.username}! Here's how you're doing.
      </p>

      {/* Stat Cards */}
      <section style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap",
      }}>
        {[
          {
            label: "Challenges Solved",
            value: stats ? stats.solved : 0,
            color: "#48bb78",
          },
          {
            label: "Solve Rate",
            value: stats ? `${stats.solve_rate}%` : "0%",
            color: "#646cff",
          },
          {
            label: "Attempted",
            value: stats
              ? `${stats.attempted} of ${stats.total_challenges}`
              : "0",
            color: "#ecc94b",
          },
          {
            label: "Total Submissions",
            value: stats ? stats.total_submissions : 0,
            color: "#a0aec0",
          },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              flex: "1 1 180px",
              background: "#1a1a2e",
              borderRadius: "12px",
              padding: "1.25rem",
              textAlign: "center",
              border: "1px solid #2a2a4a",
            }}
          >
            <div style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: card.color,
            }}>
              {card.value}
            </div>
            <div style={{ color: "#a0aec0", fontSize: "0.85rem", marginTop: "0.25rem" }}>
              {card.label}
            </div>
          </div>
        ))}
      </section>

      {/* Difficulty Breakdown */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>By Difficulty</h2>

        {stats && stats.by_difficulty && stats.by_difficulty.length > 0 ? (
          stats.by_difficulty.map((item) => (
            <div key={item.difficulty} style={{ marginBottom: "1rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
                fontSize: "0.9rem",
              }}>
                <span style={{
                  color: DIFFICULTY_COLORS[item.difficulty] || "#a0aec0",
                  fontWeight: "600",
                  textTransform: "capitalize",
                }}>
                  {item.difficulty}
                </span>
                <span style={{ color: "#a0aec0" }}>
                  {item.solved} / {item.attempted} solved
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: "10px",
                background: "#2a2a4a",
                borderRadius: "5px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: item.attempted > 0
                    ? `${(item.solved / item.attempted) * 100}%`
                    : "0%",
                  background: DIFFICULTY_COLORS[item.difficulty] || "#646cff",
                  borderRadius: "5px",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#a0aec0" }}>
            No submissions yet. <Link to="/challenges">Try a challenge!</Link>
          </p>
        )}
      </section>

      {/* Data Structure Breakdown */}
      {stats && stats.by_data_structure && stats.by_data_structure.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>By Data Structure</h2>

          {stats.by_data_structure.map((item) => (
            <div key={item.data_structure_type} style={{ marginBottom: "1rem" }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.25rem",
                fontSize: "0.9rem",
              }}>
                <span style={{ color: "#646cff", fontWeight: "600", textTransform: "capitalize" }}>
                  {formatLabel(item.data_structure_type)}
                </span>
                <span style={{ color: "#a0aec0" }}>
                  {item.solved} / {item.attempted} solved
                </span>
              </div>
              <div style={{
                height: "10px",
                background: "#2a2a4a",
                borderRadius: "5px",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: item.attempted > 0
                    ? `${(item.solved / item.attempted) * 100}%`
                    : "0%",
                  background: "#646cff",
                  borderRadius: "5px",
                  transition: "width 0.5s ease",
                }} />
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Recent Activity Feed */}
      <section>
        <h2 style={{ marginBottom: "1rem" }}>Recent Activity</h2>

        {activity.length > 0 ? (
          activity.map((item) => (
            <div key={item.id}>
              {/* Activity Item Card */}
              <div style={{
                background: "#1a1a2e",
                border: "1px solid #2a2a4a",
                borderRadius: "8px",
                padding: "1rem 1.25rem",
                marginBottom: expandedChallenge === item.challenge_id ? "0" : "0.75rem",
                borderBottomLeftRadius: expandedChallenge === item.challenge_id ? "0" : "8px",
                borderBottomRightRadius: expandedChallenge === item.challenge_id ? "0" : "8px",
              }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                }}>
                  {/* Challenge name + metadata */}
                  <div>
                    <Link
                      to={`/challenges/${item.challenge_id}`}
                      style={{ fontWeight: "600", fontSize: "1rem" }}
                    >
                      {item.challenge_title}
                    </Link>
                    <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginTop: "0.25rem" }}>
                      {item.difficulty && (
                        <span style={{
                          color: DIFFICULTY_COLORS[item.difficulty],
                          textTransform: "capitalize",
                          marginRight: "0.75rem",
                        }}>
                          {item.difficulty}
                        </span>
                      )}
                      {item.data_structure_type && (
                        <span style={{ marginRight: "0.75rem", textTransform: "capitalize" }}>
                          {formatLabel(item.data_structure_type)}
                        </span>
                      )}
                      <span style={{ marginRight: "0.75rem" }}>
                        {item.language}
                      </span>
                      <span>
                        {new Date(item.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Status badge + history toggle */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{
                      background: STATUS_COLORS[item.status] || "#a0aec0",
                      color: "#0f0f0f",
                      fontSize: "0.7rem",
                      fontWeight: "700",
                      padding: "0.2rem 0.6rem",
                      borderRadius: "4px",
                      textTransform: "uppercase",
                    }}>
                      {item.status}
                    </span>

                    <button
                      onClick={() => handleToggleHistory(item.challenge_id)}
                      style={{
                        background: "transparent",
                        border: "1px solid #646cff",
                        color: "#646cff",
                        padding: "0.25rem 0.6rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.8rem",
                      }}
                    >
                      {expandedChallenge === item.challenge_id
                        ? "Hide History"
                        : "View History"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded History Panel */}
              {expandedChallenge === item.challenge_id && (
                <div style={{
                  background: "#12121f",
                  border: "1px solid #2a2a4a",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  padding: "1rem 1.25rem",
                  marginBottom: "0.75rem",
                }}>
                  {challengeHistory.length > 0 ? (
                    <>
                      <p style={{ fontSize: "0.85rem", color: "#a0aec0", marginBottom: "0.75rem" }}>
                        {challengeHistory.length} total attempt{challengeHistory.length !== 1 ? "s" : ""}
                      </p>

                      {/* First vs. latest attempt comparison */}
                      <div style={{
                        display: "flex",
                        gap: "1rem",
                        flexWrap: "wrap",
                      }}>
                        {/* History is ordered DESC — last element is the first attempt */}
                        {(() => {
                          const first = challengeHistory[challengeHistory.length - 1];
                          const latest = challengeHistory[0];
                          return (
                            <>
                              <div style={{
                                flex: "1 1 250px",
                                background: "#1a1a2e",
                                borderRadius: "8px",
                                padding: "1rem",
                                border: "1px solid #2a2a4a",
                              }}>
                                <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginBottom: "0.5rem" }}>
                                  First Attempt &mdash; {new Date(first.submitted_at).toLocaleDateString()}
                                </div>
                                <span style={{
                                  background: STATUS_COLORS[first.status] || "#a0aec0",
                                  color: "#0f0f0f",
                                  fontSize: "0.7rem",
                                  fontWeight: "700",
                                  padding: "0.15rem 0.5rem",
                                  borderRadius: "4px",
                                  textTransform: "uppercase",
                                }}>
                                  {first.status}
                                </span>
                                <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginTop: "0.5rem" }}>
                                  Language: {first.language}
                                </div>
                              </div>

                              {/* Latest attempt (only if more than one attempt) */}
                              {challengeHistory.length > 1 && (
                                <div style={{
                                  flex: "1 1 250px",
                                  background: "#1a1a2e",
                                  borderRadius: "8px",
                                  padding: "1rem",
                                  border: "1px solid #2a2a4a",
                                }}>
                                  <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginBottom: "0.5rem" }}>
                                    Latest Attempt &mdash; {new Date(latest.submitted_at).toLocaleDateString()}
                                  </div>
                                  <span style={{
                                    background: STATUS_COLORS[latest.status] || "#a0aec0",
                                    color: "#0f0f0f",
                                    fontSize: "0.7rem",
                                    fontWeight: "700",
                                    padding: "0.15rem 0.5rem",
                                    borderRadius: "4px",
                                    textTransform: "uppercase",
                                  }}>
                                    {latest.status}
                                  </span>
                                  <div style={{ fontSize: "0.8rem", color: "#a0aec0", marginTop: "0.5rem" }}>
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
                    <p style={{ color: "#a0aec0", fontSize: "0.85rem" }}>
                      No submission history found.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: "#a0aec0" }}>
            No activity yet. <Link to="/challenges">Start solving challenges!</Link>
          </p>
        )}
      </section>
    </main>
  );
};

export default ProgressDashboard;
