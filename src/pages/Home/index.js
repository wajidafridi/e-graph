import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
// @import styles
import styles from "./index.module.scss";


const generateXaxis = () => {
  var startTime = new Date();
  startTime.setHours(0, 0, 0, 0);
  var interval = 5 * 60 * 1000;
  var dataPoints = (24 * 60) / 5;

  var xAxisData = [];
  for (var i = 0; i < dataPoints; i++) {
    var currentTime = new Date(startTime.getTime() + i * interval);
    var formattedTime = currentTime.toLocaleTimeString([], {
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    });

    xAxisData.push(formattedTime);
  }
  return xAxisData;
};

const PowerSourceChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // to do fetch data from follow api
    // https://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed
  }, []);

  const generateOption = () => {
    const option = {
      title: {
        text: "Power Source Chart",
        textStyle: {
          color: "#FFFFFF",
        },
        left: "auto",
        // right:'auto',
      },
      backgroundColor: "#000000",
      tooltip: {
        backgroundColor: "#FFFFFF",
        textStyle: {
          color: "#000000",
        },
        borderColor: "#CCCCCC",
        trigger: "item",
        formatter: function (params) {
          const dotColor = getColor(params.value[2]);
          return `<span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;background-color:${dotColor}"></span>${params.value[2]} : ${params.value[3]}`;
        },
      },
      xAxis: {
        type: "category",
        data: generateXaxis(),
        axisLabel: {
          textStyle: {
            color: "#FFFFFF",
          },
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            color: "#CCCCCC",
          },
        },
      },
      yAxis: {
        type: "category",
        data: [],
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#FFFFFF",
          },
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          type: "scatter",
          symbolSize: 20,
          data: [],
        },
      ],
      dataZoom: [
        {
          type: "inside",
          xAxisIndex: 0,
          filterMode: "none",
          start: 0,
          end: 100,
          textStyle: {
            color: "#FFFFFF",
          },
        },
        {
          type: "slider",
          xAxisIndex: 0,
          filterMode: "none",
          top: "90%",
          height: "5%",
          start: 0,
          end: 100,
          textStyle: {
            color: "#FFFFFF",
          },
          borderColor: "#CCCCCC",
        },
        {
          type: "slider",
          yAxisIndex: 0,
          filterMode: "empty",
          left: "95%",
          start: 0,
          end: 100,
          textStyle: {
            color: "#FFFFFF",
          },
          borderColor: "#CCCCCC",
        },
      ],
    };
    return option;
  };
  return (
    <div className={styles.homePage}>
      <ReactECharts option={generateOption()}/>;
    </div>
  );
};

export default PowerSourceChart;
