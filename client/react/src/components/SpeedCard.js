import React, { useState } from "react";
import Card from "react-bootstrap/Card";

import axios from "axios";
const SpeedCard = ({ Ip, download, upload, ping, timestamp, name, id }) => {
  const [changeName, setChangeName] = useState(false);
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3025/api/speeds/delete/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="SpeedCard">
      <div className="container">
        <div className="card-container">
          <h1 className="card-header">{name}</h1>
          <p className="card-info">{Ip}</p>
          <p className="card-info">{timestamp}</p>
          <p className="card-info">{download} Mbps</p>
          <p className="card-info">{upload} Mbps</p>
          <p className="card-info">{ping} Ms</p>
          <a
            className="delete-btn"
            onClick={() => {
              deleteItem(id);
            }}
          >
            Delete
          </a>

          <a
            className="edit-btn"
            onClick={() => {
              setChangeName(!changeName);
            }}
          >
            Edit Name
          </a>
        </div>
      </div>
    </div>
  );
};
export default SpeedCard;
