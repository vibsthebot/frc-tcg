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
  hallOfFame: number[];
};

export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const hallOfFame = [5985, 2486, 321, 1629, 503, 4613, 1816, 1902, 2834, 1311, 2614, 3132, 987, 597, 27, 1538, 1114, 359, 341, 236, 842, 365, 111, 67, 254, 103, 175, 16, 120, 23, 144, 151, 191];
  
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
    <GlobalContext.Provider value={{ user, setUser, userData, setUserData, getUserData, hallOfFame}}>
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
