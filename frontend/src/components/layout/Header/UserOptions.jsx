import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material'
import React, { useEffect, useState } from 'react'
import "./Header.css"
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { logout } from '../../../features/User/userSlice';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { showAlert } from '../../../features/alertSlice';
import { v4 as uuidv4 } from 'uuid';

const UserOptions = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600)
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const actions = [
        { icon: <ListAltIcon />, name: "Orders", path: "/orders" },
        { icon: <PersonIcon />, name: "Profile", path: "/account" },
        { icon: <ExitToAppIcon />, name: "Logout", path: "/login", isLogout: true }
    ]

    // Handle actions
    const handleAction = (action) => {
        if (action.isLogout) {
            dispatch(logout())
            dispatch(showAlert({
                id: uuidv4(),
                type: "success",
                message: "User Logged out Successfully"
            }))
        }
        navigate(action.path)
    }

    if (user?.role === "admin") {
        actions.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            path: "/admin/dashboard"
        })
    }

    return (
        <>
            <div className='speedDial'>
                <SpeedDial
                    direction='down'
                    ariaLabel='Basic SpeedDail'
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    sx={{
                        "& .MuiSpeedDial-fab": {
                          width: 30,
                          height: 30,
                          minHeight: 30,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      }}
                    icon={
                        <img
                            className='speedDialIcon'
                            src={user.avatar.url ? user.avatar.url : "/profile.png"}
                            alt='profile'
                        />
                    }
                >
                    {
                        actions.map((action) => (
                            <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                onClick={() => handleAction(action)}
                                tooltipOpen={isMobile}
                            />
                        ))
                    }
                </SpeedDial>
            </div>
        </>
    )
}

export default UserOptions