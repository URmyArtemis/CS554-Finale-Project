import React, { useContext } from 'react';
import SignOutButton from './SignOut';
import '../App.css';
import { Link } from 'react-router-dom';
// import ChangePassword from './ChangePassword';
import { AuthContext } from '../firebase/Auth';

function Account() {
  const { currentUser } = useContext(AuthContext);
  return (
    <div>
      <h2>Account Page</h2>
      <h2>{currentUser.email}</h2>
      {/* <ChangePassword /> */}
      <Link to="/changepassword">
        Change Password
      </Link>
      <br />
      <Link to="/account/mybin">My Bin</Link>
      {/* <SignOutButton /> */}
      <h2>My reviews </h2>
    </div>
  );
}

export default Account;
