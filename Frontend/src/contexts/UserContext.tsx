import { createContext, useContext, useState } from "react";
import api from "@/services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
  birthDate: string;
  gender: string;
  naturalness: string;
  nationality: string;
}

interface UserContextType {
  users: User[];
  refreshUsers: () => Promise<void>;
  getAllUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: number, user: Partial<User>) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);

  const refreshUsers = async () => {
    const response = await api.get("/users");
    setUsers(response.data);

    return response.data
  };

  const getAllUsers = async () => {
    await refreshUsers();
  }

  const addUser = async (user: Omit<User, "id">) => {
    await api.post("/users", user);
    await refreshUsers();
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    await api.patch(`/users/${id}`, user);
    await refreshUsers();
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    await refreshUsers();
  };

  return (
    <UserContext.Provider value={{ users, getAllUsers, refreshUsers, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUserContext must be used within UserProvider");
  return ctx;
}