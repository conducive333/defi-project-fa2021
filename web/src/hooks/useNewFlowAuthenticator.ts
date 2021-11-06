import * as consts from '../consts';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import { isCollectionCreated, initializeCollection } from '../flow';

fcl
  .config()
    .put("accessNode.api", consts.FLOW_ACCESS_API)
    .put("0xaddress", consts.FLOW_SMART_CONTRACT_ADDRESS)
    .put("0xnftAddress", consts.FLOW_CONTRACT_NON_FUNGIBLE_TOKEN)
    .put("discovery.wallet", consts.FLOW_DISCOVERY_WALLET_URL);

export const useNewFlowAuthenticator = () => {
  const [user, setUser] = useState({ loggedIn: null, addr: '' });

  useEffect(
    () => fcl.currentUser.subscribe(setUser), []
  );

  const logIn = fcl.logIn();

  useEffect(() => {
    const isAuthenticated = user.loggedIn !== null;

    if (isAuthenticated) {
      isCollectionCreated(user.addr).then((_isCollectionCreated: boolean) => {
        console.log('**_isCollectionCreated', _isCollectionCreated);
        if (!_isCollectionCreated) {
          initializeCollection();
        }
      });
    }
  }, [user])

  const signUp = () => fcl.signUp();

  const signOut = () => fcl.unauthenticate();

  return { user, isAuthenticated: user.loggedIn !== null, logIn, signUp, signOut };
}