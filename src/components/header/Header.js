import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { Nav, NavItem, NavLink } from 'reactstrap'

import "./header.css";

class Header extends Component {
  
  onLogoutClick = event => {
    event.preventDefault();
    this.props.handleLogout();
    this.props.history.replace("/login");
  };

  render() {
    const pathname = this.props.history.location.pathname;
    const isAuthenticated = this.props.auth.id && true

    const isLoginPage = pathname.indexOf("login") > -1;
    //const isUsersPage = pathname.indexOf("users") > -1;
    const isSignupPage = pathname.indexOf("signup") > -1;

    return (
      <div className="header">
       <Nav pills className="container">
         <NavItem>
         { isAuthenticated && 
           <NavLink 
              href="/home"
              active={isAuthenticated}
            >
              Home
            </NavLink>
          }
         </NavItem>
         { !isAuthenticated &&
         <NavItem>
           <NavLink 
            href="#signup"
            active={isSignupPage}
            >
            Sign up
            </NavLink>
         </NavItem>
        }
         <NavItem>
          {!isAuthenticated && 
            <NavLink 
            href="#login"
            active={isLoginPage}
          >
            Login
          </NavLink>
         }
         </NavItem>
         <NavItem>
           { isAuthenticated && 
              <NavLink 
                onClick={this.onLogoutClick} 
                href="/logout">
                Logout
              </NavLink>
            }
         </NavItem>
       </Nav>
     </div>
    );
  }
}

Header.propTypes = {
  handleLogout: PropTypes.func.isRequired
};

export default withRouter(Header);
