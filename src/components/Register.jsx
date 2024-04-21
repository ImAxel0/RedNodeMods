import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [error, setError] = useState();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmpw: "",
  });

  const navigate = useNavigate();

  /* adding user to db */
  const onRegistration = async (e) => {
    e.preventDefault();

    try {
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
        alert("Passwords do not match");
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
