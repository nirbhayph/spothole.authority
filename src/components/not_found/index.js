// for unaouthorized routes
import React from "react";
class NotFound extends React.Component {
  render() {
    window.location.href = "https://nirbhay.me/spothole.authority/404";
    return <div>404</div>;
  }
}

export default NotFound;
