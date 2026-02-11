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

  if (!challenge) return <main>Loading...</main>;

  return (
    <main>
      <section>
        <header>
          <p>{challenge.difficulty.toUpperCase()}</p>
          <h1>{challenge.title}</h1>
          <p>
            {`${challenge.author_username} posted on
            ${new Date(challenge.created_at).toLocaleDateString()}`}
          </p>
          {challenge.author_id === user.id && (
            <>
              <Link to={`/challenges/${challengeId}/edit`}>Edit</Link>
              <button onClick={() => handleDeleteChallenge(challengeId)}>
                Delete
              </button>
            </>
          )}
        </header>
        <p>{challenge.description}</p>
      </section>
    </main>
  );
};

export default ChallengeDetails;
