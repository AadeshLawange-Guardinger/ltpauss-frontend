import React from "react";
// import Plot from "react-plotly.js";
import {compass} from "../assets";

const PolarChart = ({ polarChartData, dimensions }) => {
  // Define the static direction (e.g., 45 degrees)
  let { doa } = polarChartData;

  // Remove the degree symbol from doa
  doa = doa.replace("°", "");

  // Prepare data for the polar chart
  // const data = [
  //   {
  //     type: "scatterpolar",
  //     r: [1], // Magnitude of the direction
  //     theta: [doa], // Direction of arrival
  //     mode: "markers",
  //     marker: {
  //       size: 15,
  //       color: "red", // Customize the color of the marker
  //     },
  //   },
    // {
    //   type: "scatterpolar",
    //   r: [0, 0.75], // Line from origin to the point
    //   theta: [0, doa],
    //   mode: "lines",
    //   line: {
    //     color: "red", // Color of the line
    //     dash: "dot", // Make the line dotted
    //   },
    // },
  // ];

  // Layout configuration for the polar chart
  // const layout = {
  //   polar: {
  //     radialaxis: {
  //       visible: false,
  //       range: [0, 1], // Set the range of radial axis
  //       tickvals: [0, 90, 180, 270], // Define the tick values
  //       ticktext: ["E", "N", "W", "S"], // Define the tick labels
  //       fill: "rgba(0, 0, 0, 0)", // Make the radial axis background color transparent
  //     },
  //   },
  //   // Hide legends
  //   showlegend: false,
  //   // Hide the coordinates
  //   hoverinfo: "none",
  //   // Configure modebar to be hidden
  //   config: {
  //     displayModeBar: false,
  //   },
  //   width: 650,
  //   height: 308,
  //   margin: {
  //     t: 50,
  //     b: 50,
  //     l: 50,
  //     r: 50,
  //   },
  //   font: {
  //     color: "#0CFEFF",
  //   },
  //   plot_bgcolor: "transparent",
  //   paper_bgcolor: "transparent",
  // };

  return (
    <svg width="371" height="311" viewBox="0 0 371 311" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.5 110.5V84.959L1 74.5V39V1H166.5L174.5 11.5H269.5H369.5V168.5V204.5V239V310H141.997H135.039H7.5V110.5ZM360.212 25.8306H16.4684V300.292H360.212V25.8306Z" fill="url(#paint0_linear_609_1807)" stroke="#09B5FE" stroke-width="2"/>
    <path d="M15.34 20V7.54H18.56C19.6533 7.54 20.5 7.69333 21.1 8C21.7133 8.29333 22.2267 8.71333 22.64 9.26C23.0533 9.82 23.3733 10.4867 23.6 11.26C23.84 12.0333 23.96 12.9 23.96 13.86C23.9333 15.1133 23.7267 16.2067 23.34 17.14C22.9533 18.06 22.3467 18.7667 21.52 19.26C20.7067 19.7533 19.64 20 18.32 20H15.34ZM17.54 18.24H18.26C19.1133 18.24 19.7933 18.06 20.3 17.7C20.82 17.34 21.1933 16.8333 21.42 16.18C21.6467 15.5267 21.7533 14.76 21.74 13.88C21.74 12.96 21.64 12.16 21.44 11.48C21.2533 10.8 20.92 10.2733 20.44 9.9C19.96 9.52667 19.3067 9.34 18.48 9.34H17.54V18.24ZM31.54 20.24C30.0067 20.24 28.8467 19.68 28.06 18.56C27.2733 17.44 26.88 15.8467 26.88 13.78C26.88 11.7667 27.2733 10.1933 28.06 9.06C28.8467 7.92667 30.0067 7.36 31.54 7.36C33.0467 7.36 34.1933 7.92667 34.98 9.06C35.78 10.1933 36.18 11.7667 36.18 13.78C36.18 15.8467 35.78 17.44 34.98 18.56C34.1933 19.68 33.0467 20.24 31.54 20.24ZM31.54 18.4C32.2867 18.4 32.8733 18.02 33.3 17.26C33.7267 16.4867 33.94 15.32 33.94 13.76C33.94 12.3067 33.7267 11.1867 33.3 10.4C32.8733 9.6 32.2867 9.2 31.54 9.2C30.7667 9.2 30.1667 9.6 29.74 10.4C29.3267 11.1867 29.12 12.3067 29.12 13.76C29.12 15.32 29.3267 16.4867 29.74 17.26C30.1667 18.02 30.7667 18.4 31.54 18.4ZM45.98 20L45.12 17.1H41.86L40.98 20H38.74L42.96 7.46H44.04L48.26 20H45.98ZM43.5 11.64L42.34 15.48H44.64L43.5 11.64Z" fill="#89D2FF"/>
    <rect x="17" y="27" width="342" height="273" fill="white"/>
    <defs>
    <linearGradient id="paint0_linear_609_1807" x1="450.215" y1="-273.556" x2="-197.952" y2="64.194" gradientUnits="userSpaceOnUse">
    <stop offset="0.169223" stop-color="#00092A" stop-opacity="0.77"/>
    <stop offset="0.861292" stop-color="#004970"/>
    <stop offset="1" stop-color="#004970" stop-opacity="0"/>
    </linearGradient>
    </defs>
    <foreignObject x="-120" y="35" width="600" height="360">
        {/* <Plot data={data} layout={layout} config={{ displayModeBar: false }} /> */}
        <div className="compass-container" style={{width:"250px", height:"250px"}}>
          <div className="compass" style={{ transform: `rotate(${doa}deg)` }}>
            <div className="arrow-dash"></div>
          </div>
          <img src={compass} alt="Compass Background" className="compass-background"/>
        </div>
    </foreignObject>  
    </svg>
  );
};

export default PolarChart;
