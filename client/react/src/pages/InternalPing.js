import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";


const InternalPing = () => {
    const [name, setName] = useState("");
    const [link, setLink] = useState("");

    return (
        <div className="InternalPing">
            <div className="container">
                <h1 className="content-header">InternalPing</h1>

                <Form >
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
                            onChange={(e) => setName(e.target.value)}
                        />
                    </FloatingLabel>


                </Form>

            </div>
        </div>
    );
};
export default InternalPing;