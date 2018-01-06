import React, { Component } from "react";
import PropTypes from "prop-types";

/////////////////////////////////////////////////////////////////////////
// BrowserRouter would be preferred over HashRouter, but BrowserRouter
// would require configuring the server. So we will use HashRouter here.
// Please change to BrowserRouter if you have your own backend server.
///////////////////////////////////////////////////////////////////////////
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import { connect } from "react-redux";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import ModalComp from "../../components/modal/Modal";
import Login from "../login/Login";
import Home from "../home/Home";
import Signup from "../signup/Signup";
import Client from "../client/Client";
import About from "../about/About";
import NotFound from "../misc/NotFound";
import { getClients } from "../../actions/clients";

import { logout } from "../../actions/auth";

import "./app.css";
//import { saveMonth } from '../../actions/clients';

const TIMESTAMP = new Date();

class App extends Component {

  constructor(props) {
    super(props);
    this.state ={};
  }

  componentDidMount(){
    const { auth, dispatch } = this.props;
    dispatch(getClients(auth.id, TIMESTAMP.getMonth(), TIMESTAMP.getFullYear()));
  }

  handleLogout() {
    const { user, dispatch } = this.props;
    dispatch(logout(user));
  }

  render() {
    const { auth } = this.props;    
    return (
      <Router>
        <div>
          <div className="container">
            <Header auth={auth}  handleLogout={() => this.handleLogout()} />
            <div className="appContent">
              <Switch>
                <Route exact path="/" render={() => <Home {...this.props}/>} />
                <Route path="/about" component={About} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/client/:id" component={() => <Client  {...this.props}/>} />
                <Route path="/client" component={() => <Client  {...this.props}/>} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
          <ModalComp {...this.props}/>
          <Footer />
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  user: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

App.contextTypes = {
  store: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  const { auth } = state;
  return {
    auth
  };
};

export default connect(mapStateToProps)(App);
