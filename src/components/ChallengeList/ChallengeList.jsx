import { Link } from "react-router";

const ChallengeList = ({ challenges }) => {
  return (
    <main>
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
