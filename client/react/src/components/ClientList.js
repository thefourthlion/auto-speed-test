import React, { useState, useEffect } from "react";
import ExternalPingData from "../pages/ExternalPingData";
import trash from "../assets/trash.png"
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios"

const ClientList = () => {
    const [speeds, setSpeeds] = useState([])

    const [editClientList, setEditClientList] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [deleteClient, setDeleteClient] = useState("")
    const [deleteId, setDeleteId] = useState("")

    const refreshPage = () => {
        window.location.reload();
    };

    const getData = () => {
        fetch("https://api.speeds.everettdeleon.com/api/speeds/read")
            .then((res) => res.json())
            .then((data) => {
                setSpeeds(data);
                console.log(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3025/api/speeds/delete/${id}`);
            console.log('Response:', response.data);
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="ClientList">
            <div className="container">
                <div className="clientListContainer">
                    <h3 >Client List</h3>

                    {speeds.map((item, index) => (
                        <div className="clientList" key={index}>
                            <a href={`client?id=${item._id}`}>
                                <p >{item.Ip}</p>
                            </a>
                            <p className="editClient" onClick={() => {
                                setEditClientList(!editClientList)
                                setDeleteId(item._id)
                                setDeleteClient(item.Ip)
                            }}>
                                <img className="trash-logo" src={trash} alt="trash can" />
                            </p>
                        </div>
                    ))}

                    {editClientList && <FloatingLabel className="form-label" label="client name ">
                        <Form.Control
                            className="form-input"
                            type="text"
                            autoComplete="true"
                            placeholder="client name"
                            onChange={(e) => setDeleteWhat(e.target.value)}
                        />
                    </FloatingLabel>}
                    {deleteWhat != "" && deleteWhat == deleteClient && <button onClick={() => { handleDelete(deleteId) }}>Delete</button>}
                </div>
            </div>
        </div>
    );
};
export default ClientList;