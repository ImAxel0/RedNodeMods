import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../handlers/authInputValidation";

const Register = () => {
  const [takenUsernames, setTakenUsernames] = useState([]);
  const [error, setError] = useState();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpw: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getTakenUsernames = async () => {
      let list = [];
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((user) => {
          list.push(user.data().username);
        });
        setTakenUsernames(list);
      } catch (error) {
        console.log(error);
      }
    };
    getTakenUsernames();
  }, []);

  const onRegistration = async (e) => {
    e.preventDefault();

    try {
      if (takenUsernames.includes(values.username)) {
        setError("Username already taken");
        throw new Error("Username already taken");
      }

      const errors = [];
      errors.push(...validateEmail(values.email));
      errors.push(...validateUsername(values.username));
      errors.push(...validatePassword(values.password));
      if (errors.length > 0) {
        setError(errors[0]);
        throw new Error(errors[0]);
      }

      if (values.password === values.confirmpw) {
        const res = await createUserWithEmailAndPassword(
          auth,
          values.email.toLowerCase(),
          values.password
        );
        await setDoc(doc(db, "users", res.user.uid), {
          username: values.username,
          email: values.email.toLowerCase(),
          canApprove: false,
          userId: res.user.uid,
        });
        navigate("/");
      } else {
        setError("Passwords do not match");
        throw new Error("Passwords do not match");
      }
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  const handleInput = (e) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="login">
      <form onSubmit={onRegistration}>
        <div className="login-inputs">
          <label htmlFor="username">Username</label>
          <input
            onChange={handleInput}
            type="text"
            id="username"
            name="username"
            maxLength="24"
            required
            autoComplete="off"
          />
          <label htmlFor="email">Email</label>
          <input
            onChange={handleInput}
            type="email"
            id="email"
            name="email"
            required
            autoComplete="off"
          />
          <label htmlFor="password">Password</label>
          <input
            onChange={handleInput}
            type="password"
            id="password"
            name="password"
            required
          />
          <label htmlFor="confirmpw">Confirm password</label>
          <input
            onChange={handleInput}
            type="password"
            id="confirmpw"
            name="confirmpw"
            required
          />
          {error && <span style={{ color: "red" }}>{error.message}</span>}
        </div>
        <button type="submit">Register</button>
      </form>
      <div className="register-btn">
        <p>Already registered?</p>
        <button
          onClick={() => {
            navigate("../login");
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Register;
