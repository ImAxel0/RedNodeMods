import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const UserContext = createContext();

export const UserAuth = () => {
  return useContext(UserContext);
};

const AuthContextProvider = ({ children }) => {
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setIsLoggedOut(false);
        onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
          setUser(doc.data());
        });
      } else {
        setIsLoggedOut(true);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLoggedOut,
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default AuthContextProvider;
