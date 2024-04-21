import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Navbar = () => {
  const { isLoggedOut } = UserAuth();
  const { user } = UserAuth();
  const [showUserPanel, setShowUserPanel] = useState(false);

  const navigate = useNavigate();

  const logout = async () => {
    try {
      await auth.signOut();
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo} alt="logo" width="40" />
        <Link to="/">
          <h2>RedNodeMods</h2>
        </Link>
      </div>
      <nav>
        <ul className="nav-links">
          <li>
            <a href="https://sotf-mods.com/mods" target="_blank">
              SOTF Mods
            </a>
          </li>
          <li>
            <a
              href="https://sotf-mods.com/mods/imaxel/rednodeloader"
              target="_blank"
            >
              RedNodeLoader
            </a>
          </li>
          <li>
            <a href="https://github.com/ImAxel0/RedNodeEditor" target="_blank">
              <FontAwesomeIcon
                size="2xl"
                color="white"
                icon="fa-brands fa-github"
              />
            </a>
          </li>
          {/* if logged display upload button, else display login link */}
          {!isLoggedOut ? (
            <>
              <li>
                <Link
                  style={{ color: "black" }}
                  className="login-link"
                  to="/upload"
                >
                  Upload
                </Link>
              </li>
              <li>
                <button
                  className="user-logo-btn"
                  onClick={() => setShowUserPanel(!showUserPanel)}
                >
                  {user?.username.at(0)}
                </button>
              </li>
              {showUserPanel && (
                <div className="user-panel">
                  <Link to="../profile">
                    <button onClick={() => setShowUserPanel(false)}>
                      Profile
                    </button>
                  </Link>
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </>
          ) : (
            <li>
              <Link
                style={{ color: "black" }}
                className="login-link"
                to="/login"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
