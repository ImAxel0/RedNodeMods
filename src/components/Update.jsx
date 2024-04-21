import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { uploadFile } from "../handlers/fileUpload";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const Update = ({ mod }) => {
  const { user } = UserAuth();
  const [error, setError] = useState();
  const [values, setValues] = useState({
    shortDescription: "",
    description: "",
    thumbnail: null,
    modFile: null,
    modVersion: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      shortDescription: mod.shortDescription,
      description: mod.description,
      modVersion: mod.modVersion,
    }));
  }, []);

  function bytesToMB(bytes) {
    return bytes / (1024 * 1024);
  }

  const handleInput = (e) => {
    if (e.target.name === "thumbnail") {
      setValues({
        ...values,
        thumbnail: e.target.files[0],
      });
    } else if (e.target.name === "modFile") {
      setValues({
        ...values,
        modFile: e.target.files[0],
      });
    } else {
      setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const onModUpdate = async (e) => {
    e.preventDefault();
    const THUMBNAIL_SIZE_LIMIT = 2;
    const ZIP_FILE_LIMIT = 25;

    try {
      if (values.thumbnail) {
        const thumbExt = values.thumbnail.name.split(".").pop();
        if (thumbExt !== "png" && thumbExt !== "jpg") {
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

      let thumbnailURL = "";
      if (values.thumbnail) {
        thumbnailURL = await uploadFile(
          values.thumbnail,
          `Mods/${user.username}-${user.userId}/${mod.name}/thumbnail.png`
        );
      } else {
        thumbnailURL = mod.thumbnailURL;
      }
      const modURL = await uploadFile(
        values.modFile,
        `Mods/${user.username}-${user.userId}/${mod.name}/${mod.name}.zip`
      );

      const modRef = doc(db, "mods", mod.id);
      await updateDoc(modRef, {
        shortDescription: values.shortDescription,
        description: values.description,
        thumbnailURL: thumbnailURL,
        modURL: modURL,
        modVersion: values.modVersion,
        uploadDate: date,
      });
      navigate("/");
      window.location.reload();
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };

  return (
    <div className="update">
      <h2>Updating mod</h2>
      <br />
      <form className="upload-form" onSubmit={onModUpdate}>
        <input
          type="text"
          name="shortDescription"
          placeholder="Description preview (max 84 char)"
          maxLength="84"
          onChange={handleInput}
          defaultValue={mod.shortDescription}
        />
        <label htmlFor="description">Description:</label>
        <textarea
          name="description"
          cols="30"
          rows="10"
          id="description"
          onChange={handleInput}
          defaultValue={mod.description}
        />
        <label htmlFor="modVersion">New mod version:</label>
        <input
          type="text"
          pattern="[0-9]*.[0-9]*.[0-9]*"
          name="modVersion"
          placeholder="1.0.0"
          onChange={handleInput}
          defaultValue={mod.modVersion}
          required
        />
        <div className="upload-file">
          <label htmlFor="thumbnail">
            Thumbnail <small>(leave empty to keep current one) (max 2MB)</small>
          </label>
          <input
            type="file"
            id="thumbnail"
            name="thumbnail"
            onChange={handleInput}
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
        <button type="submit">Update mod</button>
      </form>
    </div>
  );
};

export default Update;
