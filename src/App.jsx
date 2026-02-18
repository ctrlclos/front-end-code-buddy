import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import NavBar from "./components/NavBar/Navbar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import PracticeView from './components/PracticeView/PracticeView.jsx';
import { UserContext } from "./contexts/UserContext.jsx";

import * as challengeService from "./services/challengeService.js";

import ChallengeList from "./components/ChallengeList/ChallengeList.jsx";
import ChallengeDetails from "./components/ChallengeDetails/ChallengeDetails.jsx";
import ChallengeForm from "./components/ChallengeForm/ChallengeForm.jsx";

import ProgressDashboard from '../src/components/ProgressDashboard/ProgressDashboard.jsx';

const App = () => {
  const { user } = useContext(UserContext);
  const [challenges, setChallenges] = useState([]);
  const navigate = useNavigate();

  const fetchChallenges = async (filters = {}) => {
    const challengesData = await challengeService.index(filters);
    setChallenges(Array.isArray(challengesData) ? challengesData : []);
  };
  useEffect(() => {
    if (user) fetchChallenges();
  }, [user]);

  const handleAddChallenge = async (challengeFormData) => {
    const newChallenge = await challengeService.create(challengeFormData);
    setChallenges([newChallenge, ...challenges]);
    navigate("/challenges");
  };

  const handleDeleteChallenge = async (challengeId) => {
    const deletedChallenge = await challengeService.deleteChallenge(challengeId);
    const filteredChallenges = challenges.filter(
      (challenge) => challenge.id !== deletedChallenge.id
    );
    setChallenges(filteredChallenges);
    navigate("/challenges");
  };

  const handleUpdateChallenge = async (challengeId, challengeFormData) => {
    const updatedChallenge = await challengeService.update(challengeId, challengeFormData);
    setChallenges(
      challenges.map((challenge) =>
        challenge.id === parseInt(challengeId) ? updatedChallenge : challenge
      )
    );
    navigate(`/challenges/${challengeId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route path="/challenges" element={<ChallengeList challenges={challenges} fetchChallenges={fetchChallenges}/>} />
            <Route path="/challenges/:challengeId" element={<ChallengeDetails handleDeleteChallenge={handleDeleteChallenge} />} />
            <Route path="/challenges/new" element={<ChallengeForm handleAddChallenge={handleAddChallenge} />} />
            <Route path="/challenges/:challengeId/edit" element={<ChallengeForm handleUpdateChallenge={handleUpdateChallenge} />} />
            <Route path="/challenges/:challengeId/practice" element={<PracticeView />} />
            <Route path="/progress" element={<ProgressDashboard/>} />
          </>
        ) : (
          <>
            <Route path="/sign-up" element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
