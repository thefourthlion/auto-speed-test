import React, { useState, useEffect } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ExternalPing from "./ExternalPing";
import ClientList from "../components/ClientList";
import Packages from "../components/Packages";
import Groups from "../components/Groups";
import SignUp from "./SignUp";

const Admin = () => {
    const [showExternalPings, setShowExternalPings] = useState(false);
    const [showClients, setShowClients] = useState(false);
    const [showPackages, setShowPackages] = useState(false);
    const [showSignUp, setShowSignUp] = useState(false);
    const [showEmails, setShowEmails] = useState(false);
    const [showGroups, setShowGroups] = useState(false);
    return (
        <div className="Admin page">
            <div className="container">

                <div className="form-container">
                    <h1 className="form-header pings-header" 
                    onClick={()=>{
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
                    onClick={()=>{
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
                    onClick={()=>{
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
                    onClick={()=>{
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
                    onClick={()=>{
                        setShowSignUp(!showSignUp)
                        setShowGroups(false)
                        setShowPackages(false)
                        setShowClients(false)
                        setShowExternalPings(false)

                        }}>Edit Users</h1>
                    {showSignUp && <SignUp />}
                </div>



                

                {/* <Form  >
                    <Form.Group >
                        <FloatingLabel className="form-label" label="Website Name ">
                            <Form.Control
                                className="form-input"
                                type="text"
                                autoComplete="true"
                                placeholder="Website Name "
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FloatingLabel>
                    </Form.Group>


                    <FloatingLabel className="form-label" label="Website Link ">
                        <Form.Control
                            className="form-input"
                            type="text"
                            autoComplete="true"
                            placeholder="Website Link "
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </FloatingLabel>

                    <Button onClick={() => { handleSubmit() }} className="sub-btn">Submit</Button>
                </Form> */}


            </div>
        </div>
    );
};
export default Admin;