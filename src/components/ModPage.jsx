import { UserAuth } from "../context/AuthContext";
import thumbnailPlaceholder from "../assets/thumbnail-placeholder.jpg";
import { useState } from "react";
import Update from "./Update";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

const ModPage = ({ mod }) => {
  const { user } = UserAuth();
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const incDownloadCount = async () => {
    const modRef = doc(db, "mods", mod.id);
    await updateDoc(modRef, {
      downloadCount: mod.downloadCount + 1,
    });
  };

  const downloadMod = (modURL) => {
    const link = document.createElement("a");
    link.href = modURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    incDownloadCount();
  };

  return (
    <div className="mod-page">
      <h1>
        {mod.name}{" "}
        <span style={{ color: "green", fontWeight: "500" }}>
          by {mod.modAuthor ? mod.modAuthor : user?.username}
        </span>{" "}
        {!mod.isApproved && <span style={{ color: "red" }}>(unapproved)</span>}
      </h1>
      <div className="mod-page-content">
        <div className="mod-page-download">
          <img
            src={mod.thumbnailURL ? mod.thumbnailURL : thumbnailPlaceholder}
            alt="mod thumbnail"
          />
          <p>{mod.shortDescription}</p>
          <div className="mod-page-btns">
            <button
              className="btn-download"
              onClick={() => downloadMod(mod.modURL)}
            >
              Download {mod.modVersion}
            </button>
            {user?.userId === mod.userId && (
              <button
                className="btn-release"
                onClick={() => setShowUpdateForm(!showUpdateForm)}
              >
                Release new version
              </button>
            )}
          </div>
          <br />
          <small>
            Upload date: {mod.originalUploadDate} | Last update:{" "}
            {mod.uploadDate}
          </small>
          {showUpdateForm && <Update mod={mod} />}
        </div>
        <div className="mod-description">
          <textarea
            value={mod.description}
            cols="140"
            rows="1"
            readOnly
            disabled
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default ModPage;
