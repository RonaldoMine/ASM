import React from "react";
import {BellFilled, UserOutlined} from '@ant-design/icons';
import {Avatar} from "antd";
import CustomDropdown from "./DropdownAccount/CustomDropdown";
import { Typography } from 'antd';

const { Title } = Typography;
const bellMenu = [
    {
        label: <Title level={5}>Notification appear here</Title>,
        key: '0',
    },
    {
        type: 'divider',
    },
    {
        label: <Title level={5}>AnoterNotification</Title>,
        key: '2',
    },
];
const profileMenu = [
    {
        label: <Title level={5}>ACCOUNT</Title>,
        key: '0',
        type: 'group',
    },
    {
        label: (<div><Avatar>R</Avatar> <p>ronaldo9092 <br/><small>ronaldo@gmail.com</small></p></div> ),
        key: '1',
    },
    {
        label: <Title level={4}>Manage Account</Title>,
        key: '2',
    },
    {
        type: 'divider',
    },
    {
        label: <Title level={5}>UPGRADE</Title>,
        key: '3',
        type: 'group',
    },
    {
        label: <Title level={4}>Try the standard plan</Title>,
        key: '4',
    },
    {
        type: 'divider',
    },
    {
        label: <Title level={4}>Logout</Title>,
        key: '5',
    },
];

export const NavBarData = [
    {
        key: "notifications",
        icon: <CustomDropdown menuDatas={bellMenu} icon={<BellFilled style={{fontSize: "22px"}}/>}></CustomDropdown>
    },
    {
        key: "avatar",
        icon: <CustomDropdown menuDatas={profileMenu} icon={<Avatar style={{marginBottom: '8px'}} icon={<UserOutlined/>}/>}></CustomDropdown>

    },

]