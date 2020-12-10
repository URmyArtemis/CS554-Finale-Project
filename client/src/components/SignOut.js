import React from 'react';
import { doSignOut } from '../firebase/FirebaseFunctions';

const SignOutButton = () => {
  return (
    <button type="button" id="signout" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOutButton;
