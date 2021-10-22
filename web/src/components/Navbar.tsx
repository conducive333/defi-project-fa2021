import React from 'react';
import { useNewFlowAuthenticator } from '../hooks';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export const Navbar = () => {
  const flowAuthenticator = useNewFlowAuthenticator();
  const classes = useStyles();

  const AuthedState = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <Typography variant="h6">Address: {flowAuthenticator.user?.addr ?? "No Address"}</Typography>
        <br />
        <Button onClick={flowAuthenticator.signOut} color="inherit">Log Out</Button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <Button onClick={flowAuthenticator.logIn} color="inherit">Log In</Button>
        <Button onClick={flowAuthenticator.signUp} color="inherit">Sign Up</Button>
      </div>
    )
  }

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          Best NFT Marketplace in the Universe
        </Typography>
        {flowAuthenticator.isAuthenticated ? <AuthedState />: <UnauthenticatedState />}
      </Toolbar>
    </AppBar>
  );
};