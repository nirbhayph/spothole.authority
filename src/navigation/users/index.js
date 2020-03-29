// this is the manage users section
// here the authority can see all the active users in its zone
// it can manage permissions for the users by clicking on a row in the datatable
// which allows them to change the status to allowed / blocked
// (an email notification is sent out to the users too)
import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import SettingsIcon from "@material-ui/icons/Settings";
import axios from "axios";
import {
  GET_GEO_NEAR_REPORTS,
  UPDATE_USER_STATUS,
  SEND_EMAIL
} from "./../../utility/constants.js";
import MUIDataTable from "mui-datatables";
import AlertDialog from "./../../components/alert_update_user_status";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

let getMuiTheme = () =>
  createMuiTheme({
    palette: { type: "dark" },
    overrides: {
      MuiTableRow: {
        root: {
          cursor: "pointer"
        }
      }
    }
  });

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usersDataTable: "",
      dialogOpenState: false,
      clickedRow: "",
      dataCounter: 0
    };
    let self = this;
    axios
      .post(GET_GEO_NEAR_REPORTS, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(response => {
        if (response.data.length > 0) {
          let data = response.data;
          let madeData = {};

          let formattedData = data.forEach(report => {
            if (madeData[report.userId] === undefined) {
              madeData[report.userId] = {
                "User Id": report.userId,
                Name: this.capitalize(report.user_full_name),
                Email: report.user_email,
                "User Status": this.capitalize(report.user_status)
              };
            }
          });
          formattedData = Object.values(madeData);

          let finalColumns = [];
          let columns = Object.keys(formattedData[0]);
          columns.forEach(columnName => {
            let column = {
              name: columnName,
              options: {
                display: columnName === "User Id" ? false : true
              }
            };
            finalColumns.push(column);
          });
          const options = {
            filterType: "checkbox",
            onRowClick: (rowData, rowState) => {
              this.setState({
                dialogOpenState: true,
                clickedRow: rowData
              });
            },
            selectableRows: "none"
          };
          self.setState(
            {
              dataCounter: finalColumns.length
            },
            () => {
              self.setState({
                usersDataTable: (
                  <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                      title={"Users Active in Zone"}
                      data={formattedData}
                      columns={finalColumns}
                      options={options}
                    />
                  </MuiThemeProvider>
                )
              });
            }
          );
        }
      });
  }

  capitalize = str => {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  };

  updateDialogState = () => {
    this.setState({
      dialogOpenState: false
    });
  };

  updateUserStatus = () => {
    axios
      .post(UPDATE_USER_STATUS, {
        data: {
          userId: this.state.clickedRow[0],
          status: this.state.clickedRow[3] === "Allowed" ? "blocked" : "allowed"
        }
      })
      .then(response => {
        let allowedMessage =
          "Hi " +
          this.state.clickedRow[1] +
          ",\n\nWe have decided to turn your status back to allowed. You can now try signing into your account now. \n\nIf you have additional questions, feel free to send an email to support.spothole@gmail.com. Thank you for being a part of the Spothole community.";
        let blockedMessage =
          "Hi " +
          this.state.clickedRow[1] +
          ",\n\nThere seems to be some unusual activity from your account. Your status has to be turned to blocked. \n\nIf you have additional questions, feel free to send an email to support.spothole@gmail.com. Thank you for joining the Spothole community.";
        axios
          .post(SEND_EMAIL, {
            data: {
              emailId: this.state.clickedRow[2],
              subject: "New Notification from Spothole (Your Account Status)",
              message:
                this.state.clickedRow[3] === "Allowed"
                  ? blockedMessage
                  : allowedMessage
            }
          })
          .then(response => {
            console.info(response.data);
            window.location.reload();
          });
      })
      .catch(error => {
        console.info("Cannot update status currently!");
      });
  };

  render() {
    return (
      <div style={{ marginTop: "100px" }}>
        <Container>
          <Typography
            gutterBottom
            style={{ textAlign: "center", fontSize: "2.7em" }}
          >
            Manage and Change&nbsp;
            <SettingsIcon style={{ fontSize: 50 }} color={"primary"} /> User
            Level Permissions
          </Typography>
          <div>
            <center>
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{
                  textAlign: "center",
                  fontSize: "1.5em",
                  maxWidth: "500"
                }}
              >
                View active users in your region and manage their permissions
                easily.
              </Typography>
            </center>
          </div>
        </Container>
        {this.state.dataCounter === 0 && (
          <div
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "24px",
              marginTop: "150px",
              color: "#333"
            }}
          >
            {" "}
            No Active Users in your Zone yet. <br /> You can keep monitoring
            this page <br /> for seeing New User Activity.
          </div>
        )}
        {this.state.dataCounter !== 0 && (
          <Container style={{ marginTop: "50px" }}>
            {this.state.usersDataTable}
            <AlertDialog
              dialogOpenState={this.state.dialogOpenState}
              updateCloseDialogState={this.updateDialogState}
              title={
                "Change User Status to " +
                (this.state.clickedRow[3] === "Allowed" ? "Blocked" : "Allowed")
              }
              content={"Are you sure you want to change the status?"}
              buttonText={"Yes, Change Status"}
              linkTo={"/users"}
              updateUserStatus={this.updateUserStatus}
              color={"secondary"}
            />
          </Container>
        )}
      </div>
    );
  }
}

export default Users;
