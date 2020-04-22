// this componenet displays all the reports for a
// particular authority's zone on a map. It gives the authority
// the option to select a report from the map itself and update the status or add comments to the report.
// there is an option to toggle between a heat map layer as well.
/*global google*/
import React from "react";
import axios from "axios";
import { compose, withProps, lifecycle, withStateHandlers } from "recompose";
import Button from "@material-ui/core/Button";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} from "react-google-maps";
import HeatmapLayer from "react-google-maps/lib/components/visualization/HeatmapLayer";
import {
  GET_GEO_NEAR_REPORTS,
  ROUTE_ICON_IMAGE_HIGH,
  ROUTE_ICON_IMAGE_MEDIUM,
  ROUTE_ICON_IMAGE_LOW,
  GOOGLE_MAPS_API_KEY,
} from "./../../utility/constants.js";

const MapView = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      GOOGLE_MAPS_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places,visualization",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(
    () => ({
      isOpen: false,
      infoIndex: null,
      selectedReports: [],
      heatMapOn: false,
    }),
    {
      onToggleOpen: ({ isOpen, infoIndex }) => (index) => ({
        isOpen: !isOpen,
        infoIndex: index,
      }),
      toggleHeatMap: ({ heatMapOn }) => (heatOn) => ({
        heatMapOn: !heatOn,
      }),
    }
  ),
  withScriptjs,
  withGoogleMap,
  lifecycle({
    componentDidMount() {
      let self = this;
      axios
        .post(GET_GEO_NEAR_REPORTS, {
          data: {
            authorityId: this.props.authorityId,
          },
        })
        .then((response) => {
          let heatMapData = response.data.map((report) => {
            return {
              location: new google.maps.LatLng(
                report.latitude,
                report.longitude
              ),
              weight: report.severity,
            };
          });
          self.setState({
            selectedReports: response.data,
            heatMapData: heatMapData,
          });
        })
        .catch((error) => {
          console.info("Unable to create the region map");
        });
    },
  })
)((props) => {
  return (
    <div>
      <Button
        variant={"contained"}
        color={"primary"}
        onClick={() => props.toggleHeatMap(props.heatMapOn, props.heatMapData)}
        style={{
          float: "right",
          marginTop: "20px",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        Toogle Heat Map Layer
      </Button>
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{
          lat: parseFloat(props.centerLat),
          lng: parseFloat(props.centerLng),
        }}
      >
        {props.selectedReports.map((report, index) => {
          let iconMarkerImage;
          if (parseInt(report.severity) <= 3) {
            iconMarkerImage = ROUTE_ICON_IMAGE_LOW;
          } else if (parseInt(report.severity) <= 6) {
            iconMarkerImage = ROUTE_ICON_IMAGE_MEDIUM;
          } else {
            iconMarkerImage = ROUTE_ICON_IMAGE_HIGH;
          }
          let iconMarker = new window.google.maps.MarkerImage(
            iconMarkerImage,
            null,
            null,
            null,
            new window.google.maps.Size(48, 48)
          );
          return (
            <Marker
              icon={iconMarker}
              key={index}
              position={{
                lat: parseFloat(report.latitude),
                lng: parseFloat(report.longitude),
              }}
              onClick={() => props.onToggleOpen(index)}
            >
              {props.isOpen && props.infoIndex === index && (
                <InfoWindow
                  onCloseClick={props.onToggleOpen}
                  key={index}
                  visible={true}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "3px",
                      marginRight: "3px",
                    }}
                  >
                    <div
                      style={{
                        color: "#212121",
                        paddingRight: "10px",
                        paddingBottom: "10px",
                        fontWeight: "bold",
                        lineHeight: 1.5,
                      }}
                    >
                      Reported On: {report.created_date.split(" ")[0]}
                      <hr style={{ marginTop: "3px", marginBottom: "3px" }} />
                      Current Status:{" "}
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                      <hr style={{ marginTop: "3px", marginBottom: "3px" }} />
                      Reported Severity: {report.severity}/10 <br />
                      <br />
                      <Button
                        color="primary"
                        variant="contained"
                        onClick={() => props.goToReport(report)}
                      >
                        Go to Report
                      </Button>
                    </div>
                    <div>
                      <img
                        src={report.imageURL}
                        width="200px"
                        style={{
                          border: "2px solid black",
                          borderRadius: "10px",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                        alt={"Validated Pothole"}
                      />
                    </div>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
        {props.heatMapOn ? (
          <HeatmapLayer
            data={props.heatMapData}
            options={{
              radius: 60,
              opacity: 0.8,
            }}
          />
        ) : (
          <HeatmapLayer
            data={props.heatMapData}
            options={{
              radius: 0,
              opacity: 0,
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
});

export default MapView;
