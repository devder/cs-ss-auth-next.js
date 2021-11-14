import { createContext, FC, useContext, useState } from "react";

import { UserDocument } from "@shared";

export interface IUserContext {
  user?: UserDocument;
  setUser: (user?: UserDocument) => void;
}

export const UserContext = createContext<IUserContext>(null!);

export function useUser() {
  return useContext(UserContext);
}

interface Props {
  initialUser?: UserDocument;
}

export const UserProvider: FC<Props> = ({ children, initialUser }) => {
  const [user, setUser] = useState(initialUser);
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};
