import React from 'react';
import {SideBarData} from './SideBarData';
import {Layout, Menu} from 'antd';
import {useLocation, useNavigate} from 'react-router-dom';
import useAuth from "../../../../auth/hook/useAuth";

const {Sider} = Layout;

//Sidebar Component
const SideBar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const {auth} = useAuth();
    const pathname = location.pathname;
    const menuParent = pathname.split('/')[2];
    const menuChild = pathname.split('/')[3];
//Get the Sidebar item data and map items
    const items2 = SideBarData(auth).map(
        (elmt, index) => {
            return {
                key: `${elmt.path}`,
                icon: elmt.icon,
                label: elmt.title,
                path: elmt.path,
                //Map Sidebar data sub items

                children: elmt.subnav.map((sub, index) => {
                    const subKey = `${elmt.path}_sub${sub.path.split('/')[3]}`;
                    return {
                        key: subKey,
                        icon: sub.icon,
                        label: sub.title,
                        path: sub.path
                    };
                }),
            };
        },
    );

    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={[menuParent+'_sub' + menuChild]}
                defaultOpenKeys={[menuParent]}
                triggerSubMenuAction="click"
                onSelect={e => navigate(e.item.props.path)}
                style={{height: '100%', borderRight: 0}}
                items={items2}
            />
        </Sider>
    )
}

export default SideBar