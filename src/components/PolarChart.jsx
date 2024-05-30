import React from "react";
import Plot from "react-plotly.js";

const PolarChart = ({ polarChartData, dimensions }) => {
  // Define the static direction (e.g., 45 degrees)
  let { doa } = polarChartData;

  // Remove the degree symbol from doa
  doa = doa.replace("°", "");

  // Prepare data for the polar chart
  const data = [
    {
      type: "scatterpolar",
      r: [0.8], // Magnitude of the direction
      theta: [doa], // Direction of arrival
      mode: "markers",
      marker: {
        size: 10,
        color: "#018C8C", // Customize the color of the marker
      },
    },
    {
      type: "scatterpolar",
      r: [0, 0.75], // Line from origin to the point
      theta: [0, doa],
      mode: "lines",
      line: {
        color: "red", // Color of the line
        dash: "dot", // Make the line dotted
      },
    },
  ];

  // Layout configuration for the polar chart
  const layout = {
    polar: {
      radialaxis: {
        visible: false,
        range: [0, 1], // Set the range of radial axis
        tickvals: [0, 90, 180, 270], // Define the tick values
        ticktext: ["E", "N", "W", "S"], // Define the tick labels
        fill: "rgba(0, 0, 0, 0)", // Make the radial axis background color transparent
      },
    },
    // Hide legends
    showlegend: false,
    // Hide the coordinates
    hoverinfo: "none",
    // Configure modebar to be hidden
    config: {
      displayModeBar: false,
    },
    width: 650,
    height: 308,
    margin: {
      t: 50,
      b: 50,
      l: 50,
      r: 50,
    },
    font: {
      color: "#0CFEFF",
    },
    plot_bgcolor: "transparent",
    paper_bgcolor: "transparent",
  };

  return (
    <svg
      width="360"
      height="311"
      viewBox="0 0 371 311"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8 110.5V84.959L1.5 74.5V39V1H167L175 11.5H270H370V168.5V204.5V239V310H142.497H135.539H8V110.5ZM360.712 25.8306H16.9684V300.292H360.712V25.8306Z"
        fill="url(#paint0_linear_598_1792)"
        stroke="#09B5FE"
        stroke-width="2"
      />
      <path
        d="M15.84 20V7.54H19.06C20.1533 7.54 21 7.69333 21.6 8C22.2133 8.29333 22.7267 8.71333 23.14 9.26C23.5533 9.82 23.8733 10.4867 24.1 11.26C24.34 12.0333 24.46 12.9 24.46 13.86C24.4333 15.1133 24.2267 16.2067 23.84 17.14C23.4533 18.06 22.8467 18.7667 22.02 19.26C21.2067 19.7533 20.14 20 18.82 20H15.84ZM18.04 18.24H18.76C19.6133 18.24 20.2933 18.06 20.8 17.7C21.32 17.34 21.6933 16.8333 21.92 16.18C22.1467 15.5267 22.2533 14.76 22.24 13.88C22.24 12.96 22.14 12.16 21.94 11.48C21.7533 10.8 21.42 10.2733 20.94 9.9C20.46 9.52667 19.8067 9.34 18.98 9.34H18.04V18.24ZM32.04 20.24C30.5067 20.24 29.3467 19.68 28.56 18.56C27.7733 17.44 27.38 15.8467 27.38 13.78C27.38 11.7667 27.7733 10.1933 28.56 9.06C29.3467 7.92667 30.5067 7.36 32.04 7.36C33.5467 7.36 34.6933 7.92667 35.48 9.06C36.28 10.1933 36.68 11.7667 36.68 13.78C36.68 15.8467 36.28 17.44 35.48 18.56C34.6933 19.68 33.5467 20.24 32.04 20.24ZM32.04 18.4C32.7867 18.4 33.3733 18.02 33.8 17.26C34.2267 16.4867 34.44 15.32 34.44 13.76C34.44 12.3067 34.2267 11.1867 33.8 10.4C33.3733 9.6 32.7867 9.2 32.04 9.2C31.2667 9.2 30.6667 9.6 30.24 10.4C29.8267 11.1867 29.62 12.3067 29.62 13.76C29.62 15.32 29.8267 16.4867 30.24 17.26C30.6667 18.02 31.2667 18.4 32.04 18.4ZM46.48 20L45.62 17.1H42.36L41.48 20H39.24L43.46 7.46H44.54L48.76 20H46.48ZM44 11.64L42.84 15.48H45.14L44 11.64Z"
        fill="#89D2FF"
      />
      <defs>
        <linearGradient
          id="paint0_linear_598_1792"
          x1="450.715"
          y1="-273.556"
          x2="-197.452"
          y2="64.194"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.169223" stop-color="#00092A" stop-opacity="0.77" />
          <stop offset="0.861292" stop-color="#004970" />
          <stop offset="1" stop-color="#004970" stop-opacity="0" />
        </linearGradient>
      </defs>
      <foreignObject x="-130" y="10" width="600" height="360">
        <Plot data={data} layout={layout} config={{ displayModeBar: false }} />
      </foreignObject>
    </svg>
  );
};

export default PolarChart;
