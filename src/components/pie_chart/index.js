// for the pie chart component in the
// analytics section on the dashboard
import React, { PureComponent } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const styles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 400
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const COLORS = ["#4285F4", "#34A853", "#FBBC05", "#990099", "#EA4335"];

class PieChartBlock extends PureComponent {
  makeData = data => {
    // intermediate data
    let madeData = {};
    data.forEach(report => {
      if (madeData[report.status] === undefined) {
        madeData[report.status] = 1;
      } else {
        madeData[report.status] += 1;
      }
    });

    // pieData
    let pieData = [
      { name: "Submitted", value: madeData["submitted"] || 0 },
      { name: "Approved", value: madeData["approved"] || 0 },
      { name: "Working", value: madeData["working"] || 0 },
      { name: "Completed", value: madeData["completed"] || 0 },
      { name: "Cancelled", value: madeData["cancelled"] || 0 }
    ];
    return pieData;
  };

  render() {
    const { classes } = this.props;
    let dataToUse = this.makeData(this.props.data);

    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Statistics
          </Typography>
          <Typography variant="h5" component="h2">
            Current Report Status
          </Typography>
          <Typography variant="body2" component="p">
            <PieChart width={400} height={400}>
              <Pie
                dataKey="value"
                isAnimationActive={true}
                data={dataToUse}
                cx={200}
                cy={200}
                outerRadius={80}
                label
                innerRadius={60}
                paddingAngle={5}
              >
                {dataToUse.map((entry, index) => (
                  <Cell
                    stroke={COLORS[index % COLORS.length]}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
            <br />
            {'"region and severity wise status summary"'}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(PieChartBlock);
