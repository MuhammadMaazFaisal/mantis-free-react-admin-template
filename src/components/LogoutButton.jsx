import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import { logout } from 'store/slices/authSlice';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <ListItemButton onClick={handleLogout}>
      <ListItemIcon>
        <LogoutOutlined />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
};

export default LogoutButton;