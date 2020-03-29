// this component is used in the detailed report
// section. acts as a label to each major component
// in the same.
import React from "react";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";

const HeaderTextCard = props => {
  return (
    <Typography
      gutterBottom
      style={{ marginBottom: props.marginBottom, color: props.color }}
    >
      <b>
        {props.text} &nbsp;
        {props.editIcon && (
          <EditIcon style={{ marginTop: "-5px" }} fontSize={"small"} />
        )}
      </b>
    </Typography>
  );
};

export default HeaderTextCard;
