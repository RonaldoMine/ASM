import {Column, Pie} from '@ant-design/plots';
import {Card, Col, DatePicker, PageHeader, Row, Select, Statistic} from "antd";
import Moment from "moment";
import 'moment/locale/fr';
import React, {useEffect, useState} from "react";
import useAuth from "../../../../auth/hook/useAuth";
import axios from "axios";
import {API_URL, API_USER_URL} from "../../../../global/axios";
import {useQuery} from "react-query";
import locale from 'antd/es/date-picker/locale/fr_FR';
import './CustomStatistic.css';
import {PRIMARY_COLOR, SUCCESS_COLOR, WARNING_COLOR} from "../../../../global/colors";

//Axios functions
const fetchAgency = () => {
    return axios.get(API_USER_URL + "users/agencies")
}

const fetchIncidentStats = (agency, startDate, endDate) => {
    return axios.get(API_URL + `tickets/stats/incidents?source=${agency}&startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`)
}

//Other Functions
const onChangeDate = (value, setStartDate, setEndDate) => {
    const [from, to] = value;
    setStartDate(from);
    setEndDate(to);
}

function CustomStatistic() {
    // Hooks
    let {auth} = useAuth();
    let [startDate, setStartDate] = useState(new Moment(Moment.now()));
    let [endDate, setEndDate] = useState(new Moment(Moment.now()));

    const {data: agencies} = useQuery("agencieslist", fetchAgency)
    const {
        data: statsIncidents,
        refetch: refetchStatsIncident
    } = useQuery(["statsincidents", auth.agency], () => fetchIncidentStats(auth.agency, startDate, endDate))
    useEffect(() => {
        refetchStatsIncident().then(() => {
        });
    }, [startDate, endDate])

    //Data
    const dataPie = [
        {
            type: 'Nouveaux',
            value: statsIncidents?.data.allNewIncidents,
        },
        {
            type: 'Résolus',
            value: statsIncidents?.data.allSolvedIncidents,
        },
        {
            type: 'En cours',
            value: statsIncidents?.data.allProcessingIncidents,
        },
        {
            type: 'Fermés',
            value: statsIncidents?.data.allClosedIncidents,
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
        label: {
            position: 'middle',
            // 'top', 'middle', 'bottom'
            layout: [
                // 柱形图数据标签位置自动调整
                {
                    type: 'interval-adjust-position',
                },
                {
                    type: 'interval-hide-overlap',
                },
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
                                return (
                                    <Select.Option key={agency.id} value={agency.name}>{agency.name}</Select.Option>)
                            })}
                        </Select>,
                        <DatePicker.RangePicker locale={locale} style={{padding: "8px 11px 8px"}} key="datepicker"
                                                value={[startDate, endDate]}
                                                onChange={value => onChangeDate(value, setStartDate, setEndDate)}
                        />
                    ]}
        ></PageHeader>
        <Row style={{padding: 40}}>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tous les tickets" value={statsIncidents?.data.allIncidentsBetween}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Nouveaux tickets" valueStyle={{color: PRIMARY_COLOR}}
                               value={statsIncidents?.data.allNewIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets résolus / fermés" valueStyle={{color: SUCCESS_COLOR}}
                               value={statsIncidents?.data.allSolvedorClosedIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets en cours" valueStyle={{color: WARNING_COLOR}}
                               value={statsIncidents?.data.allProcessingIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets résolus" valueStyle={{color: SUCCESS_COLOR}}
                               value={statsIncidents?.data.allSolvedIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets fermés" value={statsIncidents?.data.allClosedIncidents}/>
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