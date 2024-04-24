// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Lofargram from "./components/Lofargram";
import PolarChart from "./components/PolarChart";
import ViewReport from "./components/ViewReport";
import BouyPanel from "./components/BouyPanel";
import Calendar from "./components/Calendar";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lofargram" element={<Lofargram />} />
          <Route path="/polarchart" element={<PolarChart />} />
          <Route path="/viewreport" element={<ViewReport />} />
          <Route path="/panel" element={<BouyPanel />}/>
          <Route path="/calendar" element={<Calendar />}/>
          <Route path="/loading" element={<Loading />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
