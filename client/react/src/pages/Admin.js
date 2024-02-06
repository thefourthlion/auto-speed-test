import React, { useState, useEffect } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ExternalPing from "./ExternalPing";
import ClientList from "../components/ClientList";
import Packages from "../components/Packages";
import Groups from "../components/Groups";
import SignUp from "./SignUp";

import AuthService from "../services/auth.services";






const Admin = () => {
    const [showExternalPings, setShowExternalPings] = useState(false);
    const [showClients, setShowClients] = useState(false);
    const [showPackages, setShowPackages] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showEmails, setShowEmails] = useState(false);
    const [showGroups, setShowGroups] = useState(false);
    const [currentUser, setCurrentUser] = useState("")

    useEffect(() => {
        const user = AuthService.getCurrentUser()

        if (user) {
            setCurrentUser(user.username)
        }
    }, [])

    return (

        <div className="Admin page">

            <h1>Signed in as : {currentUser}</h1>


            <div className="container">

                <div className="form-container">
                    <h1 className="form-header pings-header"
                        onClick={() => {
                            setShowExternalPings(!showExternalPings)
                            setShowClients(false)
                            setShowPackages(false)
                            setShowGroups(false)
                            setShowSignUp(false)
                        }}>External Pings</h1>
                    {showExternalPings && <ExternalPing />}
                </div>

                <div className="form-container">
                    <h1 className="form-header clients-header"
                        onClick={() => {
                            setShowClients(!showClients)
                            setShowExternalPings(false)
                            setShowPackages(false)
                            setShowGroups(false)
                            setShowSignUp(false)
                        }}>Edit Clients</h1>
                    {showClients && <div className="card-container"><ClientList /></div>}
                </div>

                <div className="form-container">
                    <h1 className="form-header packages-header"
                        onClick={() => {
                            setShowPackages(!showPackages)
                            setShowClients(false)
                            setShowExternalPings(false)
                            setShowGroups(false)
                            setShowSignUp(false)

                        }}>Edit Packages</h1>
                    {showPackages && <Packages />}
                </div>

                <div className="form-container">
                    <h1 className="form-header groups-header"
                        onClick={() => {
                            setShowGroups(!showGroups)
                            setShowPackages(false)
                            setShowSignUp(false)
                            setShowClients(false)
                            setShowExternalPings(false)
                        }}>Edit Groups</h1>
                    {showGroups && <Groups />}
                </div>

                <div className="form-container">
                    <h1 className="form-header user-header"
                        onClick={() => {
                            setShowSignUp(!showSignUp)
                            setShowGroups(false)
                            setShowPackages(false)
                            setShowClients(false)
                            setShowExternalPings(false)

                        }}>Edit Users</h1>
                    {showSignUp && <SignUp />}
                </div>

            </div>

        </div>
    );
};
export default Admin;