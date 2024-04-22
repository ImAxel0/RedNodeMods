import "./App.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import Navbar from "./components/Navbar";
import ModList from "./components/ModList";
import ModPage from "./components/ModPage";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Upload from "./components/Upload";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import ProfilePage from "./components/ProfilePage";
import { UserAuth } from "./context/AuthContext";

function App() {
  const [mods, setMods] = useState([]);
  const { user } = UserAuth();

  useEffect(() => {
    const getMods = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "mods"));
        querySnapshot.forEach((mod) => {
          list.push({ id: mod.id, ...mod.data() });
        });
        setMods(list);
      } catch (error) {
        console.log(error);
      }
    };
    getMods();
  }, []);

  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" exact element={<ModList mods={mods} />}></Route>
        {mods.map((mod) => (
          <Route
            key={mod.id}
            path={`/${mod.id}`}
            element={<ModPage mod={mod} />}
          ></Route>
        ))}
        {!user && <Route path="/login" element={<Login />}></Route>}
        {!user && <Route path="/register" element={<Register />}></Route>}
        {user && <Route path="/upload" element={<Upload />}></Route>}
        {user && (
          <Route path="/profile" element={<ProfilePage mods={mods} />}></Route>
        )}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
library.add(fab, fas, far);
