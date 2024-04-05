 //DisplayTableAppend is the addition component created in order to append the newly messages arrived on the given API latest message link
import React, { useState, useEffect } from 'react';
import './DisplayTable.css';

function DisplayTableAppend({ handleInputSubmit }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://13.201.112.178:8000/rockblock/messages/');
      const jsonData = await response.json();
      console.log('Fetched data:', jsonData);

      if (Array.isArray(jsonData)) {
        // Sort and update existing data
        const newData = jsonData.sort((a, b) => new Date(b.transmit_time) - new Date(a.transmit_time));
        setData(newData);
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // Handle single object scenario
        setData(prevData => [jsonData, ...prevData]); // Add new data at the beginning
      } else {
        console.error('Invalid data format:', jsonData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleViewPlot = (item) => {
    // Extract momsnstart and momsnend from the item
    const momsnStart = item.momsnstart; // Replace with actual property name
    const momsnEnd = item.momsnend; // Replace with actual property name

    // Call handleInputSubmit prop function (assuming it triggers plot display)
    handleInputSubmit({ momsnStart, momsnEnd });
  };

  return (
    <div>
      <h1>History</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>IMEI</th>
            <th>MOMSN</th>
            <th>Transmit Time</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.imei}</td>
              <td>{item.momsn}</td>
              <td>{item.transmit_time}</td>
              <td>
                <button onClick={() => handleViewPlot(item)}>View Plot</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DisplayTableAppend;
