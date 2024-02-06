import React, { useState, useEffect } from "react";
import { Form, Alert, Button } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import trash from "../assets/trash.png"

import axios from "axios"
const Groups = () => {

    const [groups, setGroups] = useState([]);

    const [groupName, setGroupName] = useState("")

    const data = {
        name: groupName
    }

    const getData = async () => {
        try {
            const response = await axios.get('http://localhost:3025/api/Groups/read');
            setGroups(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3025/api/Groups/create', data);
            console.log(response.data)
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const deleteItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3025/api/Groups/delete/${id}`);
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
        <div className="Groups">
            <div className="container">
                <div className="card-container">
                    <h2>Add a Group</h2>
                    <Form  >
                        <Form.Group >
                            <FloatingLabel className="form-label" label="Group Name">
                                <Form.Control
                                    className="form-input"
                                    type="text"
                                    autoComplete="true"
                                    placeholder="Group Name"
                                    onChange={(e) => setGroupName(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>

                        <Button onClick={() => { handleSubmit() }} className="sub-btn button">Submit</Button>
                    </Form>
                </div>
                <div className="card-container"> 

                {groups.length > 0 &&
                    <div>
                        <h2>Current Groups</h2>
                        {groups.map((item, index) => (
                            <p >{item.name} <img className="trash-logo" src={trash} onClick={() => { deleteItem(item._id) }} /></p>
                        ))}
                    </div>
                }
            </div>
        </div>
        </div >
    );
};
export default Groups;