import React, { useState } from "react";
export default function Navigation() {
    const [showLinks, setShowLinks] = useState(false);
    return (
        <div className="Navbar" id="Navbar">
            <ul
                className="nav nav-links"
                id={showLinks ? "nav-active" : "nav-hidden"}
            >
                <li className="nav-item">
                    <a className="nav-home" href="/">
                        Home
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-bio" href="/Client?id=65b3f33ff31b24d3d5cbe5cc">
                        Clients
                    </a>
                </li>

                <li className="nav-item">
                    <a className="nav-tech" href="./externalping">
                        Ext pings
                    </a>
                </li>


            </ul>
            <h1 className="nav-title">Speed Tests</h1>
            <div className="burger" onClick={() => setShowLinks(!showLinks)}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </div>
    );
}