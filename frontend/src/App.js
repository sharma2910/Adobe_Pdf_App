import './App.css';
import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Login from './Pages/Login/Login';
import Dashboard from './Pages/Dashboard/Dashboard';
import AuthContext from './Context/AuthContext';

export default class App extends Component {

  state = {
    userEmail: null
  }

  login = (userEmail) => {
    this.setState({
      userEmail: userEmail
    });
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <AuthContext.Provider value={{ userEmail: this.state.userEmail, login: this.login }}>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/dashboard" component={Dashboard} />
              <Redirect path="/" to="/login" />
            </Switch>
          </AuthContext.Provider>
        </BrowserRouter>
      </div>
    );
  }
}
