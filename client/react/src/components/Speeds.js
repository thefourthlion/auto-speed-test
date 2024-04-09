import React, { useEffect, useState } from "react";
import SpeedCard from "./SpeedCard";
const Speeds = () => {
  const [speeds, setSpeeds] = useState([]);

  const getSpeeds = () => {
    fetch("http://localhost:4001/api/speeds/read")
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
    getSpeeds();
  }, []);

  return (
    <div className="Speeds">
      <div className="container">
        {speeds.map((item, key) => (
          <div>
            <SpeedCard
              Ip={item.Ip}
              name={item.name}
              download={item.download}
              upload={item.upload}
              ping={item.ping}
              timestamp={item.timestamp}
              id={item._id}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Speeds;
