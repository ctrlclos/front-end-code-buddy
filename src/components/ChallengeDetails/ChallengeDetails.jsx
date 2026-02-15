import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from "react";

import * as challengeService from "../../services/challengeService";
import { UserContext } from "../../contexts/UserContext";

const ChallengeDetails = ({ handleDeleteChallenge }) => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchChallenge = async () => {
      const challengeData = await challengeService.show(challengeId);
      setChallenge(challengeData);
    };
    fetchChallenge();
  }, [challengeId]);

  if (!challenge) return <main className="max-w-4xl mx-auto px-8 py-8 text-center">Loading...</main>;

  return (
    <main className="max-w-4xl mx-auto px-8 py-8">
      <section className="bg-bg-card rounded-lg border border-border-subtle shadow-sm p-6">
        <header className="mb-4">
          <div className="flex gap-2 flex-wrap mb-2">
            {challenge.difficulty && (
              <span className="text-xs font-bold px-2 py-1 rounded border border-primary text-primary uppercase">{challenge.difficulty}</span>
            )}
            {challenge.data_structure_type && (
              <span className="text-xs font-bold px-2 py-1 rounded border border-border-strong text-muted uppercase">{challenge.data_structure_type.replace("_", " ")}</span>
            )}
            {challenge.is_curated && (
              <span className="text-xs font-bold px-2 py-1 rounded border border-primary/50 text-primary bg-primary/10 uppercase">Curated</span>
            )}
          </div>
          {challenge.function_name && (
            <p className="font-mono text-sm text-muted mb-2">
                {challenge.function_name}(
                {challenge.function_params?.map((p) => `${p.name}: ${p.type}`).join(", ")}
                ) &rarr; {challenge.return_type}
              </p>
          )}
          <h1 className="text-3xl font-bold my-2">{challenge.title}</h1>
          <p className="text-muted text-sm mb-4">
            {`${challenge.author_username} posted on
            ${new Date(challenge.created_at).toLocaleDateString()}`}
          </p>
          <div className="flex gap-3 items-center">
            {challenge.author_id === user.id && (
              <>
                <Link to={`/challenges/${challengeId}/edit`} className="px-4 py-2 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/10 transition-colors">Edit</Link>
                <button onClick={() => handleDeleteChallenge(challengeId)} className="px-4 py-2 rounded-lg border border-error text-error font-semibold text-sm hover:bg-error/10 transition-colors cursor-pointer">
                  Delete
                </button>
              </>
            )}
            <Link to={`/challenges/${challengeId}/practice`} className="px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark text-sm">Practice</Link>
          </div>
        </header>
        <p className="leading-relaxed text-muted">{challenge.description}</p>
      </section>
    </main>
  );
};

export default ChallengeDetails;
