import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import ExternalPingData from "./ExternalPingData";

const Home = () => {
  const [speeds, setSpeeds] = useState([])
  const [editClientList, setEditClientList] = useState(false);
  const [deleteInput, setDeleteInput] = useState("")
  const getData = () => {
    fetch("https://api.speeds.everettdeleon.com/api/speeds/read")
      .then((res) => res.json())
      .then((data) => {
        setSpeeds(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="Home page">
      <div className="clientListContainer">
        <h3 >Client List</h3>

        {speeds.map((item, index) => (
          <div className="clientList" key={index}>
            <a href={`client?id=${item._id}`}>
              <p >{item.Ip}</p>
            </a>
            <p className="editClient" onClick={() => { setEditClientList(!editClientList) }}>🚫</p>
          </div>
        ))}
        {editClientList && <input onChange={(e) => { setDeleteInput(e.target.value) }} type="text" placeholder="client name" />}
      </div>

      <p>{deleteInput}</p>

      <ExternalPingData/>
    </div>
  );
};

export default Home;
