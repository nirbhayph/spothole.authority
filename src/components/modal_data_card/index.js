// this component is used to display the detailed results of
// a report. it appears after clicking on a report in the
// dashboard section.
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import EventIcon from "@material-ui/icons/Event";
import PinDropIcon from "@material-ui/icons/PinDrop";
import SeverityIndicator from "./../severity_indicator";
import HeaderTextCard from "./../header_text_card";
import Comments from "./../comments";
import "./css/modal_data_card.css";
import { Avatar } from "@material-ui/core";
import StatusSelect from "./../status_select";
import AlertDialogWithComment from "./../alert_comment";

const useStyles = makeStyles({
  root: {
    maxWidth: 700,
    margin: "0 auto"
  },
  media: {
    height: 140
  },
  mediaMap: {
    height: 200
  },
  headerTextColor: {
    color: "white"
  }
});

export default function DetailedDataCard(props) {
  let [dialogOpenState, updateCloseDialogState] = React.useState(false);
  let [statusValue, updateStatusValue] = React.useState(props.data.status);
  let [severityValue, updateSeverityValue] = React.useState(
    props.data.severity
  );

  let handleUpdateClick = () => {
    updateCloseDialogState(true);
  };
  const classes = useStyles();
  const mapImageURL =
    "https://maps.googleapis.com/maps/api/staticmap?size=512x512&format=png&style=feature:road.highway%7Celement:geometry%7Cvisibility:simplified%7Ccolor:0xc280e9&style=feature:transit.line%7Cvisibility:simplified%7Ccolor:0xbababa&style=feature:road.highway%7Celement:labels.text.stroke%7Cvisibility:on%7Ccolor:0xb06eba&style=feature:road.highway%7Celement:labels.text.fill%7Cvisibility:on%7Ccolor:0xffffff&visible=" +
    props.data.latitude +
    "," +
    props.data.longitude +
    "&markers=color:red%7Clabel:A%7C" +
    props.data.latitude +
    "," +
    props.data.longitude +
    "&key=AIzaSyDZBgT-uZYXzTSkTJbiDcYT4D_XYsS8aUQ&zoom=15";

  return (
    <Card
      style={{ border: "2px solid rgba(255,255,255,0.1)" }}
      className={classes.root}
    >
      <CardMedia className={classes.media} image={props.data.imageURL} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {/* for the name component*/}
          <HeaderTextCard
            text="Reported By"
            marginBottom="12px"
            color={classes.headerTextColor.color}
          />
          <Typography gutterBottom>
            <div>
              <Avatar
                alt={props.data.profileName}
                src={props.data.profileURL}
                style={{ display: "inline-block", verticalAlign: "middle" }}
              />
              <div
                style={{
                  display: "inline-block",
                  position: "relative",
                  top: "3px"
                }}
              >
                &nbsp; &nbsp; {props.data.profileName}
              </div>
            </div>
          </Typography>
          <br />

          {/* for the date time component*/}
          <Typography gutterBottom>
            <EventIcon />
            &nbsp; &nbsp; {props.data.dateTime.split(",")[0]}
          </Typography>

          <br />
          {/* for the address component*/}
          <Typography gutterBottom>
            <PinDropIcon />
            &nbsp; &nbsp; {props.data.location}
          </Typography>

          <br />
          {/* for the severity update component*/}
          <HeaderTextCard
            text={"Severity Rate"}
            editIcon={true}
            marginBottom="40px"
            color={classes.headerTextColor.color}
          />
          <SeverityIndicator
            updateSeverityValue={updateSeverityValue}
            value={props.data.severity}
          />

          <br />
          {/* for the status update component*/}
          <HeaderTextCard
            text="Report Status"
            editIcon={true}
            marginBottom="30px"
            color={classes.headerTextColor.color}
          />
          <StatusSelect
            value={props.data.status}
            updateSelectedValue={updateStatusValue}
          />
          <br />
          <br />

          {/* for the update changes button*/}
          <div>
            <Button
              onClick={() => handleUpdateClick()}
              color="primary"
              style={{ fontSize: "15px", fontWeight: "bold" }}
            >
              Make Updates
            </Button>
            <AlertDialogWithComment
              dialogOpenState={dialogOpenState}
              updateCloseDialogState={updateCloseDialogState}
              title={"Are you sure you want to update?"}
              content={"Please provide feedback supporting your updates"}
              buttonText={"Close"}
              color={"primary"}
              updatedStatus={statusValue}
              updatedSeverity={severityValue}
              caseId={props.data.caseNumber}
              mailToProfileName={props.data.profileName}
              mailToProfileEmail={props.data.profileEmail}
            />
          </div>

          {/* for the complaint description component*/}
          <p style={{ marginTop: "20px", textAlign: "justify" }}>
            <hr style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />
            <HeaderTextCard
              text="Complaint Description"
              marginBottom="15px"
              color={classes.headerTextColor.color}
            />
            {props.data.description}
          </p>
          <br />
          <CardMedia className={classes.mediaMap} image={mapImageURL} />
          <br />
          <hr style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

          {/* for the comments section */}
          <HeaderTextCard
            text="Comments"
            marginBottom="15px"
            color={classes.headerTextColor.color}
          />
          <Comments
            caseNumber={props.data.caseNumber}
            profileURL={props.data.profileURL}
          />
        </Typography>
      </CardContent>
    </Card>
  );
}
