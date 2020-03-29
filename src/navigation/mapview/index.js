// this componenet displays all the reports for a
// particular authority's zone on a map. It gives the authority
// the option to select a report from the map itself and update the status or add comments to the report.
// there is an option to toggle between a heat map layer as well.
// the screen also display's the authority's details and shows a legend for the map
import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import MapView from "./../../components/region_view";
import DetailedDataModal from "./../../components/detailed_data_modal";
import {
  GET_AUTHORITY_PROFILE,
  GET_GEO_NEAR_REPORTS,
  ROUTE_ICON_IMAGE_HIGH,
  ROUTE_ICON_IMAGE_MEDIUM,
  ROUTE_ICON_IMAGE_LOW
} from "./../../utility/constants.js";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: "20px",
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

let self;
class MapRegionView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapView: "",
      detailedDataModal: "",
      authorityAddress: "",
      authorityName: "",
      dataCounter: 0
    };
    self = this;
    this.updateDataCounter();
    axios
      .post(GET_AUTHORITY_PROFILE, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(response => {
        let heatMapData = [];
        self.setState({
          authorityAddress: response.data[0].address,
          authorityName: response.data[0].name,
          mapView: (
            <div>
              <MapView
                authorityId={this.props.authorityId}
                centerLat={response.data[0].latitude}
                centerLng={response.data[0].longitude}
                goToReport={this.goToReport}
                heatMapData={heatMapData}
              />
            </div>
          )
        });
      })
      .catch(error => {
        console.info("Cannot read authority profile data");
      });
  }

  updateDataCounter = () => {
    axios
      .post(GET_GEO_NEAR_REPORTS, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(response => {
        self.setState({
          dataCounter: response.data.length
        });
      });
  };

  goToReport = paramData => {
    this.setState(
      {
        detailedDataModal: ""
      },
      () => {
        this.setState({
          detailedDataModal: (
            <DetailedDataModal
              imageURL={paramData.imageURL}
              dateTime={this.formatDate(paramData.created_date)}
              location={paramData.location}
              description={paramData.description}
              severity={paramData.severity}
              caseNumber={paramData.case_id}
              latitude={paramData.latitude}
              longitude={paramData.longitude}
              profileURL={paramData.user_photo_url}
              profileName={this.capitalize(paramData.user_full_name)}
              status={this.capitalize(paramData.status)}
              profileEmail={paramData.user_email}
            />
          )
        });
      }
    );
  };

  formatDate = date => {
    return new Date(Date.parse(date)).toLocaleString();
  };

  capitalize = str => {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  };

  render() {
    const { classes } = this.props;
    return (
      <div style={{ marginTop: "100px" }}>
        <Container>
          <Typography
            gutterBottom
            style={{ textAlign: "center", fontSize: "2.7em" }}
          >
            Track and Update&nbsp;
            <TrendingUpIcon style={{ fontSize: 50 }} color={"primary"} />{" "}
            Reports with Ease
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
                  maxWidth: "600px"
                }}
              >
                View potholes reported in your region differentiated using the
                given legend. Click on any pothole marker to view it's details
                or update it with the press of a single button.
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
            No Reports in your Zone yet. <br /> You can keep Monitoring this
            page for <br /> New Reports and to Manage them through a Map View.
          </div>
        )}
        {this.state.dataCounter !== 0 && (
          <div>
            <Container>
              <Grid style={{ marginTop: "50px" }} container spacing={3}>
                <Grid item sm={6} xs={12}>
                  <Paper style={{ padding: "20px", height: "200px" }}>
                    <h3>Authority Details</h3>
                    <br />
                    <h6 style={{ color: "grey" }}>Name</h6>
                    <h6>{this.state.authorityName}</h6>
                    <h6 style={{ color: "grey" }}>Address</h6>
                    <h6>{this.state.authorityAddress}</h6>
                  </Paper>
                </Grid>
                <Grid item sm={6} xs={12}>
                  <Paper style={{ padding: "20px", height: "200px" }}>
                    <h3>Map Legend [Severity]</h3>
                    <br />
                    <br />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start"
                      }}
                    >
                      <div>
                        <center>
                          <Avatar
                            variant={"rounded"}
                            alt="High"
                            src={ROUTE_ICON_IMAGE_HIGH}
                            className={classes.large}
                          />
                          <h5>High</h5>
                        </center>
                      </div>
                      <div style={{ marginLeft: "40px", marginRight: "40px" }}>
                        <center>
                          <Avatar
                            variant={"rounded"}
                            alt="Medium"
                            src={ROUTE_ICON_IMAGE_MEDIUM}
                            className={classes.large}
                          />
                          <h5>Medium</h5>
                        </center>
                      </div>
                      <div>
                        <center>
                          <Avatar
                            variant={"rounded"}
                            alt="Low"
                            src={ROUTE_ICON_IMAGE_LOW}
                            className={classes.large}
                          />
                          <h5>Low</h5>
                        </center>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <br />
            <Container>
              <div style={{ border: "2px SOLID #2997F7", borderRadius: "5px" }}>
                {this.state.mapView}
              </div>
            </Container>
            {this.state.detailedDataModal}
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(MapRegionView);
