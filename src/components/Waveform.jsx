import React from "react";
import Plot from "react-plotly.js";

const Waveform = ({ waveformData, dimensions }) => {
  const { t_waveform, audio_reconstructed_waveform } = waveformData;

  return (
    <svg
      width="600"
      height="354"
      viewBox="0 0 651 354"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12.5 129V113.5V98L1 90V13V1H180.5L195.5 13H649.5V179.5V192V353H248H235.5H12.5V129ZM640 31H22.5V342H640V31Z"
        fill="url(#paint0_linear_435_1941)"
        stroke="#09B5FE"
        stroke-width="2"
      />
      <rect x="24" y="32" width="615" height="309" fill="#0C4569" />
      <path
        d="M43.024 22L41.22 8.294H43.376L44.3 16.896L46.06 9.372H47.38L49.14 16.874L49.866 8.294H51.89L50.108 22H48.546L46.61 13.552L44.63 22H43.024ZM62.428 22L61.482 18.81H57.896L56.928 22H54.464L59.106 8.206H60.294L64.936 22H62.428ZM59.7 12.804L58.424 17.028H60.954L59.7 12.804ZM72.152 22.044L67.752 8.294H70.216L73.098 17.93L75.782 8.294H78.18L73.824 22.044H72.152ZM81.722 22V8.294H90.654V10.318H84.142V13.838H89.488V15.884H84.142V19.976H90.588V22H81.722ZM95.252 22V8.294H103.788V10.296H97.474V13.618H102.6V15.62H97.474V22H95.252ZM112.544 22.264C110.857 22.264 109.581 21.648 108.716 20.416C107.851 19.184 107.418 17.4313 107.418 15.158C107.418 12.9433 107.851 11.2127 108.716 9.966C109.581 8.71933 110.857 8.096 112.544 8.096C114.201 8.096 115.463 8.71933 116.328 9.966C117.208 11.2127 117.648 12.9433 117.648 15.158C117.648 17.4313 117.208 19.184 116.328 20.416C115.463 21.648 114.201 22.264 112.544 22.264ZM112.544 20.24C113.365 20.24 114.011 19.822 114.48 18.986C114.949 18.1353 115.184 16.852 115.184 15.136C115.184 13.5373 114.949 12.3053 114.48 11.44C114.011 10.56 113.365 10.12 112.544 10.12C111.693 10.12 111.033 10.56 110.564 11.44C110.109 12.3053 109.882 13.5373 109.882 15.136C109.882 16.852 110.109 18.1353 110.564 18.986C111.033 19.822 111.693 20.24 112.544 20.24ZM121.19 22V8.294H125.524C127.196 8.294 128.421 8.66067 129.198 9.394C129.975 10.1273 130.364 11.1027 130.364 12.32C130.364 12.8187 130.254 13.3247 130.034 13.838C129.829 14.3367 129.528 14.784 129.132 15.18C128.751 15.576 128.303 15.8693 127.79 16.06L130.738 22H128.12L125.348 16.302H123.698V22H121.19ZM123.698 14.234H125.7C126.404 14.234 126.932 14.0727 127.284 13.75C127.636 13.4127 127.812 12.958 127.812 12.386C127.812 11.858 127.636 11.4033 127.284 11.022C126.932 10.6407 126.404 10.45 125.7 10.45H123.698V14.234ZM134.104 22V8.294H136.282L138.944 14.586L141.606 8.272H143.784V22H141.628V12.43L139.472 17.468H138.262L136.238 12.452V22H134.104Z"
        fill="#89D2FF"
      />
      <defs>
        <linearGradient
          id="paint0_linear_435_1941"
          x1="801.681"
          y1="-308.243"
          x2="-78.3047"
          y2="418.714"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.169223" stop-color="#00092A" stop-opacity="0.77" />
          <stop offset="0.861292" stop-color="#004970" />
          <stop offset="1" stop-color="#004970" stop-opacity="0" />
        </linearGradient>
      </defs>

      <foreignObject x="30" y="20" width="600" height="360">
        <Plot
          data={[
            {
              x: t_waveform,
              y: audio_reconstructed_waveform,
              type: "scatter",
              mode: "lines",
              line: {
                color: "#0CFEFF",
                width: 1 // Set the line width here
              },
            },
          ]}
          layout={{
            width: 640,
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
            xaxis: {
              title: "Time (sec)",
              gridcolor: "#e3e3e370",
            },
            yaxis: {
              title: "Amplitude (Volts)",
              gridcolor: "#e3e3e370",
            },
          }}
          config={{ displayModeBar: false }}
        />
      </foreignObject>
    </svg>
  );
};

export default Waveform;
