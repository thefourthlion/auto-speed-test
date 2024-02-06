import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services";
import Button from "react-bootstrap/Button";
import axios from "axios"
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userValidation, setUserValidation] = useState("");

  const [users, setUser] = useState([]);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3025/api/auth/read');
      setUser(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => { getUsers() }, [])

  const handleSignup = async (e) => {
    e.preventDefault();
    // user validation
    if (username === "") {
      setUserValidation("Username required");
    } else if (username.length >= 16) {
      setUserValidation("Username too long");
    } else if (email === "") {
      setUserValidation("Email required");
    } else if (!email.includes("@") || !email.includes(".")) {
      setUserValidation("Email must be valid");
    } else if (password === "") {
      setUserValidation("Password required");
    } else if (password.length < 8) {
      setUserValidation(
        "Password too short (must be greater than 8 characters long)"
      );
    } else if (confirmPassword === "") {
      setUserValidation("Retype Password required");
    } else if (password != confirmPassword) {
      setUserValidation("Passwords required to match");
    } else if (phoneNumber != "") {
      if (!isNumeric(phoneNumber)) {
        setUserValidation("Phone number not valid");
      } else if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        setUserValidation("Phone number not valid");
      }
    }

    // ------------------------------------------ (end of user validation)--------------------------------------
    else {
      try {
        setUserValidation("");
        await AuthService.register(
          username,
          email,
          password,
          phoneNumber,
          profilePic
        ).then(
          (response) => {
            console.log("Registered successfully", response);
            // window.location.reload();
          },
          (error) => {
            console.log(error);
            setUserValidation("Email and Password combination do not match.");
          }
        );
      } catch (err) {
        console.log(err);
        setUserValidation("Error - Try again later.");
      }
    }
  };

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  return (
    <div className="SignUp">
      <div className="card-container">

        <form onSubmit={handleSignup}>
          <h2 className="main-header">Register</h2>
          <FloatingLabel className="form-label" label="Enter username">
            <Form.Control
              className="form-input"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel className="form-label" label="Enter Email">
            <Form.Control
              className="form-input"
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel className="form-label" label="Enter Password">
            <Form.Control
              className="form-input"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel className="form-label" label="Confirm password">
            <Form.Control
              className="form-input"
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel className="form-label" label="Phone Number (optional)">
            <Form.Control
              className="form-input"
              type="text"
              placeholder="Phone Number (optional)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FloatingLabel>
          <h4>{userValidation}</h4>
          <Button className="submit-btn button" variant="primary" type="submit">
            Register
          </Button>
          {/* <span>
          Already have an account? <Link to="/login">Login</Link>
        </span> */}
        </form>
      </div>

      <div className="card-container">
        <h2>Current Users</h2>
        <hr className="hr" />
        {users.map((user, index) => (
          <div>
            <h3 key={index}>{user.username}</h3>
          </div>
        ))}
      </div>

    </div >
  );
};

export default Register;
