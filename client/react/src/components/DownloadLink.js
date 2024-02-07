import React from "react";
import Button from 'react-bootstrap/Button';

const DownloadLink = () => {
    return (
        <div className="DownloadLink">
            <div className="container">
                <a href='../../public/speed-test.zip' download>
                    <Button variant="success" className="download-btn">
                        Download Python Speed Test
                    </Button>
                </a>
            </div>
        </div>
    );
};
export default DownloadLink;

