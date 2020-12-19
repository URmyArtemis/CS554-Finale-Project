import React from 'react';
import '../App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../firebase/Auth';
import PrivateRoute from './PrivateRoute';
import Account from './Account';
import ChangePassword from './ChangePassword';
import Home from './Home';
import Landing from './Landing';
import Navigation from './Navigation';
import SignIn from './SignIn';
import SignUp from './SignUp';
import BusinessList from './BusinessList';
import Business from './Business';

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: 'http://ec2-18-218-48-72.us-east-2.compute.amazonaws.com:4000' })
});

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <div className="App">
            <header className="App-header">
              <Navigation />
            </header>
          </div>
          <Route exact path="/" component={Landing} />
          <PrivateRoute path="/home" component={Home} />
          <PrivateRoute exact path="/businesses" component={BusinessList} />
          <PrivateRoute path="/account" component={Account} />
          <PrivateRoute path="/changepassword" component={ChangePassword} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          {/* <PrivateRoute exact path="/businesses" component={BusinessList} /> */}
          <PrivateRoute exact path="/businesses/:id" component={Business} />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
