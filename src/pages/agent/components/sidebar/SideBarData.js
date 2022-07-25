import React from "react";
import { HomeOutlined, ExclamationCircleOutlined, InfoOutlined, ContainerOutlined, ReadOutlined, SettingOutlined, UserOutlined, QuestionOutlined } from '@ant-design/icons';

export const SideBarData = [
    {
        title: 'Général',
        path: '/general',
        icon: <HomeOutlined />,
        subnav: [
            {
                title: 'Mes Tickets',
                path: '/agent',
                icon: <ExclamationCircleOutlined />,
            }

        ]
    },
    {
        title: 'Informations',
        path: '/agent/info',
        icon: <InfoOutlined />,
        subnav: [
            {
                title: 'Base de connaissances',
                path: '/agent/info/knowledge_base',
                icon: <ReadOutlined />
            },
            {
                title: 'Suggestions',
                path: '/agent/info/knowledge_base/suggestions',
                icon: <ContainerOutlined />
            },
            {
                title: 'Aide',
                path: '/agent/info/help',
                icon: <QuestionOutlined />
            }

        ]
    },
    {
        title: 'Paramètres',
        path: '/agent/settings',
        icon: <SettingOutlined />,
        subnav: [
            {
                title: 'Compte',
                path: '/agent/settings/account',
                icon: <UserOutlined />
            }
        ]
    }

]