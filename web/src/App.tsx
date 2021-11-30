import React, { useEffect } from 'react';
import { CurrentUserProvider, useCurrentUser } from './contexts';
import { MainPage, ProfilePage } from './pages';
import {  ChakraProvider, extendTheme } from "@chakra-ui/react"
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

const theme = extendTheme({ components: { 
  Button: { 
    baseStyle: { 
      _focus: { 
        boxShadow: 'none' 
      } 
    } 
  },
  Tab: { 
    baseStyle: { 
      _focus: { 
        boxShadow: 'none' 
      } 
    } 
  },
  Tabs: { 
    baseStyle: { 
      _focus: { 
        boxShadow: 'none' 
      } 
    } 
  } 
}})

export const App = () => {
  return (
    <CurrentUserProvider>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />}></Route>
            <Route path="/profile" element={<ProfilePage />}></Route>
            <Route path="/user" element={<UserRoute />}></Route>
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </CurrentUserProvider>
  );
}

const UserRoute = (props: any) => {
  const navigate = useNavigate();
  const user = useCurrentUser();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    user.setUserId?.(params.get('id') ?? '');
    navigate('/');
  }, [navigate, user]);

  return null;
}
