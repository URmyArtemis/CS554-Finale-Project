import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import SocialSignIn from './SocialSignIn';
function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, password1, password2 } = e.target.elements;
    if (password1.value !== password2.value) {
      setPwMatch('Your password do not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        password1.value,
        displayName,
      );
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser) {
    return <Redirect to="/home" />;
  }

  return (
    <div>
      <h1>Sign up</h1>
      {pwMatch && <h4 className="error">{pwMatch}</h4>}
      <form onSubmit={handleSignUp}>
        <div className="form-group">
          <label>
            Name:
            <input
              className="form-control"
              required
              name="displayName"
              type="text"
              placeholder="Name"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Email:
            <input
              className="form-control"
              required
              name="email"
              type="email"
              placeholder="Email"
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Password:
            <input
              className="form-control"
              id="password1"
              name="password1"
              type="password"
              placeholder="Password"
              required
            />
          </label>
        </div>
        <div className="form-group">
          <label>
            Confirm Password:
            <input
              className="form-control"
              name="password2"
              type="password"
              placeholder="Confirm Password"
              required
            />
          </label>
        </div>
        <button id="submitButton" name="submitButton" type="submit">
          Sign Up
        </button>
      </form>
      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignUp;
