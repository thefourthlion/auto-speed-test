import React from "react";
import "../styles/Home.css";
import PingCharts from "../components/PingCharts"
import SpeedCharts from "../components/SpeedCharts";
const Home = () => {
  return (
    <div className="Home pages">
      <PingCharts />
      <SpeedCharts />
    </div>
  );
};
export default Home;
