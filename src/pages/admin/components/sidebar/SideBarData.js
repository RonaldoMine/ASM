import React from "react";
import {
    BarsOutlined,
    QuestionCircleOutlined,
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
import {GET_ROUTE_WITH_ROLE} from "../../../../global/utils";

const dashboardMenu = (role) => {
    if (role !== ROLE_AGENT) {
        return [{
            title: 'Tableau de bord',
            path: 'dashboard',
            icon: <DashboardOutlined/>,
            subnav: [
                {
                    title: 'Statistiques',
                    path: `/${GET_ROUTE_WITH_ROLE(role)}/dashboard/stats`,
                    icon: <LineChartOutlined/>
                }
            ],
        }]
    }
    return [];
};
const generalMenu = (role) => {
    let menu = [];
    menu.push({
        title: role === ROLE_AGENT ? 'Mes Incidents' : 'Incidents',
        path: `/${GET_ROUTE_WITH_ROLE(role)}/general/incidents`,
        icon: <ExclamationCircleOutlined/>,
    });
    if (role !== ROLE_AGENT) {
        menu.push(
            {
                title: 'Problèmes',
                path: `/${GET_ROUTE_WITH_ROLE(role)}/general/problems`,
                icon: <QuestionCircleOutlined />,
            });
    }
    return menu;
};
const settingMenu = (role) => {
    let data = [
        {
            title: 'Mon Compte',
            path: `/${GET_ROUTE_WITH_ROLE(role)}/settings/account`,
            icon: <UserOutlined/>
        }
    ];
    if (role === ROLE_ADMIN || role === ROLE_SUPER_ADMIN) {
        data.push(
            {
                title: 'Catégories',
                path: `/${GET_ROUTE_WITH_ROLE(role)}/settings/categories`,
                icon: <BarsOutlined/>
            }
        );
    }
    if (role === ROLE_SUPER_ADMIN) {
        data.push(
            {
                title: 'Administration',
                path: `/${GET_ROUTE_WITH_ROLE(role)}/settings/agencies`,
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
            ...generalMenu(auth.role),
            {
                title: auth.role === ROLE_AGENT ? 'Mes Archives' : 'Archives',
                path: `/${GET_ROUTE_WITH_ROLE(auth.role)}/general/archives`,
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
                path: `/${GET_ROUTE_WITH_ROLE(auth.role)}/info/knowledge_base`,
                icon: <ReadOutlined/>
            },
            {
                title: 'Aide',
                path: `/${GET_ROUTE_WITH_ROLE(auth.role)}/info/help`,
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