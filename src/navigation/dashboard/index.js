// this is the main dashboard in the authority's app
// has an analytics section and a datatable section
// the analytics section contains two components (pie and stacked bar charts)
// the pie chart represents the status wise distribution of reports
// the bar chart represents the status and severity wise distribution of reports
// the datatable shows all the reports in the authority's region which are queried
// using a geo near operation in the database
// on clicking a row in the datatable the authority has
// the option to update its status or make comments on the report
// on updating the status an email notification is sent out to the users too
import React from "react";
import MUIDataTable from "mui-datatables";
import axios from "axios";
import { GET_GEO_NEAR_REPORTS } from "./../../utility/constants.js";
import DetailedDataModal from "./../../components/detailed_data_modal";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import PieChartBlock from "./../../components/pie_chart";
import BarChartBlock from "../../components/bar_chart";
import {
  makeStyles,
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";

let self;

const styles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

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

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportsDataTable: "",
      dataModal: "",
      completeData: []
    };

    self = this;

    axios
      .post(GET_GEO_NEAR_REPORTS, {
        data: {
          authorityId: this.props.authorityId
        }
      })
      .then(response => {
        if (response.data.length > 0) {
          let data = response.data;
          self.setState({
            completeData: data
          });
          let formattedData = data.map(report => {
            let formattedReport = {};
            formattedReport["Case Id"] = report.case_id;
            formattedReport["Location"] = this.capitalize(report.location);
            formattedReport["Severity"] = report.severity;
            formattedReport["Status"] = this.capitalize(report.status);
            formattedReport["Report Date"] = this.formatDate(
              report.created_date
            ).split(",")[0];
            formattedReport["Reporter Name"] = this.capitalize(
              report.user_full_name
            );
            return formattedReport;
          });
          let columns = Object.keys(formattedData[0]);
          const options = {
            filterType: "checkbox",
            selectableRows: "none",
            onRowClick: (rowData, rowState) => {
              let paramData = data[rowState.dataIndex];
              self.setState(
                {
                  dataModal: ""
                },
                () => {
                  self.setState({
                    dataModal: (
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
            }
          };
          self.setState({
            reportsDataTable: (
              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  title={"Zone Reports"}
                  data={formattedData}
                  columns={columns}
                  options={options}
                  style={{ cursor: "pointer" }}
                />
              </MuiThemeProvider>
            )
          });
        }
      });
  }

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
      <div>
        {this.state.completeData.length === 0 && (
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
            No Reports in your Zone yet. <br /> You can keep monitoring this
            page <br /> for new Reports
          </div>
        )}
        {this.state.completeData.length !== 0 && (
          <div>
            <Container>
              <Grid style={{ marginTop: "100px" }} container spacing={3}>
                <Grid item sm={5}>
                  <Paper className={classes.paper}>
                    <PieChartBlock data={this.state.completeData} />
                  </Paper>
                </Grid>
                <Grid item sm={7}>
                  <Paper className={classes.paper}>
                    <BarChartBlock data={this.state.completeData} />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
            <Container style={{ marginTop: "50px" }}>
              {this.state.reportsDataTable}
              {this.state.dataModal}
            </Container>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Dashboard);
