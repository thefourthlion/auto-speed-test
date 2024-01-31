import React, { useState, useEffect } from "react";
import ClientList from "../components/ClientList";
import ExternalPingData from "./ExternalPingData"
const Home = () => {
  return (
    <div className="Home page">
        <ClientList/>
        <ExternalPingData />

    </div>
  )
}

export default Home