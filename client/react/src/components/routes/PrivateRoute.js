import { Navigate, Outlet } from "react-router-dom";
import authService from "../../services/auth.services";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const auth = authService.getCurrentUser();
  {auth && console.log({ "user": auth.username })}
  return auth ? <Outlet /> : <Navigate to="/login" />
};

export default PrivateRoute;