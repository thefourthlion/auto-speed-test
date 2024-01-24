import React, { useState, useEffect } from "react";
import "../styles/Home.css";

const Home = () => {
  const [speeds, setSpeeds] = useState([])

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
    <div className="Home pages">
      <div className="clientListContainer">
        <h3>Client List</h3>
        {speeds.map((item, index) => (
          <div key={index}>
            <a href={`client?id=${item._id}`}>
            <p >{item.Ip}</p>
              </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
