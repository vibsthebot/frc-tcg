import { createContext, useState, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from 'firebaseConfig';

type UserData = {
  email: string;
  displayName: string;
  xp: number;
  cards: string[];
};

type GlobalContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  userData: UserData | null;
  setUserData: (data: UserData | null) => void;
  getUserData: () => Promise<void>;
};

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  
  const getUserData = async () => {
    if (!user?.email) return;
    
    try {
      const userDoc = await getDoc(doc(db, "users", user.email));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  return (
    <GlobalContext.Provider value={{ user, setUser, userData, setUserData, getUserData }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
