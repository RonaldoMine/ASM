import React from "react";
import { HomeOutlined, ExclamationCircleOutlined, BarsOutlined, InfoOutlined, DashboardOutlined, ContainerOutlined, ReadOutlined, LineChartOutlined, FolderOutlined, SettingOutlined, UserOutlined, ControlOutlined, QuestionOutlined } from '@ant-design/icons';

export const SideBarData = [
    {
        title: 'Général',
        path: 'general',
        icon: <HomeOutlined />,
        subnav: [
            {
                title: 'Tickets',
                path: '/admin/general/tickets',
                icon: <ExclamationCircleOutlined />,
            },
            {
                title: 'Archives',
                path: '/admin/general/archives',
                icon: <FolderOutlined />
            }

        ]
    },
    {
        title: 'Informations',
        path: 'info',
        icon: <InfoOutlined />,
        subnav: [
            {
                title: 'Base de connaissance',
                path: '/admin/info/knowledge_base',
                icon: <ReadOutlined />
            },
            {
                title: 'Suggestions',
                path: '/admin/info/suggestions',
                icon: <ContainerOutlined />
            },
            {
                title: 'Aide',
                path: '/admin/info/help',
                icon: <QuestionOutlined />
            }

        ]
    },
    {
        title: 'Tableau de bord',
        path: 'dashboard',
        icon: <DashboardOutlined />,
        subnav: [
            {
                title: 'Statistiques',
                path: '/admin/dashboard/stats',
                icon: <LineChartOutlined />
            }

        ]
    },
    {
        title: 'Paramètres',
        path: 'settings',
        icon: <SettingOutlined />,
        subnav: [
            {
                title: 'Compte',
                path: '/admin/settings/account',
                icon: <UserOutlined />
            },
            {
                title: 'Administration',
                path: '/admin/settings/agencies',
                icon: <ControlOutlined />
            },
            {
                title: 'Catégories',
                path: '/admin/settings/categories',
                icon: <BarsOutlined />
            }
        ]
    }

]