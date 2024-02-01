import React, { useState, useEffect } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import trash from "../assets/trash.png"

import axios from "axios"
const Packages = () => {
    const [speed, setSpeed] = useState("");
    const [packages, setPackages] = useState([]);

    const data = {
        Speeds: speed
    }

    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:3025/api/packages/read');
            setPackages(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3025/api/packages/create', data);
            console.log(response.data)
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3025/api/packages/delete/${id}`);
            console.log(response.data)
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const refreshPage = () => {
        window.location.reload();
    };


    useEffect(() => { getData() }, [])

    return (
        <div className="Packages">
            <div className="container">

                <Form  >
                    <Form.Group >
                        <FloatingLabel className="form-label" label="Package Speed (Mbps)">
                            <Form.Control
                                className="form-input"
                                type="text"
                                autoComplete="true"
                                placeholder="Package Speed (Mbps)"
                                onChange={(e) => setSpeed(e.target.value)}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Button onClick={() => { handleSubmit() }} className="sub-btn button">Submit</Button>
                </Form>

                {packages.length > 0 &&
                    <div>
                        <h2>Current Packages</h2>
                        {packages.map((item, index) => (
                            <p >{item.Speeds} Mbps <img className="trash-logo" src={trash} onClick={() => { deleteItem(item._id) }}/></p>
                        ))}
                    </div>
                }
            </div>
        </div>
    );
};
export default Packages;