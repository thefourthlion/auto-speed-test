import React from "react";
const SpeedCard = ({ Ip, download, upload, ping, name }) => {
  return (
    <div className="SpeedCard">
      <div className="container">
        <h1 className="content-header">{name}</h1>
        <h1 className="content-header">{Ip}</h1>
        <h1 className="content-header">{download} Mbps</h1>
        <h1 className="content-header">{upload} Mbps</h1>
        <h1 className="content-header">{ping} Ms</h1>
      </div>
    </div>
  );
};
export default SpeedCard;
