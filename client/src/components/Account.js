import React, { useContext } from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import ChangePassword from './ChangePassword';
import { AuthContext } from '../firebase/Auth';

function Account() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <h2>Account Page</h2>
      <h2>{currentUser.displayName}</h2>
      <ChangePassword />
      <SignOutButton />
    </div>
  );
}

export default Account;
