import {Column, Pie} from '@ant-design/plots';
import {Card, Col, DatePicker, PageHeader, Row, Select, Statistic} from "antd";
import Moment from "moment";
import 'moment/locale/fr';
import React from "react";
import useAuth from "../../../../auth/hook/useAuth";
import axios from "axios";
import {API_URL, API_USER_URL} from "../../../../global/axios";
import {useQuery} from "react-query";
import locale from 'antd/es/date-picker/locale/fr_FR';
import './CustomStatistic.css';

function CustomStatistic() {
    // Hooks
    let {auth} = useAuth();
    //Functions
    //List Agency
    const fetchAgency = () => {
        return axios.get(API_USER_URL+"users/agencies")
    }
    const onChangeDate = (value) => {
        const [to, from] = value;
        console.log(Moment(to).format("YYYY-MM-DD"))
        console.log(Moment(from).format("YYYY-MM-DD"))
        console.log(Moment(Moment.now()).format("YYYY-MM-DD"))
    }
    const {data: agencies} = useQuery("agencieslist", fetchAgency)
    const dataPie = [
        {
            type: 'Nouveau',
            value: 27,
        },
        {
            type: 'Résolu',
            value: 25,
        },
        {
            type: 'En cours',
            value: 18,
        },
        {
            type: 'Assigné',
            value: 15,
        },
        {
            type: 'Fermé',
            value: 10,
        },
    ];
    const config = {
        appendPadding: 10,
        data: dataPie,
        angleField: 'value',
        colorField: 'type',
        radius: 0.75,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{percentage}',
        },
        interactions: [
            {
                type: 'element-selected',
            },
            {
                type: 'element-active',
            },
        ],
    };

    const dataColumn = [
        {
            name: 'Ouvert',
            month: 'Jan.',
            value: 30,
        },
        {
            name: 'Ouvert',
            month: 'Feb.',
            value: 10,
        },
        {
            name: 'Ouvert',
            month: 'Mar.',
            value: 24,
        },
        {
            name: 'Ouvert',
            month: 'Apr.',
            value: 5,
        },
        {
            name: 'Ouvert',
            month: 'May',
            value: 47,
        },
        {
            name: 'Ouvert',
            month: 'Jun.',
            value: 20,
        },
        {
            name: 'Ouvert',
            month: 'Jul.',
            value: 24,
        },
        {
            name: 'Ouvert',
            month: 'Aug.',
            value: 42,
        },
        {
            name: 'Résolu',
            month: 'Jan.',
            value: 12,
        },
        {
            name: 'Résolu',
            month: 'Feb.',
            value: 10,
        },
        {
            name: 'Résolu',
            month: 'Mar.',
            value: 5,
        },
        {
            name: 'Résolu',
            month: 'Apr.',
            value: 20,
        },
        {
            name: 'Résolu',
            month: 'May',
            value: 6,
        },
        {
            name: 'Résolu',
            month: 'Jun.',
            value: 15,
        },
        {
            name: 'Résolu',
            month: 'Jul.',
            value: 14,
        },
        {
            name: 'Résolu',
            month: 'Aug.',
            value: 35,
        },
    ];
    const configColumn = {
        data: dataColumn,
        isGroup: true,
        xField: 'month',
        yField: 'value',
        seriesField: 'name',

        /** 设置颜色 */
        //color: ['#1ca9e6', '#f88c24'],

        /** 设置间距 */
        // marginRatio: 0.1,
        label: {
            // 可手动配置 label 数据标签位置
            position: 'middle',
            // 'top', 'middle', 'bottom'
            // 可配置附加的布局方法
            layout: [
                // 柱形图数据标签位置自动调整
                {
                    type: 'interval-adjust-position',
                }, // 数据标签防遮挡
                {
                    type: 'interval-hide-overlap',
                }, // 数据标签文颜色自动调整
                {
                    type: 'adjust-color',
                },
            ],
        },
    };
    return <>
        <PageHeader title="Statistiques"
                    extra={[
                        <Select key="select" size="large" style={{width: 200}} defaultValue={auth.agency}
                                onChange={(value) => console.log(value)}>
                            {agencies?.data.map((agency) => {
                                return (<Select.Option key={agency.id} value={agency.name}>{agency.name}</Select.Option>)
                            })}
                        </Select>,
                        <DatePicker.RangePicker locale={locale} style={{padding: "8px 11px 8px"}} key="datepicker" value={[new Moment(Moment.now()), new Moment(Moment.now())]}
                                                onChange={value => onChangeDate(value)}
                        />
                    ]}
        ></PageHeader>
        <Row style={{ padding: 40}}>
            <Col span={6}>
                <Card className='card-stats'>
                    <Statistic title="Tickets" value={1000} />
                </Card>
            </Col>
            <Col span={6}>
                <Card className='card-stats'>
                    <Statistic title="Agences" value={50} />
                </Card>
            </Col>
            <Col span={6}>
                <Card className='card-stats'>
                    <Statistic title="Articles" value={40} />
                </Card>
            </Col>
            <Col span={6}>
                <Card className='card-stats'>
                    <Statistic title="Utilisateurs" value={40} />
                </Card>
            </Col>
        </Row>
        <Row>
            <Col span={12}>
                <Pie {...config}/>
            </Col>
            <Col span={12}>
                <Column {...configColumn}/>
            </Col>
        </Row>
    </>;
}

export default CustomStatistic