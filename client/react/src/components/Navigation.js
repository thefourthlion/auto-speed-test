import React, { useState } from "react";
import Button from 'react-bootstrap/Button';
import AuthService from "../services/auth.service";

export default function Navigation() {
    const [showLinks, setShowLinks] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    useEffect(() => {
        const user = AuthService.getCurrentUser();

        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const logOut = () => {
        AuthService.logout();
        window.location.reload();
    };

    const logoutBtn = currentUser ? (
        <button className="nav-btn" onClick={logOut}>
            Logout
        </button>
    ) : (
        <a href="http://localhost:3000/login">
            <button className="nav-btn">Sign In</button>
        </a>
    );

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
                    <a className="nav-bio" href="/Clients">
                        Clients
                    </a>
                </li>

                {/* <li className="nav-item">
                    <a className="nav-tech" href="./externalping">
                        Ext pings
                    </a>
                </li> */}

                <li className="nav-item">
                    <a className="nav-tech" href="/Admin">
                        Admin
                    </a>
                </li>

                <li >
                    <a href="login">

                        <Button variant="primary" className="button" >
                            Sign In
                        </Button>
                    </a>

                    <li>{logoutBtn}</li>

                </li>




            </ul>
            <h1 className="nav-title">Speed Tests</h1>
            <div className="burger" onClick={() => setShowLinks(!showLinks)}>
                <div className="line1"></div>
                <div className="line2"></div>
                <div className="line3"></div>
            </div>
        </div >
    );
}