import React from "react";
const DownloadLink = () => {
    return (
        <div className="DownloadLink">
            <div className="container">
                <a href='../../public/speed-test.zip' download>
                    <button className="download-btn">
                        Download Python Speed Test
                    </button>
                </a>
            </div>
        </div>
    );
};
export default DownloadLink;