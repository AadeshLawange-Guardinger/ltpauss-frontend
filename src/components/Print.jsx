/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Plot from "react-plotly.js";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../styles/Print.css"; // Import CSS for blinking effect
import { wesee_logo, homepage, print } from "../assets";

function transposeMatrix(matrix) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

export default function Print() {
  const [lofarData, setLofarData] = useState(null);
  const [psdData, setPsdData] = useState(null);
  const [waveformData, setWaveformData] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [reportInfo, setReportInfo] = useState(null);
  const [bouyId, setBouyId] = useState("");
  const [packetId, setPacketId] = useState("");
  const [doa, setDoa] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setLofarData(state.stft_data);
      setPsdData(state.psd_data);
      setWaveformData(state.waveform_data);
      setMapData(state.map_data);
      setReportInfo(state.report_info);
      setBouyId(state.bouy_id || "");
      setPacketId(state.packet_id || "");
      setDoa(state.doa || "");
    }
  }, [state]);

  useEffect(() => {
    // Check if all data is loaded
    if (lofarData && psdData && waveformData && mapData && reportInfo) {
      setIsLoading(false); // All plots are loaded
    }
  }, [lofarData, psdData, waveformData, mapData, reportInfo]);

  // Define custom blinking red dot icon
  const blinkingRedDotIcon = L.divIcon({
    className: "map-dot-icon",
    iconSize: [50, 50],
  });

  // Remove the degree symbol from doa
  let doaPlot = doa.replace("°", "");

  // Prepare data for the polar chart
  const data = [
    {
      type: "scatterpolar",
      r: [1], // Magnitude of the direction
      theta: [doaPlot], // Direction of arrival
      mode: "markers",
      marker: {
        size: 20,
        symbol: "point",
        color: "#018C8C", // Customize the color of the marker
      },
    },
    {
      type: "scatterpolar",
      r: [0, 1], // Line from origin to the point
      theta: [0, doaPlot],
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
        visible: true,
        range: [0, 1], // Set the range of radial axis
        tickvals: [0, 90, 180, 270], // Define the tick values
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
    width: 1250,
    height: 508,
    margin: {
      t: 50,
      b: 50,
      l: 50,
      r: 50,
    },
    font: {
      color: "#000000",
    },
    plot_bgcolor: "transparent",
    paper_bgcolor: "transparent",
  };

  // Function to handle when all plots are rendered
  const handlePlotsLoaded = () => {
    setIsLoading(false);
  };

  const handlePrintRequest = () => {
    const elements = document.querySelectorAll(".page-1, .page-2, .page-3");
    const timestamp = new Date()
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
      .replace(/[\/:]/g, "_")
      .replace(/\s/g, "_")
      .toLowerCase();

    const pdf = new jsPDF({
      orientation: "portrait",
    });

    const addHeader = (pdf, img) => {
      pdf.setFillColor(255, 255, 255); // White background
      pdf.rect(0, 0, 210, 30, "F"); // Rectangle for header background
      pdf.addImage(img, "JPEG", 10, 1, 32, 35); // Logo image

      const dateString = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const timeString = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      });

      pdf.setFontSize(10);
      pdf.setTextColor(0);
      pdf.text(`${dateString} ${timeString} (IST)`, 205, 10, {
        align: "right",
      });
    };

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });
    };

    loadImage(wesee_logo)
      .then((img) => {
        const promises = Array.from(elements).map((element, index) =>
          html2canvas(element, { useCORS: true }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const width = 210; // Width of A4 in mm
            const height = (canvas.height * width) / canvas.width; // Maintain aspect ratio

            if (index !== 0) {
              pdf.addPage(); // New page for subsequent elements
            }

            if (element.classList.contains("page-1") && index === 0) {
              addHeader(pdf, img); // Add header only to the first page
            }

            let { posY } = 10;

            if (element.classList.contains("page-1") && index === 0) {
              posY = 20; // Initial Y position with space from top
            } else {
              posY = 0;
            }

            pdf.addImage(imgData, "PNG", 0, posY + 20, width, height); // Add image to PDF
          })
        );

        return Promise.all(promises);
      })
      .then(() => {
        const storedData = localStorage.getItem("reportData");
        pdf.save(`report_${bouyId}_${timestamp}.pdf`); // Download PDF

        if (storedData) {
          const data = JSON.parse(storedData);
          navigate("/viewreport", { state: data }); // Pass data as state
        }
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  const handleHomepage = () => {
    navigate("/dashboard");
  };

  return (
    <div className="print-div">
      <div className="print-report-header">
        <img src={wesee_logo} alt="" srcset="" />
      </div>
      <div className="page-1">
        <div className="print-head">
          <h1>Report</h1>
        </div>
        <div className="print-container">
          {reportInfo && (
            <div className="print-report-info">
              <table className="data-table print-table">
                <tr>
                  <td>
                    <h4>Buoy ID</h4>
                  </td>
                  <td>
                    <h4>{bouyId}</h4>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Packet No</h4>
                  </td>
                  <td>
                    <h4>{packetId}</h4>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Date & Time</h4>
                  </td>
                  <td>
                    <h4>
                      {reportInfo.date} {reportInfo.time} IST
                    </h4>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Latitude & Longitude</h4>
                  </td>
                  <td>
                    <h4>
                      {reportInfo.latitude}°, {reportInfo.longitude}°
                    </h4>
                  </td>
                </tr>
                <tr>
                  <td>
                    <h4>Direction Of Arrival</h4>
                  </td>
                  <td>
                    <h4>{doa}</h4>
                  </td>
                </tr>
              </table>
            </div>
          )}
        </div>
      </div>
      <div className="page-2">
        <div className="print-container">
          <div className="print-plot-container">
            <h1>Short Time Fourier Transform (STFT)</h1>
            {lofarData && (
              <Plot
                className="plots-container"
                data={[
                  {
                    x: lofarData.F.map((row) => row[0]),
                    y: lofarData.T[0],
                    z: transposeMatrix(lofarData.Zxx_compressed_resized),
                    colorscale: [
                      [0, "#E9E9E9"], // 0% will be black
                      [1, "#FF0000"], // 100% will be white
                    ],
                    type: "heatmap",
                    colorbar: {
                      title: {
                        text: "dBrms ref 1 μPa/√Hz",
                        side: "right",
                      },
                    },
                  },
                ]}
                layout={{
                  width: 1200,
                  height: 500,
                  xaxis: {
                    title: {
                      text: "Frequency (Hz)",
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Time (sec)",
                    },
                  },
                }}
                config={{
                  displayModeBar: false,
                }}
                onInitialized={handlePlotsLoaded} // Call when plot is rendered
                onUpdate={handlePlotsLoaded} // Call when plot is updated
              />
            )}
          </div>
          <div className="print-plot-container">
            <h1>Power Spectral Density (PSD)</h1>
            {psdData && (
              <Plot
                className="plots-container"
                data={[
                  {
                    x: psdData.freqs_psd,
                    y: psdData.psd,
                    mode: "lines",
                    marker: { color: "#000000" },
                  },
                ]}
                layout={{
                  width: 1200,
                  height: 500,
                  xaxis: {
                    title: {
                      text: "Frequency (Hz)",
                    },
                  },
                  yaxis: {
                    title: {
                      text: "Time (sec)",
                    },
                  },
                }}
                config={{
                  displayModeBar: false,
                }}
                onInitialized={handlePlotsLoaded} // Call when plot is rendered
                onUpdate={handlePlotsLoaded} // Call when plot is updated
              />
            )}
          </div>
          <div className="print-plot-container">
            <h1>Direction Of Arrival (DOA)</h1>
            {psdData && (
              <Plot
                className="plots-container"
                data={data}
                layout={layout}
                config={{ displayModeBar: false }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="page-3">
        <div className="print-container">
          <div className="print-plot-container">
            <h1>Waveform (Time vs Amplitude)</h1>
            {waveformData && (
              <Plot
                className="plots-container"
                data={[
                  {
                    x: waveformData.t_waveform,
                    y: waveformData.audio_reconstructed_waveform,
                    type: "scatter",
                    mode: "lines",
                  },
                ]}
                layout={{
                  width: 1200,
                  height: 500,
                  xaxis: {
                    title: "Time (sec)",
                  },
                  yaxis: {
                    title: "Amplitude (Volts)",
                  },
                }}
                config={{ displayModeBar: false }}
                onInitialized={handlePlotsLoaded} // Call when plot is rendered
                onUpdate={handlePlotsLoaded} // Call when plot is updated
              />
            )}
          </div>
          <div className="print-plot-container">
            <h1>Sonabuoy Location</h1>
            {mapData && (
              <MapContainer
                className="world-map-container dark"
                center={[mapData.lat, mapData.long]}
                zoom={14.5} // You can adjust the default zoom level here
                style={{ height: "500px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[mapData.lat, mapData.long]}
                  icon={blinkingRedDotIcon}
                >
                  <Popup>Direction of Arrival: {mapData.doa}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
          <div className="remark-print">Remarks:</div>
          <div className="authorization-notice">Authorized Signatory</div>
        </div>
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <button className="print-btn" onClick={handlePrintRequest}>
            <img src={print} alt="" srcset="" style={{width:"25px"}}/>
          </button>
          <button className="home-btn" style={{right:"60px"}} onClick={handleHomepage}>
          <img src={homepage} alt="" srcset="" style={{width:"25px"}}/>
          </button>
        </div>
      )}
    </div>
  );
}
