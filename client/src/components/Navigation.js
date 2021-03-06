import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="active">
            Landing
          </NavLink>
        </li>
        <br />
        <li>
          <NavLink exact to="/businesses" activeClassName="active">
            Businesses
          </NavLink>
        </li>
        <br />
        <li>
          <NavLink exact to="/account" activeClassName="active">
            Account
          </NavLink>
        </li>
        <br />
        <li>
          <SignOutButton />
        </li>
      </ul>
    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink exact to="/" activeClassName="active">
            Landing
          </NavLink>
        </li>
        <br />
        <li>
          <NavLink exact to="/signup" activeClassName="active">
            Sign-up
          </NavLink>
        </li>
        <br />

        <li>
          <NavLink exact to="/signin" activeClassName="active">
            Sign-In
          </NavLink>
          <br />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
