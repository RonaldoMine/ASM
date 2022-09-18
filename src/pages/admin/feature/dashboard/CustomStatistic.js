import {Column, Pie} from '@ant-design/plots';
import {Card, Col, DatePicker, PageHeader, Row, Select, Statistic} from "antd";
import Moment from "moment";
import 'moment/locale/fr';
import React, {useState} from "react";
import useAuth from "../../../../auth/hook/useAuth";
import axios from "axios";
import {API_URL, API_USER_URL} from "../../../../global/axios";
import {useQuery} from "react-query";
import locale from 'antd/es/date-picker/locale/fr_FR';
import './CustomStatistic.css';
import {DARK_COLOR, PRIMARY_COLOR, SUCCESS_COLOR, WARNING_COLOR} from "../../../../global/colors";

//Axios functions
const fetchAgency = () => {
    return axios.get(API_USER_URL + "users/agencies")
}

const fetchIncidentStats = (agency, startDate, endDate) => {
    return axios.get(API_URL + `tickets/stats/incidents?source=${agency}&startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`)
}

const fetchGraphIncidentStats = (agency, startDate, endDate) => {
    return axios.get(API_URL + `tickets/graph-stats/incidents?source=${agency}&startDate=${startDate.format("YYYY-MM-DD")}&endDate=${endDate.format("YYYY-MM-DD")}`)
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
    let [graphDatas, setGraphDatas] = useState([]);
    let [pieDatas, setPieDatas] = useState({
        allIncidentsBetween: null,
        allNewIncidents: null,
        allSolvedIncidents: null,
        allProcessingIncidents: null,
        allClosedIncidents: null
    });

    const {data: agencies} = useQuery("agencieslist", fetchAgency)
    useQuery(["statsincidents", auth.agency, startDate, endDate], () => fetchIncidentStats(auth.agency, startDate, endDate), {
        onSuccess: ((statsIncidents) => {
            setPieDatas({
                allIncidentsBetween: statsIncidents.data.allIncidentsBetween,
                allNewIncidents: statsIncidents.data.allNewIncidents,
                allSolvedIncidents: statsIncidents.data.allSolvedIncidents,
                allProcessingIncidents: statsIncidents.data.allProcessingIncidents,
                allClosedIncidents: statsIncidents.data.allClosedIncidents,
            })
        })
    })
    useQuery(["graphstatsincidents", auth.agency, startDate, endDate], () => fetchGraphIncidentStats(auth.agency, startDate, endDate), {
        onSuccess: ((datas) => {
            setGraphDatas(datas.data)
        })
    })

    //Data
    const dataPie = [
        {
            type: 'Nouveaux',
            value: pieDatas.allNewIncidents,
        },
        {
            type: 'Résolus',
            value: pieDatas.allSolvedIncidents,
        },
        {
            type: 'En cours',
            value: pieDatas.allProcessingIncidents,
        },
        {
            type: 'Fermés',
            value: pieDatas.allClosedIncidents,
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

    const configColumn = {
        data: graphDatas,
        isGroup: true,
        xField: 'label',
        yField: 'value',
        seriesField: 'title',
        color: [WARNING_COLOR, PRIMARY_COLOR, SUCCESS_COLOR, DARK_COLOR],
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
                    <Statistic title="Tous les tickets" value={pieDatas.allIncidentsBetween}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Nouveaux tickets" valueStyle={{color: PRIMARY_COLOR}}
                               value={pieDatas.allNewIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets résolus / fermés" valueStyle={{color: SUCCESS_COLOR}}
                               value={pieDatas.allSolvedorClosedIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets en cours" valueStyle={{color: WARNING_COLOR}}
                               value={pieDatas.allProcessingIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets résolus" valueStyle={{color: SUCCESS_COLOR}}
                               value={pieDatas.allSolvedIncidents}/>
                </Card>
            </Col>
            <Col span={8}>
                <Card className='card-stats'>
                    <Statistic title="Tickets fermés" value={pieDatas.allClosedIncidents}/>
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