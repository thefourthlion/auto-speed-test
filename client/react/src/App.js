import "./styles/Groups.css";
import "./styles/Packages.css";
import "./styles/Admin.css";
import "./styles/Clients.css";
import "./styles/AllExternalPingData.css";
import "./styles/ClientList.css";
import "./styles/Navigation.css";
import "./styles/SingleExternalPingData.css";
import "./styles/ExternalPingData.css";
import "./styles/ExternalPing.css";
import "./styles/ExternalPing.css";
import "./styles/ClientCharts.css";
import "./styles/Speeds.css";
import "./styles/Ping.css";
import "./styles/Login.css";
import "./styles/SignUp.css";
import "./styles/PingCharts.css";
import "./styles/SpeedCharts.css";
import "./styles/SpeedChart.css";
import "./styles/Chart.css";
import "./styles/SpeedCard.css";
import "./styles/Speeds.css";
import "./styles/globals.css";
import "./styles/Home.css"

import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Speeds from "./pages/Speeds";
import Ping from "./pages/Ping"
import ClientCharts from "./pages/ClientCharts";
import ExternalPing from "./pages/ExternalPing";
import ExternalPingData from "./pages/ExternalPingData";
import AllExternalPingData from "./pages/AllExternalPingData";
import SingleExternalPingData from "./pages/SingleExternalPingData";
import Navigation from "./components/Navigation";
import Clients from "./pages/Clients"
import Admin from "./pages/Admin";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Routes>

          <Route path="/">
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Login" element={<Login />} />
            <Route path="register" element={<SignUp />} />
            <Route path="Speeds" element={<Speeds />} />
            <Route path="pings" element={<Ping />} />
            <Route path="Client" element={<ClientCharts />} />
            <Route path="ExternalPing" element={<ExternalPing />} />
            <Route path="SingleExternalPingData" element={<SingleExternalPingData />} />
            <Route path="ExternalPingData" element={<ExternalPingData />} />
            <Route path="AllExternalPingData" element={<AllExternalPingData />} />
            <Route path="Clients" element={<Clients />} />
            <Route path="Admin" element={<Admin />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
