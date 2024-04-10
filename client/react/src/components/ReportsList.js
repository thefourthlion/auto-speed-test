import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios"
import trash from "../assets/trash.png"
import Button from 'react-bootstrap/Button';

const ReportsList = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")

    const [emailList, setEmailList] = useState([])
    const postURL = 'http://192.168.0.66:4001/api/reportslist/create';
    const getURL = "http://192.168.0.66:4001/api/reportslist/read";


    const [deleteData, setDeleteData] = useState(false);
    const [deleteWhat, setDeleteWhat] = useState("");
    const [deleteEmail, setDeleteEmail] = useState("")
    const [deleteId, setDeleteId] = useState("")

    let formData = {
        "name": name,
        "email": email,
    }

    const handleSubmit = async () => {
        try {
            const response = await axios.post(postURL, formData);
            console.log('Response:', response.data);
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://192.168.0.66:4001/api/reportslist/delete/${id}`);
            console.log('Response:', response.data);
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getEmailList = () => {
        axios.get(getURL)
            .then((response) => {
                setEmailList(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const refreshPage = () => {
        window.location.reload();
    };


    useEffect(() => {
        getEmailList()
    }, [])


    return (
        <div className="ReportsList">
            <div className="container">

                <div className="card-container">
                    <h1 className="content-header">Add an email</h1>

                    <Form  >
                        <Form.Group >
                            <FloatingLabel className="form-label" label="Name">
                                <Form.Control
                                    className="form-input"
                                    type="text"
                                    autoComplete="true"
                                    placeholder="Name"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FloatingLabel>
                        </Form.Group>


                        <FloatingLabel className="form-label" label="Email">
                            <Form.Control
                                className="form-input"
                                type="email"
                                autoComplete="true"
                                placeholder="Email "
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FloatingLabel>

                        <Button variant="success" onClick={() => { handleSubmit() }} className="sub-btn">Submit</Button>
                    </Form>
                </div>
                {emailList.length > 0 &&
                    <div className="card-container">


                        < h2 > Report Email List</h2>

                        {emailList.map((item, index) => (
                            <div className="clientList" key={index}>
                                <a href={`${item.link}`}><p >{item.name}</p></a>
                                <p className="delete-btn" onClick={() => {
                                    setDeleteData(!deleteData)
                                    setDeleteEmail(item.name)
                                    setDeleteId(item._id)
                                }}>
                                    <img className="trash-logo" src={trash} alt="trash can" />
                                </p>

                            </div>
                        ))}

                        {deleteData && <FloatingLabel className="form-label" label="Users Name">
                            <Form.Control
                                className="form-input"
                                type="text"
                                autoComplete="true"
                                placeholder="Users Name"
                                onChange={(e) => setDeleteWhat(e.target.value)}
                            />
                        </FloatingLabel>}
                        {deleteWhat != "" && deleteWhat == deleteEmail && <Button variant="danger" onClick={() => { handleDelete(deleteId) }}>Delete</Button>}
                    </div>}

            </div>
        </div >
    );
};
export default ReportsList;