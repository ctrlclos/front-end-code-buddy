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
          {challenge.difficulty && <p>{challenge.difficulty.toUpperCase()}</p>}
          {challenge.data_structure_type && (
            <p>{challenge.data_structure_type.replace("_", " ").toUpperCase()}</p>
          )}
          {challenge.is_curated && (<p style={{color: "#646cff", fontWeight: "bold"}}>CURATED</p>)}
          {challenge.function_name && (
            <p
              style={{ fontFamily: "monospace", fontSize: "0.9em", opacity: 0.8 }}
              >
                {challenge.function_name}(
                {challenge.function_params?.map((p) => `${p.name}: ${p.type}`).join(", ")}
                ) &rarr; {challenge.return_type}
              </p>
          )}
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
          <Link to={`/challenges/${challengeId}/practice`}>Practice</Link>
        </header>
        <p>{challenge.description}</p>
      </section>
    </main>
  );
};

export default ChallengeDetails;
