import * as assets from '../assets';
import { SearchButton } from './SearchBar';
import React from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Text,
  theme,
  Theme
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useNewFlowAuthenticator } from '../hooks';
import { routes } from '../consts';

const useStyles = (theme: Theme) => ({
  menuButton: {
    marginRight: theme.space[2],
  },
  title: {
    flexGrow: 1,
  }
})

interface NavbarProps {
  withSearchBar?: boolean;
}

export const Navbar = ({ withSearchBar = false }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const flowAuthenticator = useNewFlowAuthenticator();
  const styles = useStyles(theme);
  const navigate = useNavigate();

  const logIn = async () => {
    // const res = await fetch('http://localhost:3001/v1/auth', {
    //   method: 'GET',
    //   redirect: 'follow',
    //   mode: 'no-cors'
    // });
    // console.log('**res', res);
    window.location.href = 'http://localhost:3001/v1/auth/redirect';

    // console.log('**login res', res);
    flowAuthenticator.logIn()
  }

  const NeedAuthenticationView = () => {
    return (
      <Stack
      flex={{ base: 1, md: 0 }}
      justify={'flex-end'}
      direction={'row'}
      spacing={6}>
        <Button
          fontSize={'sm'}
          fontWeight={400}
          variant="link"
          _hover={{
            color: 'blue.400',
          }}
          onClick={logIn}>
          Google Sign In
        </Button>
        <Button
          fontSize={'sm'}
          fontWeight={400}
          variant="link"
          _hover={{
            color: 'blue.400',
          }}
          onClick={flowAuthenticator.logIn}>
          Blocto Sign In
        </Button>
        <Button
          display={{ base: 'none', md: 'inline-flex' }}
          fontSize={'sm'}
          fontWeight={600}
          color={'white'}
          bg={'blue.400'}
          onClick={flowAuthenticator.signUp}
          _hover={{
            bg: 'blue.300',
          }}>
          Sign Up
        </Button>
    </Stack>
    )
  }

  const AuthenticatedView = () => {
    return (
      <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}>
                  <Avatar
                    size={'sm'}
                    src={'https://avatars.dicebear.com/api/male/username.svg'}
                  />
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{flowAuthenticator.user?.addr ?? "No Address"}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={() => navigate(routes.profile)}>Profile</MenuItem>
                  <MenuItem>Account Settings</MenuItem>
                  <MenuItem onClick={flowAuthenticator.signOut}>Logout</MenuItem>
                </MenuList>
              </Menu>
    )
  }

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Flex alignItems="center">
            <assets.RocketIcon />
            <Text fontSize="2xl" fontWeight="bold">OpenSpace</Text>
          </Flex>

          {withSearchBar ? <SearchButton /> : null}

          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Button onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>

              {flowAuthenticator.isAuthenticated ? <AuthenticatedView />: <NeedAuthenticationView />}
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
