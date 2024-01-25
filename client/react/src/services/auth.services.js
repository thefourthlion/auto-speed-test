import axios from "axios";

const signup = (
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    password
) => {
    return axios
        .post("http://localhost:3024/api/auth/register", {
            firstName,
            lastName,
            username,
            email,
            phoneNumber,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const login = (username, password) => {
    return axios
        .post("http://localhost:3024/api/auth/register", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem("user");
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    signup,
    login,
    logout,
    getCurrentUser,
};

export default authService;