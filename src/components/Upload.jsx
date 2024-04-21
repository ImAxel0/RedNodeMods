import { useState } from "react";
import ModCard from "./ModCard";
import ModPage from "./ModPage";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { UserAuth } from "../context/AuthContext";
import { uploadFile } from "../handlers/fileUpload";

const Upload = () => {
  const { user } = UserAuth();
  const [error, setError] = useState();
  const [thumbnailPrev, setThumbnailPrev] = useState();
  const [values, setValues] = useState({
    name: "",
    shortDescription: "",
    description: "",
    thumbnail: null,
    modFile: null,
    modVersion: "1.0.0",
  });

  const navigate = useNavigate();

  function bytesToMB(bytes) {
    return bytes / (1024 * 1024);
  }

  const handleInput = (e) => {
    if (e.target.name === "thumbnail") {
      setValues({
        ...values,
        thumbnail: e.target.files[0],
      });
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPrev(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else if (e.target.name === "modFile") {
      setValues({
        ...values,
        modFile: e.target.files[0],
      });
    } else {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const onModUpload = async (e) => {
    e.preventDefault();
    const THUMBNAIL_SIZE_LIMIT = 2;
    const ZIP_FILE_LIMIT = 25;

    try {
      const thumbExt = values.thumbnail.name.split(".").pop();
      if (thumbExt !== "png" && thumbExt !== "jpg" && thumbExt !== "jpeg") {
        setError("Thumbnail file must be a png or jpg file.");
        throw new Error("Thumbnail file must be a png or jpg file.");
      }
      if (bytesToMB(values.thumbnail.size) > THUMBNAIL_SIZE_LIMIT) {
        setError(
          `Thumbnail size exceeds the limit of ${THUMBNAIL_SIZE_LIMIT}MB.`
        );
        throw new Error(
          `Thumbnail size exceeds the limit of ${THUMBNAIL_SIZE_LIMIT}MB.`
        );
      }

      const modExt = values.modFile.name.split(".").pop();
      if (modExt !== "zip") {
        setError("Mod file must be a zip file.");
        throw new Error("Mod file must be a zip file.");
      }
      if (bytesToMB(values.modFile.size) > ZIP_FILE_LIMIT) {
        setError(`Mod file size exceeds the limit of ${ZIP_FILE_LIMIT}MB.`);
        throw new Error(
          `Mod file size exceeds the limit of ${ZIP_FILE_LIMIT}MB.`
        );
      }

      let date = new Date().toLocaleDateString("it-IT");

      const thumbnailURL = await uploadFile(
        values.thumbnail,
        `Mods/${user.username}-${user.userId}/${values.name}/thumbnail.png`
      );
      const modURL = await uploadFile(
        values.modFile,
        `Mods/${user.username}-${user.userId}/${values.name}/${values.name}.zip`
      );

      await addDoc(collection(db, "mods"), {
        modAuthor: user.username,
        name: values.name,
        shortDescription: values.shortDescription,
        description: values.description,
        thumbnailURL: thumbnailURL,
        modURL: modURL,
        modVersion: values.modVersion,
        userId: auth.currentUser.uid,
        originalUploadDate: date,
        uploadDate: date,
        isApproved: false,
        downloadCount: 0,
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div className="upload">
        <form className="upload-form" onSubmit={onModUpload}>
          <label htmlFor="name">Mod name</label>
          <input
            type="text"
            name="name"
            placeholder="Mod name"
            onChange={handleInput}
            required
          />
          <label htmlFor="shortDescription">
            Description preview <small>(max 84 char)</small>
          </label>
          <input
            type="text"
            name="shortDescription"
            placeholder="Description preview"
            maxLength="84"
            onChange={handleInput}
            required
          />
          <label htmlFor="description">Description:</label>
          <textarea
            name="description"
            cols="30"
            rows="10"
            id="description"
            onChange={handleInput}
            required
          />
          <label htmlFor="modVersion">
            Mod version <small>(eg. 1.0.0)</small>
          </label>
          <input
            type="text"
            pattern="[0-9]*.[0-9]*.[0-9]*"
            name="modVersion"
            placeholder="1.0.0"
            onChange={handleInput}
            required
          />
          <div className="upload-file">
            <label htmlFor="thumbnail">
              Thumbnail <small>(max 2MB)</small>
            </label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              onChange={handleInput}
              required
            />
          </div>
          <div className="upload-file">
            <label htmlFor="rmod">
              Mod file <small>(max 25MB as .zip format)</small>
            </label>
            <input
              type="file"
              id="rmod"
              name="modFile"
              onChange={handleInput}
              required
            />
          </div>
          {error && <span style={{ color: "red" }}>{error}</span>}
          <button type="submit">Upload mod</button>
        </form>
        <div className="upload-preview">
          <h2>Mod card preview</h2>
          <br />
          <ModCard
            mod={{
              name: values.name,
              shortDescription: values.shortDescription,
              thumbnailURL: thumbnailPrev,
            }}
          />
        </div>
      </div>
      <div className="mod-preview">
        <hr />
        <ModPage
          mod={{
            name: values.name,
            shortDescription: values.shortDescription,
            description: values.description,
            thumbnailURL: thumbnailPrev,
          }}
        />
      </div>
    </>
  );
};

export default Upload;