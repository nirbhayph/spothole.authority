// bar chart component for the
// analytics section in the dashboard
import React, { PureComponent } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

class BarChartBlock extends PureComponent {
  makeData = data => {
    let madeData = {};
    for (let counter = 1; counter <= 10; counter++) {
      madeData[counter] = {
        name: "Sev " + counter,
        submitted: 0,
        approved: 0,
        working: 0,
        completed: 0,
        cancelled: 0
      };
    }
    data.forEach(report => {
      madeData[report.severity][report.status] += 1;
    });
    return Object.values(madeData);
  };
  render() {
    const screenWidth =
      window.innerWidth < 500 ? window.innerWidth - 75 : window.innerWidth / 3;
    let dataToUse = this.makeData(this.props.data);
    return (
      <div>
        <BarChart
          width={screenWidth}
          height={542}
          data={dataToUse}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend layout="horizontal" align="center" />{" "}
          <Bar dataKey="submitted" stackId="a" fill="#4285F4" />
          <Bar dataKey="approved" stackId="a" fill="#34A853" />
          <Bar dataKey="working" stackId="a" fill="#FBBC05" />
          <Bar dataKey="completed" stackId="a" fill="#990099" />
          <Bar dataKey="cancelled" stackId="a" fill="#EA4335" />
        </BarChart>
      </div>
    );
  }
}

export default BarChartBlock;
