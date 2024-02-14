import { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import AuthService from "../services/auth.services.js";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import authService from "../services/auth.services";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [userValidation, setUserValidation] = useState("");
    const auth = authService.getCurrentUser();
    const handleLogin = async (e) => {
        e.preventDefault();
        if (username === "" && password === "") {
            setUserValidation("Username and Password required");
        } else if (password === "") {
            setUserValidation("Password required");
        } else if (username === "") {
            setUserValidation("Username required");
        } else {
            try {
                await AuthService.login(username, password).then(
                    (response) => {
                        console.log("Logged in successfully", response);
                        // window.location.reload();

                    },
                    (error) => {
                        console.log(error);
                        setUserValidation(
                            "Username and Password combination do not match."
                        );
                    }
                );
            } catch (err) {
                console.log(err);
                setUserValidation("Error - Try again later.");
            }
        }
    };

    return (
        <div className="Login">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <FloatingLabel className="form-label" label="Enter Username">
                    <Form.Control
                        className="form-input"
                        type="text"
                        placeholder="Enter Username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                </FloatingLabel>

                <FloatingLabel className="form-label" label="Enter Password ">
                    <Form.Control
                        className="form-input"
                        type="password"
                        placeholder="Enter Password"
                        autoComplete="true"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </FloatingLabel>

                {/* <p>
          <Link to="/forgotPassword">Forgot Password?</Link>
        </p> */}
                <h4>{userValidation}</h4>

                {auth && (
                    <Navigate to="/" />
                )}


                <Button className="submit-btn" variant="success" type="submit">
                    Login
                </Button>

                {/* <span>
                    Don't have an account? <Link to="/register">Register</Link>
                </span> */}
            </form>
        </div>
    );
};

export default Login;
