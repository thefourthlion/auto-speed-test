import React, { useState, useEffect } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import ExternalPing from "./ExternalPing";
import ClientList from "../components/ClientList";
import Packages from "../components/Packages";
import Groups from "../components/Groups";
const Admin = () => {
    const [showExternalPings, setShowExternalPings] = useState(false);
    const [showClients, setShowClients] = useState(false);
    const [showPackages, setShowPackages] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const [showEmails, setShowEmails] = useState(false);
    const [showGroups, setShowGroups] = useState(false);
    return (
        <div className="Admin page">
            <div className="container">

                <div className="form-container">
                    <h1 className="form-header pings-header" onClick={()=>{setShowExternalPings(!showExternalPings)}}>External Pings</h1>
                    {showExternalPings && <ExternalPing />}
                </div>

                <div className="form-container">
                    <h1 className="form-header clients-header" onClick={()=>{setShowClients(!showClients)}}>Edit Clients</h1>
                    {showClients && <ClientList />}
                </div>

                <div className="form-container">
                    <h1 className="form-header packages-header" onClick={()=>{setShowPackages(!showPackages)}}>Set Packages</h1>
                    {showPackages && <Packages />}
                </div>

                <div className="form-container">
                    <h1 className="form-header packages-header" onClick={()=>{setShowGroups(!showGroups)}}>Set Groups</h1>
                    {showGroups && <Groups />}
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