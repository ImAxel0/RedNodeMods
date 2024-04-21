import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [error, setError] = useState();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      navigate("/");
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
      <form onSubmit={onLogin}>
        <div className="login-inputs">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleInput}
            type="email"
            id="email"
            name="email"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            onChange={handleInput}
            type="password"
            id="password"
            name="password"
            required
          />
          {error && <span style={{ color: "red" }}>{error.message}</span>}
        </div>
        <button type="submit">Login</button>
      </form>
      <div className="register-btn">
        <p>Not registered?</p>
        <button
          onClick={() => {
            navigate("../register");
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
