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
import Login from "../login/Login";
import Home from "../home/Home";
import Signup from "../signup/Signup";
import Receipt from "../receipt/Receipt";
import About from "../about/About";
import NotFound from "../misc/NotFound";

import { logout } from "../../actions/auth";

import "./app.css";
import { getReceipts } from "../../actions/receipts";



class App extends Component {

  componentDidMount(){
    const { id } = this.props.auth;
    this.props.dispatch(getReceipts(id));
  }

  componentWillReceiveProps(nextProps) {
    const { receipts, auth } = this.props;
    if (receipts.message !== nextProps.receipts.message ){
      this.props.dispatch(getReceipts(auth.id));
    }
  }

  handleLogout() {
    const { user } = this.props;
    this.props.dispatch(logout(user));
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
                <Route path="/receipt/:id" component={() => <Receipt {...this.props} />} />
                <Route path="/receipt" component={() => <Receipt {...this.props} />} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
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
  const { auth, receipts } = state;
  return {
    auth,
    receipts
  };
};

export default connect(mapStateToProps)(App);
