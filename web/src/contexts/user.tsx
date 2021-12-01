import React from "react"

interface User {
  id: string;
}

interface UserContext {
  user: User | null;
  setUserId?: (id: string) => void;
}

export const CurrentUserContext = React.createContext<UserContext>({
  user: null,
  setUserId: (_id: string) => {}
});

export const CurrentUserProvider = ({ children }: { children: React.ReactChild }) => {
  const [user, _setUser] = React.useState<User | null>(null)

  const setUserId = (userId: string) => {
    _setUser({ id: userId });
  }

  return (
    <CurrentUserContext.Provider value={{ user, setUserId }}>
      {children}
    </CurrentUserContext.Provider>
  )
}

export const useCurrentUser = () => React.useContext(CurrentUserContext)
