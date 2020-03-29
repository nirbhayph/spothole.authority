// authentication component for validating any given route
// uses google o-auth 2.0 api for the purpose of authentication
// uses the isSignedIn state variable to manage the state of login for the authority
// also blocks users with status "blocked" from entering
/* global gapi */
import React, { Component } from "react";
import MapRegionView from "./../../navigation/mapview";
import Profile from "./../../navigation/profile";
import Dashboard from "./../../navigation/dashboard";
import Users from "./../../navigation/users";
import NavBar from "./../../navigation/navbar";
import HeaderSeparator from "./../header_separator";
import SignUp from "./../signup";
import {
  HOST_NAME,
  VALIDATE_AUTHORITY,
  UPDATE_AUTHORITY_PROFILE,
  CLIENT_ID,
  UA_LOGIN
} from "./../../utility/constants.js";
import axios from "axios";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      authorityId: "",
      profileName: "",
      profileEmail: "",
      profilePhotoURL: ""
    };
  }

  // sets the state once signed in and calls the renderer
  // uses the o-auth 2.0 api
  componentDidMount() {
    const successCallback = this.onSuccess.bind(this);
    window.gapi.load("auth2", () => {
      this.auth2 = gapi.auth2.init({
        client_id: CLIENT_ID
      });
      this.auth2.then(() => {
        let basicProfile = window.gapi.auth2
          .getAuthInstance()
          .currentUser.get()
          .getBasicProfile();
        this.setState({
          isSignedIn: this.auth2.isSignedIn.get(),
          authorityId: basicProfile.getId() || "",
          profileName: basicProfile.getName() || "",
          profileEmail: basicProfile.getEmail() || "",
          profilePhotoURL: basicProfile.getImageUrl() || ""
        });
      });
    });

    this.callRender(successCallback);
  }
  // success renderer
  // requires the callback function as a param
  callRender = successCallback => {
    window.gapi.load("signin2", function() {
      // using this method will show Signed In if the user is already signed in
      var opts = {
        width: 0,
        height: 0,
        client_id: CLIENT_ID,
        onsuccess: successCallback,
        longTitle: false,
        theme: "dark"
      };
      gapi.signin2.render("loginButton", opts);
    });
  };

  // logout and reset the signedIn state variable
  logout = redirectURL => {
    if (this.state.isSignedIn) {
      window.gapi.auth2
        .getAuthInstance()
        .signOut()
        .then(() => {
          this.setState(
            {
              isSignedIn: this.auth2.isSignedIn.get()
            },
            () => {
              localStorage.setItem("authoritySignedIn", false);
              this.urlRedirect(redirectURL || HOST_NAME);
            }
          );
        });
    } else {
      console.info("Already Signed In");
    }
  };

  // redirects to the home page
  // requires home page url as param
  urlRedirect = url => {
    var X = setTimeout(function() {
      window.location.replace(url);
      return true;
    }, 300);

    if ((window.location = url)) {
      clearTimeout(X);
      return true;
    } else {
      if ((window.location.href = url)) {
        clearTimeout(X);
        return true;
      } else {
        clearTimeout(X);
        window.location.replace(url);
        return true;
      }
    }
  };

  // updates or inserts the first time authority profile after logging in
  validateAndPostProfileData = basicProfile => {
    axios
      .post(VALIDATE_AUTHORITY, {
        data: {
          emailId: basicProfile.getEmail()
        }
      })
      .then(response => {
        if (response.data === "Authorized Login") {
          axios.post(UPDATE_AUTHORITY_PROFILE, {
            data: {
              authorityId: basicProfile.getId(),
              emailId: basicProfile.getEmail(),
              name: basicProfile.getName(),
              photoURL: basicProfile.getImageUrl()
            }
          });
        } else {
          this.logout(UA_LOGIN);
          console.info("Unauthorized Login");
        }
      })
      .catch(err => {
        this.logout();
        console.info("Cannot login at this time!");
      });
  };

  // success callback
  // sets the local storage and the state variable
  // sets the profile data state variables
  // posts the profile data to the server
  onSuccess() {
    let basicProfile = window.gapi.auth2
      .getAuthInstance()
      .currentUser.get()
      .getBasicProfile();
    localStorage.setItem("authoritySignedIn", true);
    this.setState(
      {
        isSignedIn: true,
        err: null,
        authorityId: basicProfile.getId(),
        profileName: basicProfile.getName(),
        profileEmail: basicProfile.getEmail(),
        profilePhotoURL: basicProfile.getImageUrl()
      },
      () => {
        this.validateAndPostProfileData(basicProfile);
      }
    );
  }

  // on failure to login sets
  // the state varibales accordingly
  onLoginFailed(err) {
    this.setState({
      isSignedIn: false,
      error: err
    });
  }

  // associates the navbar after successful sign in
  navigationBar = () => {
    return (
      <div>
        {" "}
        <NavBar />
        <HeaderSeparator />{" "}
      </div>
    );
  };

  // on the basis of login status renders the associated component
  // and passes it the required params
  loginStatus() {
    if (
      localStorage.getItem("authoritySignedIn") === "true" &&
      this.state.isSignedIn
    ) {
      switch (this.props.linkTo) {
        case "/dashboard":
          return (
            <div>
              <Dashboard authorityId={this.state.authorityId} />
              {this.navigationBar()}
            </div>
          );
        case "/mapview":
          return (
            <div>
              <MapRegionView authorityId={this.state.authorityId} />
              {this.navigationBar()}
            </div>
          );
        case "/users":
          return (
            <div>
              <Users authorityId={this.state.authorityId} />
              {this.navigationBar()}
            </div>
          );
        case "/logout":
          this.logout();
          break;
        case "/profile":
          return (
            <div>
              <Profile
                authorityId={this.state.authorityId}
                name={this.state.profileName}
                email={this.state.profileEmail}
                photoURL={this.state.profilePhotoURL}
              />
              {this.navigationBar()}
            </div>
          );
        case "/":
          return (
            <div>
              <Dashboard authorityId={this.state.authorityId} />
              {this.navigationBar()}
            </div>
          );
        default:
          return (
            <div>
              <Dashboard authorityId={this.state.authorityId} />
              {this.navigationBar()}
            </div>
          );
      }
    } else if (
      localStorage.getItem("authoritySignedIn") === "false" &&
      this.state.isSignedIn
    ) {
      this.urlRedirect(HOST_NAME);
    } else {
      if (localStorage.getItem("authoritySignedIn") !== "true") {
        return (
          <div>
            <div id="loginButton" style={{ display: "none" }}>
              Login with Google
            </div>
            <SignUp />
          </div>
        );
      } else {
        return <div />;
      }
    }
  }

  render() {
    return <div>{this.loginStatus()}</div>;
  }
}

export default Auth;
