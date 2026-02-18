import { useState, useEffect, useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import * as progressService from "../../services/progressService";

const STAT_CARD_COLORS = {
  success: "text-success",
  primary: "text-primary",
  warning: "text-warning",
  muted: "text-muted",
};

const DIFFICULTY_CLASSES = {
  easy: "text-success",
  medium: "text-warning",
  hard: "text-error",
};

const STATUS_CLASSES = {
  passed: "bg-success",
  failed: "bg-error",
  error: "bg-error",
  submitted: "bg-muted",
};

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [statsData, activityData] = await Promise.all([
        progressService.getStats(),
        progressService.getActivity(5),
      ]);
      if (statsData) setStats(statsData);
      if (activityData) setActivity(activityData);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return <main className="max-w-4xl mx-auto px-8 py-8">Loading...</main>;
  }

  return (
    <main className="max-w-4xl mx-auto px-8 py-8">
      {/* Welcome */}
      <h1 className="text-3xl font-bold mb-1">Welcome back, {user.username}</h1>
      <p className="text-muted mb-8">Here's a snapshot of your progress.</p>

      {/* Stat Cards */}
      <section className="flex gap-4 mb-8 flex-wrap">
        {[
          { label: "Solved", value: stats ? stats.solved : 0, color: "success" },
          { label: "Solve Rate", value: stats ? `${stats.solve_rate}%` : "0%", color: "primary" },
          { label: "Attempted", value: stats ? `${stats.attempted} of ${stats.total_challenges}` : "0", color: "warning" },
          { label: "Submissions", value: stats ? stats.total_submissions : 0, color: "muted" },
        ].map((card) => (
          <div
            key={card.label}
            className="flex-1 min-w-[140px] bg-bg-card rounded-xl p-5 text-center border border-border-subtle shadow-sm"
          >
            <div className={`text-3xl font-bold ${STAT_CARD_COLORS[card.color]}`}>
              {card.value}
            </div>
            <div className="text-muted text-sm mt-1">{card.label}</div>
          </div>
        ))}
      </section>

      {/* Recent Activity */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>

        {activity.length > 0 ? (
          <div className="bg-bg-card rounded-lg border border-border-subtle shadow-sm divide-y divide-border-subtle">
            {activity.map((item) => (
              <Link
                key={item.id}
                to={`/challenges/${item.challenge_id}/practice`}
                className="flex justify-between items-center px-5 py-3 hover:bg-primary/5 transition-colors"
              >
                <div>
                  <span className="font-medium">{item.challenge_title}</span>
                  <div className="text-sm text-muted mt-0.5">
                    {item.difficulty && (
                      <span className={`capitalize mr-3 ${DIFFICULTY_CLASSES[item.difficulty] || "text-muted"}`}>
                        {item.difficulty}
                      </span>
                    )}
                    <span className="mr-3">{item.language}</span>
                    <span>{new Date(item.submitted_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <span className={`${STATUS_CLASSES[item.status] || "bg-muted"} text-white text-xs font-bold px-2 py-1 rounded uppercase`}>
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6 text-center">
            <p className="text-muted">
              No submissions yet.{" "}
              <Link to="/challenges" className="text-primary hover:text-primary-dark">
                Start practicing!
              </Link>
            </p>
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="flex gap-3">
        <Link
          to="/challenges"
          className="px-5 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          Browse Challenges
        </Link>
        <Link
          to="/progress"
          className="px-5 py-2.5 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
        >
          View Full Progress
        </Link>
      </section>
    </main>
  );
};

export default Dashboard;
