import React from "react";
import Speeds from "../components/Speeds";
import "../styles/Home.css";
import Charts from "../components/Charts";
const Home = () => {
  return (
    <div className="Home pages">
      <Charts />  
      {/* <Speeds /> */}
    </div>
  );
};
export default Home;
