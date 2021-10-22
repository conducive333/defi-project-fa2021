import * as consts from '../consts';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

fcl
  .config()
  .put("accessNode.api", consts.FLOW_ACCESS_API)
  .put("discovery.wallet", consts.FLOW_DISCOVERY_WALLET_URL);

export const useNewFlowAuthenticator = () => {
  const [user, setUser] = useState({ loggedIn: null, addr: '' });

  useEffect(
    () => fcl.currentUser.subscribe(setUser), []
  );

  const logIn = () => fcl.logIn();

  const signUp = () => fcl.signUp();

  const signOut = () => fcl.unauthenticate();

  return { user, isAuthenticated: user.loggedIn !== null, logIn, signUp, signOut };
}