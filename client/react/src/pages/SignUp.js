import React, { useState } from "react";
import { Form, Alert } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = ()=>{
    alert("submitted");
  }

  return (
    <div className="SignUp">
        <div className="container">
      <h2>Sign Up</h2>

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
        
        <Form.Group controlId="formBasicPassword">
          <FloatingLabel className="form-label" label="Confirm password ">
            <Form.Control
              className="form-input"
              type="password"
              autoComplete="true"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>

       <button className=""> <a href="http://localhost:3000/">Log In</a></button>

        <p>Already have an account <a href="/Login">Login</a></p>
      </Form>
      </div>
    </div>
  );
};

export default SignUp;