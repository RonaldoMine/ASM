import React from "react";
import {Avatar, Typography} from "antd";
import {GET_ROUTE_WITH_ROLE} from "../../../../global/utils";


const {Title} = Typography;

// Menu of Notifications
export const bellMenu = [
    {
        label: <Title level={4}>Ticket en cours</Title>,
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: <Title level={4}>Ticket résolus</Title>,
        key: '2',
    },
];
// Profile Menu

export const profileMenu = (auth, signOut, navigate) => [
    {
        label: <Title level={5}>Compte</Title>,
        key: '0',
        type: 'group',
    },
    {
        label: (
            <div><Avatar>{auth.username[0].toUpperCase()}</Avatar> <p>{auth.username} <br/><small>{auth.email}</small>
            </p></div>),
        key: '1',
    },
    {
        label: <Title level={4} onClick={() => {
            navigate(`/${GET_ROUTE_WITH_ROLE(auth.role)}/settings/account`, {replace: true});
        }}>Mon compte</Title>,
        key: '2',
    },
    {
        type: 'divider',
    },
    {
        label: <Title level={4} onClick={() => {
            signOut();
            navigate("/login", {replace: true});
        }}>Déconnexion</Title>,
        key: '5'
    },
];
/*
export const NavBarData = [
    {
        key: "notifications",
        icon: <CustomDropdown menuDatas={bellMenu} icon={<BellFilled style={{ fontSize: "22px" }} />}></CustomDropdown>
    },
    {
        key: "avatar",
        icon: <CustomDropdown menuDatas={profileMenu} icon={<Avatar style={{ marginBottom: '8px' }} icon={<UserOutlined />} />}></CustomDropdown>

    },

]*/

