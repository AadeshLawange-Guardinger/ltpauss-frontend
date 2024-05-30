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
import { wesee_logo } from "../assets";

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
    className: "blinking-dot-icon",
    iconSize: [12, 12],
  });

  // Function to handle when all plots are rendered
  const handlePlotsLoaded = () => {
    setIsLoading(false);
  };

  const handlePrintRequest = () => {
    const elements = document.querySelectorAll(".page-1,.page-2");
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
      orientation: "portrait", // Set orientation to portrait
    });

    let posY = 20; // Set initial Y position with space from top

    // Add header to the first page
    // Add header to the first page
    const addHeader = (pageNumber) => {
      // Set header background color
      pdf.setFillColor(255, 255, 255); // #004367 in RGB

      // Fill a rectangle as the header background
      pdf.rect(0, 0, 210, 30, "F"); // (x, y, width, height, style)

      const img = new Image();
      img.src = wesee_logo; // Assuming wesee_logo is the imported image
      img.onload = function () {
        pdf.addImage(this, "JPEG", 10, 1, 32, 25); // Add the image to the header

        // Add timestamp to the right corner
        const dateOptions = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        };
        const timeOptions = {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        };
        const dateString = new Date().toLocaleDateString("en-US", dateOptions);
        const timeString = new Date().toLocaleTimeString("en-US", timeOptions);

        pdf.setFontSize(10);
        pdf.setTextColor(0);
        pdf.text(
          `${dateString} ${timeString} (IST)`,
          205,
          10,
          null,
          null,
          "right"
        ); // Add timestamp to the right corner
      };
      img.onerror = function () {
        console.error("Error loading image.");
      };
    };

    Promise.all(
      Array.from(elements).map((element, index) =>
        html2canvas(element, {
          useCORS: true,
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const width = 210; // Width of A4 in mm
          const height = (canvas.height * width) / canvas.width; // Maintain aspect ratio
          if (index !== 0) {
            pdf.addPage(); // Add a new page for subsequent elements
            posY = 20; // Reset posY for new page with space from top
          } else {
            addHeader(1); // Add header to the first page
          }
          pdf.addImage(imgData, "PNG", 0, posY + 20, width, height); // Add image to PDF with adjusted Y position
          posY += height + 40; // Update Y position for next element with space between elements
        })
      )
    ).then(() => {
      const storedData = localStorage.getItem("reportData");
      pdf.save(`report_${bouyId}_${timestamp}.pdf`); // Download PDF
      if (storedData) {
        // Parse the stored data back to an object
        const data = JSON.parse(storedData);

        // Print data to console
        //console.log("Data from localStorage:", data);
        navigate("/viewreport", { state: data }); // Pass data as state
      }
    });
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
          <div className="print-plot-container">
            <h1>Waveform (Time vs Amplitude)</h1>
            {waveformData && (
              <Plot
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
        </div>
      </div>
      <div className="page-2">
        <div className="print-container">
          <div className="print-plot-container">
            <h1>Short Time Fourier Transform (STFT)</h1>
            {lofarData && (
              <Plot
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
          {/* <div className="print-plot-container">
          <h1>Sonabuoy Location</h1>
          {mapData && (
            <MapContainer
              className="world-map-container dark"
              center={[mapData.lat, mapData.long]}
              zoom={13} // You can adjust the default zoom level here
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Circle
                center={[mapData.lat, mapData.long]}
                radius={1000}
                fillOpacity={0.4}
                weight={0}
                opacity={0.4}
              />
              <Marker
                position={[mapData.lat, mapData.long]}
                icon={blinkingRedDotIcon}
              >
                <Popup>Direction of Arrival: {mapData.doa}</Popup>
              </Marker>
            </MapContainer>
          )}
        </div> */}

          <div className="remark-print">Remarks:</div>
        </div>
        {/* <div className="authorization-notice">
          This report is authorized by The R&D establishment of the Indian Navy
          – “WESEE”.
        </div> */}
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <button className="print-btn" onClick={handlePrintRequest}>
          Print Report
        </button>
      )}
    </div>
  );
}
