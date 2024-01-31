import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const Login = ({ history }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history]);

    const loginHandler = async (e) => {
        e.preventDefault();

        const config = {
            header: {
                "Content-Type": "application/json",
            },
        };

        try {
            const { data } = await axios.post(
                "http://localhost:3025/api/auth/login",
                { email, password },
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
        <div className="Login page">
            <form onSubmit={loginHandler}>
                <h1>Login</h1>
                {error && <span>{error}</span>}
                <FloatingLabel className="form-label" label="Enter Email">
                    <Form.Control
                        className="form-input"
                        type="email"
                        placeholder="Enter Email"
                        autoComplete="true"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
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
                    <Link to="/forgotpassword">Forgot Password?</Link>
                </p> */}

                <button type="submit">Login</button>

                {/* <span>
                    Don't have an account? <Link to="/register">Register</Link>
                </span> */}
            </form>
        </div>
    );
};

export default Login;