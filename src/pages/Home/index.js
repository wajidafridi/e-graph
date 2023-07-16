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
    const processData = (data) => {
      const processedData = data.map((item) => {
        const dateTimeParts = item.minute_window.split(" ");
        const date = dateTimeParts[0];
        const time = dateTimeParts[1].substring(0, 5);
        const sourceTag = item.sourceTag;
        return {
          date,
          minute_window: time,
          sourceTag,
          timeStamp: item.minute_window,
        };
      });

      return processedData;
    };

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.thunder.softoo.co/vis/api/dashboard/ssu/fixed"
        );
        const jsonData = await response.json();
        const { data, status } = jsonData;

        if (status === "success" && data.length > 0) {
          const processedData = processData(data);
          setChartData(processedData);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
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

    const yAxisData = [];
    const dataPoints = [];

    if (chartData && chartData.length > 0) {
      for (let index = 0; index < chartData.length; index++) {
        const item = chartData[index];
        const yDate = item.date;
        const xTime = item.minute_window;
        const timeStamp = item.timeStamp;
        const sourceTag = item.sourceTag;

        if (!yAxisData.includes(yDate)) {
          yAxisData.push(yDate);
        }

        dataPoints.push({
          value: [xTime, yDate, sourceTag, timeStamp],
          symbol: "rect",
        });
      }
      option.yAxis.data = yAxisData;
      option.series[0].data = dataPoints;
    }
    return option;
  };
  return (
    <div className={styles.homePage}>
      <ReactECharts option={generateOption()}/>;
    </div>
  );
};

export default PowerSourceChart;
