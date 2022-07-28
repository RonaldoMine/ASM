import React from 'react';
import { SideBarData } from './SideBarData';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
const { Sider } = Layout;

//Get the Sidebar item data and map items
const items2 = SideBarData.map(
    (elmt, index) => {
        const key = index;

        return {
            key: `item${key}`,
            icon: elmt.icon,
            label: elmt.title,
            path: elmt.path,
            //Map Sidebar data sub items
            
            children: elmt.subnav.map((sub, index) => {
                const subKey = `sub${index}${key}`;
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

//Sidebar Component
const SideBar = () => {

    const navigate = useNavigate();
    //const location = useLocation();
    //console.log(location.pathname);

    return (
        <Sider width={200} className="site-layout-background" >
            <Menu
                mode="inline"
                defaultSelectedKeys={['sub00']}
                defaultOpenKeys={['item0']}
                triggerSubMenuAction="click"
                onSelect={e => navigate(e.item.props.path)}
                style={{ height: '100%', borderRight: 0 }}
                items={items2}
            />
        </Sider>
    )
}

export default SideBar