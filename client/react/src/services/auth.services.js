import axios from "axios";

const refreshPage = () => {
    window.location.reload();
};

const register = (username, email, password, phoneNumber, profilePic) => {
    return axios
        .post("http://localhost:3025/api/auth/register", {
            username,
            email,
            phoneNumber,
            password,
            profilePic,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                // alert(response.data.username);
                refreshPage();
            }

            return response.data;
        });
};


const login = (username, password) => {
    return axios
        .post("http://localhost:3025/api/auth/login", {
            username,
            password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
                // alert(response.data.username);
                refreshPage();
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
    register,
    login,
    logout,
    getCurrentUser,
};

export default authService;
