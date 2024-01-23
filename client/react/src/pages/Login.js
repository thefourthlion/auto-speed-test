import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        alert("submitted");
    }

    return (
        <div className="Login ">
            <div className="container">
                <h2>Log In</h2>

                <Form >
                    <Form.Group controlId="formBasicEmail">
                        <FloatingLabel className="form-label" label="Email ">
                            <Form.Control
                                className="form-input"
                                type="email"
                                autoComplete="true"
                                placeholder="Email "
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <FloatingLabel className="form-label" label="Password ">
                            <Form.Control
                                className="form-input"
                                type="password"
                                autoComplete="true"
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FloatingLabel>
                    </Form.Group>

                    <button ><a href="http://localhost:3000/">Log In</a></button>

                    <p>Don't have an account <a href="/SignUp">Sign Up</a></p>
                </Form>
            </div>
        </div>
    );
};

export default Login;