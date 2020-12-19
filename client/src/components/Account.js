import React, { useContext } from 'react';
// import SignOutButton from './SignOut';
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
      <Link to="/changepassword">Change Password</Link>
      <br />
      <br />
      <Link to="/account/mybin">My Bin</Link>
      <br />
      <br />
      <Link to="/account/mypost">My Post</Link>
    </div>
  );
}

export default Account;
