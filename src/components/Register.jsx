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
      if (values.username.length < 4) {
        setError("Username must be atleast 4 chararacters long");
        throw new Error("Username must be atleast 4 characters long");
      }
      if (values.username.length > 24) {
        setError("Username is too long");
        throw new Error("Username is too long");
      }
      if (values.username.search(/^[a-z0-9]+$/i) < 0) {
        setError("Name must contain only alphanumeric characters");
        throw new Error("Name must contain only alphanumeric characters");
      }
      if (values.password.length < 6) {
        setError("Password must be 6 or more characters");
        throw new Error("Password must be 6 or more characters");
      }
      if (values.password.search(/[a-z]/i) < 0) {
        setError("Password must contain at least one letter");
        throw new Error("Password must contain at least one letter");
      }
      if (values.password.search(/[0-9]/) < 0) {
        setError("Password must contain at least one digit");
        throw new Error("Password must contain at least one digit");
      }

      const EMAIL_REGEX =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (!EMAIL_REGEX.test(values.email)) {
        setError("Invalid email");
        throw new Error("Invalid email");
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
