// is a status selector component for the authority
// used to updated the report status.
// (options are dynamically generated using current status of the report)
import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

const optionsArray = [
  "Submitted",
  "Approved",
  "Working",
  "Completed",
  "Cancelled"
];

class StatusSelect extends React.Component {
  constructor(props) {
    super(props);
    let value = this.capitalize(props.value);
    this.state = {
      value: value,
      options: this.mapOptions(value)
    };
  }

  mapOptions = value => {
    let indexToSplitOn = optionsArray.indexOf(value);
    let optionsArrayCopy = optionsArray.slice();
    return optionsArrayCopy.splice(indexToSplitOn);
  };

  handleChange = event => {
    const selectedValue = event.target.value;
    this.setState({
      value: selectedValue
    });
    this.props.updateSelectedValue(selectedValue);
  };

  capitalize = str => {
    str = str.split(" ");

    for (let i = 0, x = str.length; i < x; i++) {
      str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
  };

  render() {
    return (
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-age-native-simple">Status</InputLabel>
        <Select
          fullWidth={true}
          native
          onChange={this.handleChange}
          label="Report Status"
        >
          {this.state.options.map((optionValue, index) => (
            <option value={optionValue}>{optionValue}</option>
          ))}
        </Select>
      </FormControl>
    );
  }
}

export default StatusSelect;
