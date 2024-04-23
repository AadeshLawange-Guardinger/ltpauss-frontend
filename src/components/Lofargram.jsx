import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";
import { view_bg, btn_bg, home } from "../assets";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate

let previousMomsn = null; // Initialize previousMomsn outside the component

function Lofargram() {
  const [data, setData] = useState({});
  const [showPlot, setShowPlot] = useState(false); // Track if plot should be shown
  const [latestMessage, setLatestMessage] = useState(null); // Track the latest message
  const [showMessagePopup, setShowMessagePopup] = useState(false); // Track if message popup should be shown
  const [momsnStart, setMomsnStart] = useState(""); // Track the start momsn
  const [momsnEnd, setMomsnEnd] = useState(""); // Track the end momsn
  const [showInput, setShowInput] = useState(false); // Track if input should be shown

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchLatestMessage(); // Fetch initial latest message
    const interval = setInterval(fetchLatestMessage, 5000); // Fetch latest message every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchLatestMessage = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/latest/message/");
      const responseData = await response.json();
      setLatestMessage(responseData);
      if (previousMomsn !== null && responseData.momsn > previousMomsn) {
        setShowMessagePopup(true);
        setTimeout(() => {
          setShowMessagePopup(false);
        }, 13000); // Hide popup after 13 seconds
      }
      previousMomsn = responseData.momsn; // Update previousMomsn
    } catch (error) {
      console.error("Error fetching latest message:", error);
    }
  };

  const fetchData = async () => {
    try {
      const data = {
        momsnStart: momsnStart,
        momsnEnd: momsnEnd,
      };

      const response = await fetch(
        "http://127.0.0.1:8000/rockblock/messages/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data from the server");
      }

      const responseData = await response.json();
      console.log(responseData);

      // Check if the response data is empty or invalid
      if (
        !responseData.stft_data ||
        !responseData.stft_data.T ||
        !responseData.stft_data.F ||
        !responseData.stft_data.Zxx_compressed_resized
      ) {
        setShowPlot(false); // Hide the plot
        alert("No valid data available in the database");
      }

      setData(responseData.stft_data);
      setShowPlot(true); // Set showPlot to true after fetching data
    } catch (error) {
      alert("Error fetching data/No valid data available in the database");
      // Show error message or handle error state as needed
    }
  };

  const handleInputSubmit = () => {
    setShowInput(false);
    fetchData(); // Call fetchData function when input is submitted
  };

  const handleHomeClick = () => {
    navigate("/dashboard"); // Navigate to /lofargram
  };

  function transposeMatrix(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  return (
    <div className="container">
      <img
        src={home}
        alt="Show Plot"
        onClick={handleHomeClick}
        className="home-image"
      />
      {showInput ? (
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter momsn start"
            value={momsnStart}
            onChange={(e) => setMomsnStart(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter momsn end"
            value={momsnEnd}
            onChange={(e) => setMomsnEnd(e.target.value)}
          />
          <img
            src={view_bg}
            alt="Show Plot"
            onClick={handleInputSubmit}
            className="plot-image"
          />
        </div>
      ) : (
        <img
          src={btn_bg}
          style={{ margin: "50px" }}
          alt="Show Plot"
          onClick={() => {
            setShowInput(!showInput);
            setShowPlot(false); // Set showPlot to false whenever the button is clicked
          }}
          className="plot-image"
        />
      )}
      {showPlot && // Render plot only if showPlot is true
        (data.T && data.F && data.Zxx_compressed_resized ? (
          <div className="plot">
            <Plot
              data={[
                {
                  x: data.F.map((row) => row[0]), // Transpose of original data.T
                  y: data.T[0], // Transpose of original data.F
                  z: transposeMatrix(data.Zxx_compressed_resized), // Transpose of original data.Zxx_compressed_resized
                  type: "heatmap",
                  colorbar: {
                    title: {
                      text: "dB rms ref 1 μ Pa Per Square root of Hz",
                      side: "right",
                    },
                  },
                },
              ]}
              layout={{
                width: Math.max(800),
                height: Math.max(600),
                title: "Reconstructed Lofargram",
                font: {
                  color: "white",
                },
                plot_bgcolor: "none",
                paper_bgcolor: "transparent",
                xaxis: {
                  title: {
                    text: "Frequency (Hz)",
                    standoff: 25, // Adjust the padding as needed
                  },
                },
                yaxis: {
                  title: {
                    text: "Time (sec)",
                    standoff: 20, // Adjust the padding as needed
                  },
                },
              }}
              config={{ displayModeBar: false }}
            />
          </div>
        ) : (
          <p className="loading">Loading...</p>
        ))}
      {showMessagePopup && latestMessage && (
        <div className="message-popup">
          New message received at {latestMessage.transmit_time}.
          <span
            className="close-icon"
            onClick={() => setShowMessagePopup(false)}
          ></span>
        </div>
      )}
    </div>
  );
}

export default Lofargram;
