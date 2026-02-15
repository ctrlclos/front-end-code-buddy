import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from "react";

import * as challengeService from "../../services/challengeService";
import * as testCaseService from "../../services/testCaseService";
import { UserContext } from "../../contexts/UserContext";
import TestCaseForm from "../TestCaseForm/TestCaseForm";
import TestCaseList from "../TestCaseList/TestCaseList";

const ChallengeDetails = ({ handleDeleteChallenge }) => {
  const { challengeId } = useParams();
  const [challenge, setChallenge] = useState(null);
  const { user } = useContext(UserContext);

  const [testCases, setTestCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTestCase, setEditingTestCase] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [challengeData, testCasesData] = await Promise.all([
        challengeService.show(challengeId),
        testCaseService.index(challengeId),
      ]);
      setChallenge(challengeData);
      setTestCases(Array.isArray(testCasesData) ? testCasesData : []);
    };
    fetchData();
  }, [challengeId]);

  const isAuthor = challenge?.author_id === user.id;

  const handleCreateTestCase = async (testCaseData) => {
    const created = await testCaseService.createTestCase(challengeId, testCaseData);
    setTestCases([...testCases, created]);
    setShowForm(false);
  };

  const handleUpdateTestCase = async (testCaseData) => {
    const updated = await testCaseService.updateTestCase(editingTestCase.id, testCaseData);
    setTestCases(testCases.map((tc) => (tc.id === updated.id ? updated : tc)));
    setEditingTestCase(null);
  };

  const handleDeleteTestCase = async (testCaseId) => {
    await testCaseService.removeTestCase(testCaseId);
    setTestCases(testCases.filter((tc) => tc.id !== testCaseId));
  };

  const handleEdit = (tc) => {
    setEditingTestCase(tc);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTestCase(null);
  };

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
            {isAuthor && (
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

      {/* Test Cases Section */}
      <section className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Test Cases</h2>
          {isAuthor && !showForm && !editingTestCase && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 rounded-lg border border-dashed border-primary/50 text-primary font-semibold text-sm hover:bg-primary/10 transition-colors"
            >
              + Add Test Case
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-4">
            <TestCaseForm onSave={handleCreateTestCase} onCancel={handleCancelForm} challenge={challenge} />
          </div>
        )}

        {editingTestCase && (
          <div className="mb-4">
            <TestCaseForm
              existingTestCase={editingTestCase}
              onSave={handleUpdateTestCase}
              onCancel={handleCancelForm}
              challenge={challenge}
            />
          </div>
        )}

        <TestCaseList
          testCases={testCases}
          isAuthor={isAuthor}
          onEdit={handleEdit}
          onDelete={handleDeleteTestCase}
        />
      </section>
    </main>
  );
};

export default ChallengeDetails;
