// used to edit the severity of a reported pothole
import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";

const styles = {
  root: {
    width: "100%"
  },
  slider: {
    padding: "22px 0px"
  }
};

class SeverityIndicator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value
    };
  }
  handleChange = (event, value) => {
    this.setState({ value });
    this.props.updateSeverityValue(value);
  };
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Slider
          classes={{ container: classes.slider }}
          value={this.state.value}
          min={1}
          max={10}
          step={1}
          valueLabelDisplay="on"
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

SeverityIndicator.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SeverityIndicator);
