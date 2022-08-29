import React from "react";
import {
    BarsOutlined,
    ContainerOutlined,
    ControlOutlined,
    DashboardOutlined,
    ExclamationCircleOutlined,
    FolderOutlined,
    HomeOutlined,
    InfoOutlined,
    LineChartOutlined,
    QuestionOutlined,
    ReadOutlined,
    SettingOutlined,
    UserOutlined
} from '@ant-design/icons';
import {ROLE_ADMIN, ROLE_AGENT, ROLE_SUPER_ADMIN} from "../../../../global/roles";

const dashboardMenu = (role) => {
    if (role !== ROLE_AGENT) {
        return [{
            title: 'Tableau de bord',
            path: 'dashboard',
            icon: <DashboardOutlined/>,
            subnav: [
                {
                    title: 'Statistiques',
                    path: '/admin/dashboard/stats',
                    icon: <LineChartOutlined/>
                }
            ],
        }]
    }
    return [];
};
const settingMenu = (role) => {
    let data = [
        {
            title: 'Mon Compte',
            path: '/admin/settings/account',
            icon: <UserOutlined/>
        }
    ];
    if (role === ROLE_ADMIN || role === ROLE_SUPER_ADMIN){
        data.push(
            {
                title: 'Catégories',
                path: '/admin/settings/categories',
                icon: <BarsOutlined/>
            }
        );
    }
    if (role === ROLE_SUPER_ADMIN) {
        data.push(
            {
                title: 'Administration',
                path: '/admin/settings/agencies',
                icon: <ControlOutlined/>
            }
        )
    }
    return data;
};
export const SideBarData = (auth) => [
    {
        title: 'Général',
        path: 'general',
        icon: <HomeOutlined/>,
        subnav: [
            {
                title: auth.role === ROLE_AGENT ? 'Mes Tickets' : 'Tickets',
                path: '/admin/general/tickets',
                icon: <ExclamationCircleOutlined/>,
            },
            {
                title: auth.role === ROLE_AGENT ? 'Mes Archives' : 'Archives',
                path: '/admin/general/archives',
                icon: <FolderOutlined/>
            }

        ]
    },
    {
        title: 'Informations',
        path: 'info',
        icon: <InfoOutlined/>,
        subnav: [
            {
                title: 'Base de connaissance',
                path: '/admin/info/knowledge_base',
                icon: <ReadOutlined/>
            },
            {
                title: auth.role === ROLE_AGENT ? 'Mes suggestions' : 'Suggestions',
                path: '/admin/info/suggestions',
                icon: <ContainerOutlined/>
            },
            {
                title: 'Aide',
                path: '/admin/info/help',
                icon: <QuestionOutlined/>
            }

        ]
    },
    ...dashboardMenu(auth.role),
    {
        title: 'Paramètres',
        path: 'settings',
        icon: <SettingOutlined/>,
        subnav: settingMenu(auth.role)
    }

]