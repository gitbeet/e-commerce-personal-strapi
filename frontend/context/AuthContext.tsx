import { createContext, useContext, useEffect, useState } from "react";
import { getUserFromLocalCookie } from "../lib/auth";

let userState: any;

const authContext = createContext<{ user: string; loading: false } | null>(
  null
);

interface Props {
  value: any;
  children: React.ReactNode;
}

export const AuthProvider = ({ value, children }: Props) => {
  const { user, loading } = value;

  useEffect(() => {
    if (!userState && user) {
      userState = user;
    }
  }, [user]);

  return (
    <authContext.Provider value={{ user, loading }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("Auth context not found.");
  return context;
};

export const useFetchUser = () => {
  const [data, setUser] = useState({
    user: userState || null,
    loading: userState === undefined,
  });

  useEffect(() => {
    if (userState !== undefined) {
      return;
    }

    let isMounted = true;
    const resolveUser = async () => {
      const user = await getUserFromLocalCookie();
      if (isMounted) {
        setUser({ user, loading: false });
      }
    };
    resolveUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
};
