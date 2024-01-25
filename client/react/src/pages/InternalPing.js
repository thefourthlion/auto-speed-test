import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import axios from "axios"

const InternalPing = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    const sendForm = ()=>{
        axios.post()
    }


    return (
        <div className="InternalPing">
            <div className="container">
                <h1 className="content-header">InternalPing</h1>

                <Form onSubmit={sendForm} >
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

                    <button className="sub-btn">Submit</button>


                </Form>

            </div>
        </div>
    );
};
export default InternalPing;