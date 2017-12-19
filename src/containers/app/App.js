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

import { logout } from "../../actions/auth";

import "./app.css";
import { getClients } from '../../actions/clients';



class App extends Component {

  constructor(props) {
    super(props)
    this.state ={
      modalOpen: false
    };
  }



  componentDidMount(){
    const { id } = this.props.auth;
    //this.props.dispatch(getClients(id));
  }

  componentWillReceiveProps(nextProps) {
    const { clients, auth } = this.props;
    if (clients.message !== nextProps.clients.message ){
      this.props.dispatch(getClients(auth.id));
    }
  }

  handleLogout() {
    const { user } = this.props;
    this.props.dispatch(logout(user));
  }

  render() {
    const { modalOpen } = this.state;
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
                <Route path="/client/:id" component={() => <Client {...this.props} />} />
                <Route path="/client" component={() => <Client {...this.props} />} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
          <ModalComp open={modalOpen}/>
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
  const { auth, clients } = state;
  return {
    auth,
    clients
  };
};

export default connect(mapStateToProps)(App);
