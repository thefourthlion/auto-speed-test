import React, { useState, useEffect } from "react";
import AvgExternalPing from "../components/AvgExternalPing"
import OverallHealth from "../components/OverallHealth"
const Home = () => {
  return (
    <div className="Home page">
      <OverallHealth />
      <AvgExternalPing />
    </div>
  )
}

export default Home