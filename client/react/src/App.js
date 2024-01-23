import "./styles/ClientCharts.css"; import "./styles/Speeds.css";
import "./styles/Ping.css";
import "./styles/Login.css";
import "./styles/SignUp.css";
import "./styles/PingCharts.css";
import "./styles/SpeedCharts.css";
import "./styles/PingChart.css";
import "./styles/SpeedChart.css";
import "./styles/Chart.css";
import "./styles/SpeedCard.css";
import "./styles/Speeds.css";
import "./styles/globals.css";
import React from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Speeds from "./pages/Speeds";
import Ping from "./pages/Ping"
import ClientCharts from "./pages/ClientCharts";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="Home" element={<Home />} />
            <Route path="Login" element={<Login />} />
            <Route path="SignUp" element={<SignUp />} />
            <Route path="Speeds" element={<Speeds />} />
            <Route path="pings" element={<Ping />} />
            <Route path="Client" element={<ClientCharts />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
