import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { signup } from "../../actions/signup";


class Signup extends Component {
  constructor(props) {
    super(props);
    this.handleSignup = this.handleSignup.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.auth) {
      nextProps.history.push('/');
    }
  }

  handleSignup(event) {
    event.preventDefault();
    const username = this.refs.username;
    const email = this.refs.email;
    const password = this.refs.password;
    const confirmPassword = this.refs.confirmPassword;
    this.props.dispatch(signup(
      username.value,
      email.value,
      password.value,
      confirmPassword.value,
    ));
    username.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
  }

  render() {
    const { user, loginError } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-4" style={{ float: "none", margin: "0 auto" }}>
            <div className="card">
              <div className="card-header">Please Signup</div>
              <form className="card-block">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="fa fa-user" />
                  </span>
                  <input
                    type="text"
                    ref="username"
                    className="form-control"
                    placeholder="Username"
                    required
                    autoFocus
                  />
                </div>
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="fa fa-envelope" />
                  </span>
                  <input
                    type="text"
                    ref="email"
                    className="form-control"
                    placeholder="Email"
                    required
                    autoFocus
                  />
                </div>

                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="fa fa-lock" />
                  </span>
                  <input
                    type="password"
                    ref="password"
                    className="form-control"
                    placeholder="Password"
                    required
                  />
                </div>
                  <div className="input-group">
                    <span className="input-group-addon">
                      <i className="fa fa-lock" />
                    </span>
                    <input
                      type="password"
                      ref="confirmPassword"
                      className="form-control"
                      placeholder="confirmPassword"
                      required
                    />
                  </div>              

                <div className="checkbox">
                  <label>
                    <input type="checkbox" value="remember-me" /> Remember me
                  </label>
                </div>

                {!user &&
                  loginError &&
                  <div className="alert alert-danger">
                    {loginError.message}
                  </div>
                }

                <button
                  className="btn btn-primary btn-block"
                  onClick={this.handleSignup}
                >
                  <i className="fa fa-sign-in" />{" "}Signup
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Signup.contextTypes = {
  store: PropTypes.object.isRequired
};

Signup.propTypes = {
  user: PropTypes.shape({}),
  loginError: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  const { auth } = state;
  if (auth) {
    return { auth, loginError: auth.loginError };
  }

  return { user: null };
}

export default connect(mapStateToProps)(Signup);
