import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";

import User from "../../components/user/User";

import {
  invalidateUsersPage,
  selectUsersPage,
  fetchTopUsersIfNeeded
} from "../../actions/users";

class UsersPage extends Component {
  constructor(props){
    super(props)

  }
  render() {

    return (
      <div> Hello  User</div>
    );
  }
}

UsersPage.propTypes = {};

function mapStateToProps(state) {
}

export default connect(mapStateToProps)(UsersPage);
