import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const uploadFile = async (file, path, setProgressCallback) => {
  try {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(file.name + "upload is" + progress + "% done");
          setProgressCallback(progress);
          switch (snapshot.state) {
            case "paused":
              break;
            case "running":
              break;
          }
        },
        (error) => {
          // failed upload
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log(file.name + " available at ", downloadURL);
              resolve(downloadURL);
            })
            .catch((error) => {
              // Error getting download URL
              console.log(error);
              reject(error);
            });
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};
