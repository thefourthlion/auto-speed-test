import React, { useState, useEffect } from "react";
import ExternalPingData from "../pages/ExternalPingData";
import trash from "../assets/trash.png"
import pkg from "../assets/pkg.png"
import group from "../assets/group.png"
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios"
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

const ClientList = () => {
    const [speeds, setSpeeds] = useState([])

    const [editClientList, setEditClientList] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [deleteClient, setDeleteClient] = useState("")
    const [deleteId, setDeleteId] = useState("")

    const [editPackage, setEditPackage] = useState(false);
    const [editGroup, setEditGroup] = useState(false);
    const [groups, setGroups] = useState([])
    const [chosenGroup, setChosenGroup] = useState("")

    const [packages, setpackages] = useState([])
    const [chosenSpeed, setChosenSpeed] = useState("")
    const [editId, setEditId] = useState("")

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

    const getpackageData = () => {
        fetch("http://localhost:3025/api/packages/read")
            .then((res) => res.json())
            .then((data) => {
                setpackages(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const getGroupData = () => {
        fetch("http://localhost:3025/api/groups/read")
            .then((res) => res.json())
            .then((data) => {
                setGroups(data);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    };

    const updateClientpackage = async (id) => {
        try {
            const response = await axios.post(`http://localhost:3025/api/speeds/update/${id}`, { package: chosenSpeed });
            console.log(response.data)
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const updateClientGroup = async (id) => {
        try {
            const response = await axios.post(`http://localhost:3025/api/speeds/update/${id}`, { group: chosenGroup });
            console.log(response.data)
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
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
        getpackageData()
        getGroupData()
    }, []);

    return (
        <div className="ClientList">
            <div className="container">
                <div className="clientListContainer">
                    <h2 >Client List</h2>

                    {speeds.map((item, index) => (
                        <div className="clientList" key={index}>
                            <a href={`client?id=${item._id}`}>
                                <h4>{item.Ip}</h4>
                            </a>

                            <img className="trash-logo" src={trash} alt="delete-icon" onClick={() => {
                                setEditClientList(!editClientList)
                                setDeleteId(item._id)
                                setDeleteClient(item.Ip)
                            }} />

                            <img className="pkg-logo" src={pkg} alt="package-icon" onClick={() => {
                                setEditPackage(!editPackage);
                                setEditId(item._id);
                            }} />

                            <img className="group-logo" src={group} alt="group-icon" onClick={() => {
                                setEditGroup(!editGroup);
                                setEditId(item._id);
                            }} />

                        </div>
                    ))}

                    {editPackage && <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            Packages
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {packages.map((item, index) => (
                                <div>
                                    <Dropdown.Item onClick={() => { setChosenSpeed(`${item.download} x ${item.upload}`); }}>{item.download}Mbps x {item.upload}Mbps</Dropdown.Item>

                                </div>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>}

                    {editGroup && <Dropdown>
                        <Dropdown.Toggle id="dropdown-basic">
                            Groups
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {groups.map((item, index) => (
                                <div>
                                    <Dropdown.Item onClick={() => { setChosenGroup(`${item.name}`); }}>{item.name}</Dropdown.Item>

                                </div>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>}

                    {chosenSpeed && <Button className="update-btn" onClick={() => { updateClientpackage(editId) }}>Submit</Button>}

                    {chosenGroup && <Button className="update-btn" onClick={() => { updateClientGroup(editId) }}>Submit</Button>}



                    {editClientList && <FloatingLabel className="form-label" label="client name ">
                        <Form.Control
                            className="form-input"
                            type="text"
                            autoComplete="true"
                            placeholder="client name"
                            onChange={(e) => setDeleteWhat(e.target.value)}
                        />
                    </FloatingLabel>}

                    {deleteWhat != "" && deleteWhat == deleteClient && <Button variant="danger" onClick={() => { handleDelete(deleteId) }}>Delete</Button>}
                </div>
            </div>
        </div>
    );
};
export default ClientList;