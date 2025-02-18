import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  if (currentUser) {
    return <Outlet />;
  } else {
    window.alert('You have to be logged in to view this content!');
    return <Navigate to="/signin" />;
  }
}

export default PrivateRoute;
