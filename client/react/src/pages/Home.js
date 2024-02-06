import React, { useState, useEffect } from "react";
import ClientList from "../components/ClientList";
import AvgExternalPing from "../components/AvgExternalPing"
import OverallHealth from "../components/OverallHealth"
const Home = () => {
  return (
    <div className="Home page">
      <OverallHealth/>
        {/* <ClientList/> */}
        <AvgExternalPing />
        

    </div>
  )
}

export default Home