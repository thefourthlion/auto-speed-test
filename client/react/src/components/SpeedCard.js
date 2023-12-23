import React, { useState } from "react";
import axios from "axios";
const SpeedCard = ({ Ip, download, upload, ping, timestamp, name, id }) => {
  const [changeName, setChangeName] = useState(false);
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/speeds/delete/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="SpeedCard">
      <div className="container">
        <h1 className="content-header">{name}</h1>
        <h1 className="content-header">{Ip}</h1>
        <h1 className="content-header">{timestamp}</h1>
        <h1 className="content-header">{download} Mbps</h1>
        <h1 className="content-header">{upload} Mbps</h1>
        <h1 className="content-header">{ping} Ms</h1>
        <button
          onClick={() => {
            deleteItem(id);
          }}
        >
          Delete
        </button>

        <button
          onClick={() => {
            setChangeName(!changeName);
          }}
        >
          Edit Name
        </button>

      </div>
    </div>
  );
};
export default SpeedCard;
