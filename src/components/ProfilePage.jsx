import React from "react";
import { UserAuth } from "../context/AuthContext";
import ModCard from "./ModCard";

const ProfilePage = ({ mods }) => {
  const { user } = UserAuth();

  return (
    <div className="mod-list">
      <h1 style={{ textAlign: "center", margin: "50px" }}>Your mods</h1>
      <div className="mods-grid">
        {mods.map(
          (mod) =>
            mod.userId === user.userId && <ModCard key={mod.id} mod={mod} />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
