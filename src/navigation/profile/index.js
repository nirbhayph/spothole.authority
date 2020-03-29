// this is the profile screen. it displys the main email photo URL for the
// signed in authority
// shows the number of cancelled, approved, working, pending and completed reports.
// has separate indicators for the same.
import React from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import axios from "axios";
import {
  GET_GEO_NEAR_REPORTS,
  GET_AUTHORITY_PROFILE
} from "./../../utility/constants.js";
import HeaderTextCard from "./../../components/header_text_card";
import PinDropIcon from "@material-ui/icons/PinDrop";
import Link from "@material-ui/core/Link";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingCount: 0,
      cancelledCount: 0,
      approvedCount: 0,
      completedCount: 0,
      inProgressCount: 0,
      address: ""
    };
    axios
      .post(GET_GEO_NEAR_REPORTS, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(res => {
        let completedCount = res.data.filter(report => {
          return report.status === "completed";
        }).length;
        let cancelledCount = res.data.filter(report => {
          return report.status === "cancelled";
        }).length;
        let inProgressCount = res.data.filter(report => {
          return report.status === "working";
        }).length;
        let pendingCount = res.data.filter(report => {
          return report.status === "submitted";
        }).length;
        let approvedCount =
          res.data.filter(report => {
            return report.status === "approved";
          }).length +
          inProgressCount +
          completedCount;
        this.setState({
          cancelledCount: cancelledCount,
          approvedCount: approvedCount,
          completedCount: completedCount,
          inProgressCount: inProgressCount,
          pendingCount: pendingCount
        });
      });
    axios
      .post(GET_AUTHORITY_PROFILE, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(response => {
        this.setState({
          address: response.data[0].address
        });
      });
  }
  render() {
    return (
      <div>
        <center>
          <Card
            style={{
              marginTop: "125px",
              borderRadius: 12,
              minWidth: 256,
              maxWidth: 500,
              textAlign: "center",
              marginLeft: "50px",
              marginRight: "50px"
            }}
          >
            <CardContent>
              <Avatar
                style={{
                  width: 120,
                  height: 120,
                  margin: "auto",
                  marginTop: "15px",
                  marginBottom: "15px"
                }}
                src={this.props.photoURL}
              />
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  letterSpacing: "0.5px",
                  marginTop: 8,
                  marginBottom: 0
                }}
              >
                {this.props.name}
              </h3>
              <span>
                <Link
                  style={{
                    fontSize: 14,
                    marginBottom: "1em",
                    fontWeight: "bold"
                  }}
                  href={"mailto:" + this.props.email}
                >
                  {this.props.email}
                </Link>
              </span>
              <span
                style={{
                  fontSize: 14,
                  color: "white",
                  marginTop: "1em",
                  fontWeight: "bold",
                  letterSpacing: "0.5px"
                }}
              >
                <br />
                <br />
                <PinDropIcon />
                &nbsp; {this.state.address}
              </span>
            </CardContent>
            <Divider variant="middle" />
            <br />
            <HeaderTextCard text="Status Statistics" />
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginRight: "100px",
                marginLeft: "100px"
              }}
            >
              <Box p={2} flex={"auto"}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9e9e9e",
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    margin: 0
                  }}
                >
                  Pending
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                    letterSpacing: "1px"
                  }}
                >
                  {this.state.pendingCount}
                </p>
              </Box>
              <Box p={2} flex={"auto"}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9e9e9e",
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    margin: 0
                  }}
                >
                  Approved
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                    letterSpacing: "1px"
                  }}
                >
                  {this.state.approvedCount}
                </p>
              </Box>
            </Box>
            <Box display={"flex"}>
              <Box p={2} flex={"auto"}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9e9e9e",
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    margin: 0
                  }}
                >
                  In Progress
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                    letterSpacing: "1px"
                  }}
                >
                  {this.state.inProgressCount}
                </p>
              </Box>
              <Box p={2} flex={"auto"}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9e9e9e",
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    margin: 0
                  }}
                >
                  Completed
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                    letterSpacing: "1px"
                  }}
                >
                  {this.state.completedCount}
                </p>
              </Box>
              <Box p={2} flex={"auto"}>
                <p
                  style={{
                    fontSize: 12,
                    color: "#9e9e9e",
                    fontWeight: 500,
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
                    margin: 0
                  }}
                >
                  Cancelled
                </p>
                <p
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    marginBottom: 4,
                    letterSpacing: "1px"
                  }}
                >
                  {this.state.cancelledCount}
                </p>
              </Box>
            </Box>
            <div
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                marginTop: "20px"
              }}
            ></div>
          </Card>
        </center>
      </div>
    );
  }
}

export default Profile;
