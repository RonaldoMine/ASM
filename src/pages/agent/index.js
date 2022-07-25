import React from 'react'
import './index.css'
import { Breadcrumb, Layout } from 'antd';
import NavBar from './components/navbar/NavBar';
import SideBar from './components/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;


function Agent() {
    return (
        <Layout className='main'>

            {/*Header */}
            <NavBar />

            {/* Left side */}
            <Layout>
                <SideBar />

                {/*Main section */}
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '16px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            overflowY: "auto"
                        }}
                    >

                        <Outlet/>
                    </Content>
                </Layout>

            </Layout>

        </Layout>
    )
}

export default Agent