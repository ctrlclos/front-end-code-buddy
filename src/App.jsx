import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import NavBar from "./components/NavBar/Navbar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import { UserContext } from "./contexts/UserContext.jsx";

import * as hootService from "./services/hootService.js";

import HootList from "./components/HootList/HootList.jsx";
import HootDetails from "./components/HootDetails/HootDetails.jsx";
import HootForm from './components/HootForm/HootForm.jsx';

const App = () => {
  const { user } = useContext(UserContext);
  const [hoots, setHoots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllHoots = async () => {
      const hootsData = await hootService.index();
      setHoots(hootsData);
    };
    if (user) fetchAllHoots();
  }, [user]);

  const handleAddHoot = async (hootFormData) => {
    const newHoot = await hootService.create(hootFormData);
    setHoots([newHoot, ...hoots])
    navigate('/hoots');
  };

  const handleDeleteHoot = async (hootId) => {

    const deletedHoot = await hootService.deleteHoot(hootId);
    const filteredHoots = hoots.filter(hoot => hoot._id !== deletedHoot._id);
    setHoots(filteredHoots);
    navigate('/hoots');
  };

  const handleUpdateHoot = async (hootId, hootFormData) => {
    console.log(hootId, hootFormData);
    const updatedHoot = await hootService.updateHoot(hootId, hootFormData);
    setHoots(hoots.map(hoot => hoot._id === hootId ? updatedHoot : hoot))
    navigate(`/hoots/${hootId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        {user ? (
          <>
            <Route path="/hoots" element={<HootList hoots={hoots} />} />
            <Route path="/hoots/:hootId" element={<HootDetails handleDeleteHoot={handleDeleteHoot}/>} />
            <Route path="/hoots/new" element={<HootForm handleAddHoot={handleAddHoot} />} />
            <Route path="/hoots/:hootId/edit" element={<HootForm handleUpdateHoot={handleUpdateHoot} />} />
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
