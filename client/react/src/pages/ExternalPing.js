import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios"
import ExternalPingData from "./ExternalPingData";

const ExternalPing = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    const [externalPings, setExternalPings] = useState([])
    const postURL = 'http://localhost:3024/api/externalping/create';
    const getURL = "http://localhost:3024/api/externalping/read";

    let timestamp = "123"

    let formData = {
        "link": link,
        "name": name,
        "timestamp": timestamp,
    }

    const handleSubmit = async () => {
       
        try {
            const response = await axios.post(postURL, formData);
            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3024/api/externalping/delete/${id}`, formData);
            console.log('Response:', response.data);
            refreshPage()
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getSpeeds = () => {
        axios.get(getURL)
            .then((response) => {
                setExternalPings(response.data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const refreshPage = () => {
        window.location.reload();
      };
    

    useEffect(() => {
        getSpeeds()
    }, [])

    return (
        <div className="ExternalPing">
            <div className="container">
                <ExternalPingData/>

                <h2>Add ping site</h2>
                <Form  >
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

                    <button onClick={()=>{handleSubmit()}}className="sub-btn">Submit</button>
                </Form>

                <h3>list of pings</h3>
                {externalPings.map((item, index) => (
                    <div className="clientList" key={index}>
                       <a href={`${item.link}`}><p >{item.name}</p></a>
                       <p className="delete-btn" onClick={()=>{
                        handleDelete(item._id)
                       }}>🚫</p>
                    </div>
                ))}

               

            </div>
        </div>
    );
};
export default ExternalPing;