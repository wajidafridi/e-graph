import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
// @import styles
import styles from "./index.module.scss";

const colorMap = {
  Main: "#B798F5",
  Solar: "#02E10C",
  DG: "#403F3D",
  Battery: "#FDE602",
  "Solar+Battery": "#86B0FF",
  "Battery+Solar": "#86B0FF",
  "Main+Solar": "#7243D0",
  "Main+Battery": "#32864B",
  "Main+Solar+Battery": "#8BC486",
  "DG+Solar": "red",
  "Solar+DG": "red",
  "DG+Battery": "magenta",
  "Battery+DG": "magenta",
  "DG+Solar+Battery": "cyan",
  "DG+Battery+Solar": "cyan",
  Undetermined: "#BBE3FD",
  empty: "white",
};

const generateMissingData = (dateTimeString) => {
  const updatedDateTime = new Date(dateTimeString.getTime() + 5 * 60000);
  const updatedDateString = updatedDateTime.toISOString().split("T")[0];
  const updatedTimeString = updatedDateTime.toTimeString().split(" ")[0];
  return {
    timeStamp: `${updatedDateString} ${updatedTimeString}`,
    date: updatedDateString,
    minute_window: updatedTimeString.substring(0, 5),
  };
};

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
          itemStyle: {
            color: getColor(sourceTag),
          },
        });

        if (index !== chartData.length - 1) {
          const currentDate = new Date(timeStamp);
          const nextDataPoint = chartData[index + 1];
          const nextDate = new Date(nextDataPoint.timeStamp);
          const timeDifference = Math.abs(
            nextDate.getTime() - currentDate.getTime()
          );
          if (timeDifference > 300000) {
            const missingDataPoints = Math.floor(timeDifference / 300000) - 1;
            let previousDate=currentDate;
            for (let i = 1; i <= missingDataPoints; i++) {
              const nextXTime = generateMissingData(previousDate);
              dataPoints.push({
                value: [
                  nextXTime.minute_window,
                  nextXTime.date,
                  "empty",
                  nextXTime.timeStamp,
                ],
                symbol: "rect",
                itemStyle: {
                  color: getColor("empty"),
                },
              });
              previousDate=new Date(nextXTime.timeStamp);
            }
          }
        }
      }
      option.yAxis.data = yAxisData;
      option.series[0].data = dataPoints;
    }
    return option;
  };

  const getColor = (sourceTag) => {
    return colorMap[sourceTag] || "#000000";
  };

  return (
    <div className={styles.homePage}>
      <ReactECharts option={generateOption()}/>;
    </div>
  );
};

export default PowerSourceChart;
