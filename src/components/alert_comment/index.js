// alert dialog uses a required description box
// is used in update report section.
// gives the authority the option to have a
// final confirmation before updating the report
import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DescriptionBox from "./../description";
import Typography from "@material-ui/core/Typography";
import HeaderTextCard from "./../header_text_card";
import {
  UPDATE_REPORT_STATUS,
  SUBMIT_REPORT_COMMENT,
  SEND_EMAIL
} from "./../../utility/constants.js";
import axios from "axios";

let self;
export default class AlertDialogWithComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      makeBoxEmptyFunction: "",
      commentText: "",
      buttonDisabled: true
    };
    self = this;
  }

  handleSubmit = () => {
    let updatedStatus = this.props.updatedStatus.toLowerCase();
    let updatedSeverity = this.props.updatedSeverity;
    let caseId = this.props.caseId;
    axios
      .post(UPDATE_REPORT_STATUS, {
        data: {
          caseId: caseId,
          status: updatedStatus,
          severity: updatedSeverity
        }
      })
      .then(reponse => {
        axios
          .post(SUBMIT_REPORT_COMMENT, {
            data: {
              commentText:
                "Authority's Update - [Status: " +
                self.props.updatedStatus +
                ", Severity: " +
                updatedSeverity +
                "] - " +
                self.state.commentText,
              caseId: caseId,
              userType: "A"
            }
          })
          .then(response => {
            console.info("Report Updated");

            // For sending email to notify user

            let statusMessage =
              "Hi " +
              self.props.mailToProfileName +
              ",\n\nThere is an update to your report (Case Id #" +
              caseId +
              "). Please login to check the details. \n\nIf you have additional questions, feel free to send an email to support.spothole@gmail.com or comment on the report. Thank you for being a part of the Spothole community.";
            axios
              .post(SEND_EMAIL, {
                data: {
                  emailId: self.props.mailToProfileEmail,
                  subject:
                    "Case Id #" +
                    caseId +
                    ": New Notification from Spothole (Your Report Status)",
                  message: statusMessage
                }
              })
              .then(response => {
                console.info(response.data);
                window.location.reload();
              })
              .catch(error => {
                window.location.reload();
              });
          })
          .catch(error => {
            console.info("Unable to Update Report");
          });
      })
      .catch(error => {
        console.info("Unable to Update Report");
      });
  };

  // for a new message, updates the state
  // of the submit button (validation)
  setDescription = description => {
    this.setState({
      commentText: description
    });
    if (description === "") {
      this.setState({
        buttonDisabled: true
      });
    } else {
      this.setState({
        buttonDisabled: false
      });
    }
  };

  justClose = () => {
    this.props.updateCloseDialogState();
  };

  // empties the description box by resetting the state variable
  makeEmpty = makeBoxEmpty => {
    self.setState({
      makeBoxEmptyFunction: makeBoxEmpty
    });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.dialogOpenState}
          onClose={() => this.justClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary" component="p">
              {/* for the severity label*/}
              <HeaderTextCard
                text={"Updated Severity → " + this.props.updatedSeverity}
                marginBottom="12px"
                color={"primary"}
              />
              {/* for the status label*/}
              <HeaderTextCard
                text={"Updated Status → " + this.props.updatedStatus}
                marginBottom="12px"
                color={"primary"}
              />
            </Typography>
            <br />
            <DialogContentText id="alert-dialog-description">
              <DescriptionBox
                passMakeEmpty={this.makeEmpty}
                updateDescription={this.setDescription}
              />
              <Button
                onClick={() => this.handleSubmit()}
                color="primary"
                disabled={this.state.buttonDisabled}
                style={{ fontSize: "15px", fontWeight: "bold" }}
              >
                Submit
              </Button>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.justClose()}
              color={this.props.color}
              autoFocus
            >
              {this.props.buttonText}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
