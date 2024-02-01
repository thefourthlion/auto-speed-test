import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from 'react-bootstrap/Button';

const Register = ({ history }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const registerHandler = async (e) => {
    e.preventDefault();

    const config = {
      header: {
        "Content-Type": "application/json",
      },
    };

    if (password !== confirmPassword) {
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setError("");
      }, 5000);
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axios.post(
        "http://localhost:3025/api/auth/register",
        {
          username,
          email,
          password,
        },
        config
      );

      localStorage.setItem("authToken", data.token);

      history.push("/");
    } catch (error) {
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="SignUp">
      <form onSubmit={registerHandler}>
        <h1>Register User</h1>
        {error && <span>{error}</span>}
        <FloatingLabel className="form-label" label="Enter username">
          <Form.Control
            className="form-input"
            type="text"
            required
            id="name"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel className="form-label" label="Enter Email">
          <Form.Control
            className="form-input"
            type="email"
            required
            id="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel className="form-label" label="Enter Password">
          <Form.Control
            className="form-input"
            type="password"
            required
            id="password"
            autoComplete="true"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel className="form-label" label="Confirm password">
          <Form.Control
            className="form-input"
            type="password"
            required
            id="confirmPassword"
            autoComplete="true"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </FloatingLabel>

        <Button type="submit">Register</Button>
        {/* <span>
          Already have an account? <Link to="/login">Login</Link>
        </span> */}
      </form>
    </div>
  );
};

export default Register;