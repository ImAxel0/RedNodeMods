import { Link } from "react-router-dom";
import thumbnailPlaceholder from "../assets/thumbnail-placeholder.jpg";
import { UserAuth } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ModCard = ({ mod }) => {
  function ButtonLink({ to, children }) {
    return (
      <Link to={to}>
        <button>{children}</button>
      </Link>
    );
  }

  const { user } = UserAuth();

  return (
    <div className="mod-card">
      <img
        src={mod.thumbnailURL ? mod.thumbnailURL : thumbnailPlaceholder}
        alt="mod thumbnail"
      />
      <div className="mod-card-text">
        <h3>
          {mod.name}{" "}
          {!mod.isApproved && (
            <span style={{ color: "red" }}>(unapproved)</span>
          )}
        </h3>
        <small>
          <p>
            {mod.modVersion} by{" "}
            <span style={{ color: "green" }}>
              {mod.modAuthor ? mod.modAuthor : user?.username}
            </span>
          </p>
        </small>
        <p>{mod.shortDescription}</p>
      </div>
      <div className="mod-card-btn">
        <ButtonLink to={`/${mod.id}`}>View more</ButtonLink>
      </div>
      <div className="mod-card-stats">
        <small>
          <FontAwesomeIcon transform="shrink-4" icon="fa-regular fa-clock" />
          {mod.uploadDate}
        </small>
        <p style={{ color: "green" }}>
          <FontAwesomeIcon
            transform="shrink-4 down-0.5"
            icon="fa-regular fa-circle-down"
          />
          {mod.downloadCount}
        </p>
      </div>
    </div>
  );
};

export default ModCard;
