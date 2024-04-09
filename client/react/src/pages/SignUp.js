import { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services";
import Button from "react-bootstrap/Button";
import axios from "axios"
import trash from "../assets/trash.png"


const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userValidation, setUserValidation] = useState("");

  const permissions = "";
  const profilePic = "";

  const [users, setUser] = useState([]);

  const [deleteUser, setDeleteUser] = useState(false);
  const [deleteWho, setDeleteWho] = useState("");
  const [userToDelete, setUserToDelete] = useState("");
  const [userId, setUserId] = useState("");

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3025/api/auth/read');
      setUser(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  const deleteUsers = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3025/api/auth/delete/${id}`);
      console.log(response.data)
      refreshPage()
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  }

  const refreshPage = () => {
    window.location.reload();
  };

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
    } else if (password !== confirmPassword) {
      setUserValidation("Passwords required to match");
    } else if (phoneNumber !== "") {
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
          permissions,
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
          <h2 className="main-header">Register User</h2>
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

          {/* <Dropdown>
            <Dropdown.Toggle variant="danger" id="dropdown-basic">
              User Permissions
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className="dropdown-item" onClick={() => { setPermissions("Admin") }}>Admin</Dropdown.Item>
              <Dropdown.Item className="dropdown-item" onClick={() => { setPermissions("Not Admin") }}>Not Admin</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown> */}

          {/* <h4>{permissions}</h4> */}

          <h4>{userValidation}</h4>
          <Button className="submit-btn button" variant="success" type="submit">
            Register
          </Button>
          {/* <span>
          Already have an account? <Link to="/login">Login</Link>
        </span> */}
        </form>
      </div>

      {users.length > 0 &&
        <div className="card-container">
          <h2>Current Users</h2>
          {users.map((user, index) => (
            <div className="users-container">
              <h3 key={index}>{user.username}</h3>
              <img src={trash} alt="delete-icon " className="trash-logo"
                onClick={() => {
                  setDeleteUser(!deleteUser);
                  setUserToDelete(user.username);
                  setUserId(user._id);
                }}
              />
            </div>
          ))}

          {deleteUser &&
            <FloatingLabel className="form-label" label="Enter username to delete">
              <Form.Control
                className="form-input"
                type="text"
                placeholder="Enter username to delete"
                onChange={(e) => setDeleteWho(e.target.value)}
              />
            </FloatingLabel>

          }

          {deleteWho !== "" && deleteWho === userToDelete &&
            <Button variant="danger button submit-btn"
              onClick={() => { deleteUsers(userId) }}
            >Delete</Button>
          }
        </div>
      }



    </div >
  );
};

export default Register;
