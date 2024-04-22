import ModCard from "./ModCard";
import Searchbar from "./Searchbar";
import PageSelector from "./PageSelector";
import { useEffect, useState } from "react";
import "../App.css";
import { db } from "../firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserAuth } from "../context/AuthContext";

const ModList = ({ mods }) => {
  const { user } = UserAuth();
  const [users, setUsers] = useState();
  const [downloadCount, setDownloadCount] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    const getNumberOfAuthenticatedUsers = async () => {
      try {
        const coll = collection(db, "users");
        const snapshot = await getCountFromServer(coll);
        setUsers(snapshot.data());
      } catch (error) {
        console.log(error);
      }
    };
    getNumberOfAuthenticatedUsers();
  }, []);

  useEffect(() => {
    const getDownloadCount = async () => {
      try {
        if (mods) {
          let downloads = 0;
          mods.map((mod) => {
            if (mod.downloadCount > 0) {
              downloads += mod.downloadCount;
            }
          });
          setDownloadCount(downloads);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDownloadCount();
  }, [mods]);

  return (
    <div className="mod-list">
      <div className="mods-stats">
        <div className="mods-stats-downloads">
          <h3>{downloadCount}</h3>
          <p>
            Downloads{" "}
            <FontAwesomeIcon
              transform="shrink-3 down-1"
              icon="fa-regular fa-circle-down"
            />
          </p>
        </div>
        <div className="mods-stats-users">
          <h3>{users ? users.count : 0}</h3>
          <p>
            Users{" "}
            <FontAwesomeIcon
              transform="shrink-3 down-1"
              icon="fa-regular fa-user"
            />
          </p>
        </div>
        <div className="mods-stats-mods">
          <h3>{mods.filter((mod) => mod.isApproved).length}</h3>
          <p>
            Mods{" "}
            <FontAwesomeIcon
              transform="shrink-3 down-1"
              icon="fa-regular fa-file"
            />
          </p>
        </div>
      </div>
      <div className="search-container">
        <Searchbar onValueChange={setSearchValue} />
      </div>
      <PageSelector
        mods={mods}
        setPageCallback={setCurrPage}
        currPage={currPage}
      />
      <div className="mods-grid">
        {mods.map(
          (mod, index) =>
            index < 8 * currPage &&
            index >= 8 * currPage - 8 &&
            (mod.isApproved || user?.canApprove) &&
            mod.name.toLowerCase().includes(searchValue.toLowerCase()) && (
              <ModCard key={mod.id} mod={mod} />
            )
        )}
      </div>
    </div>
  );
};

export default ModList;
