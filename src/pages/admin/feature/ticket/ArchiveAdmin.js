import {Input, PageHeader, Select, Table, Tag, Typography} from 'antd';
import {useQuery} from 'react-query'
import {Link} from "react-router-dom";
import axios from 'axios'
import '../TableSharedStyle.css'
import {API_URL, API_USER_URL} from "../../../../global/axios";
import useAuth from "../../../../auth/hook/useAuth";
import React, {useState} from "react";
import CustomLoader from "../../components/custom/CustomLoader";
import moment from "moment";
import {GET_ROUTE_WITH_ROLE} from "../../../../global/utils";
import {ROLE_AGENT} from "../../../../global/roles";

//Axios Functions
const fetchArchive = (page, pageSize, defaultAgency, typeTicket, auth) => {
    let url;
    if (auth.role === ROLE_AGENT) {
        url = API_URL + `tickets/archive/${auth.username}?page=${page}&pageSize=${pageSize}&type=0&source=`;
    } else {
        url = API_URL + `tickets/archive?page=${page}&pageSize=${pageSize}&type=${typeTicket}&source=`;
    }
    return axios.get(url + defaultAgency)
}

const fetchAgency = () => {
    return axios.get(API_USER_URL + "users/agencies")
}

function ArchiveAdmin() {
    // Hooks
    let [filteredData, setFilteredData] = useState([]);
    let {auth} = useAuth();
    let [defaultAgency, setDefaultAgency] = useState(auth.agency);
    let [typeTicket, setTypeTicket] = useState(0);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const {
        data: archives,
        isLoading
    } = useQuery(["archived", pagination.current, pagination.pageSize, defaultAgency, typeTicket, auth], () => fetchArchive(pagination.current - 1, pagination.pageSize, defaultAgency, typeTicket, auth), {
        onSuccess: (data) => {
            setFilteredData(data?.data.content);
            setPagination({
                ...pagination, total: data?.data.totalElements
            });
        }
    })
    const {data: agencies} = useQuery("agencieslist", fetchAgency)

    //Functions

    // Search In table
    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(archives?.data.content.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(archives?.data.content);
        }
    };

    //Columns
    const columns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => record.status !== "Fermé" ?
                <Link to={`/${GET_ROUTE_WITH_ROLE(auth.role)}/general/archives/${record.id}`}>{text}</Link> :
                <p>{text}</p>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            className: 'table_cell--width',
            render: (text) => <p>{new DOMParser().parseFromString(text, 'text/html').body.textContent}</p>
        },

        {
            title: 'Emetteur',
            dataIndex: 'reporter',
            key: 'reporter',
            sorter: {
                compare: (a, b) => a.reporter.length - b.reporter.length,
                multiple: 1,
            }
        },
        {
            title: 'Attribuer à',
            dataIndex: 'assigned_to',
            key: 'assignee',
            sorter: {
                compare: (a, b) => a.assigned_to.length - b.assigned_to.length,
                multiple: 2,
            },
        },

        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            filters: [
                {
                    text: 'Résolu',
                    value: 'Résolu',
                },
                {
                    text: 'Fermé',
                    value: 'Fermé',
                }
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            render: (status) => status.statusLabel
        },
        {
            title: 'Departement',
            dataIndex: 'department',
            key: 'department',
            sorter: {
                compare: (a, b) => a.department.length - b.department.length,
                multiple: 3,
            }
        },
        {
            title: 'Priorité',
            key: 'priority',
            dataIndex: 'priority',
            filters: [
                {
                    text: 'Urgent',
                    value: 'Urgent',
                },
                {
                    text: 'Important',
                    value: 'Important',
                },
                {
                    text: 'Moyen',
                    value: 'Moyen',
                },
                {
                    text: 'Normal',
                    value: 'Normal',
                }
            ],
            onFilter: (value, record) => record.priority.indexOf(value) === 0,
            render: (priority) => {
                let color = priority.priorityLabel === 'Urgent' ? 'red' : priority.priorityLabel === 'Important' ? 'volcano' : priority.priorityLabel === 'Moyen' ? 'orange' : 'cyan';
                return (
                    <Tag color={color} key={priority}>
                        {priority.priorityLabel.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
            render: (category) => category.name
        },
        {
            title: 'Émis le',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (createdAt, record) => moment(record.createdAt).fromNow()
        }
    ];

    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader
                title="Toutes les archives"
                extra={[
                    <Typography.Title level={5} key="title">Agence : </Typography.Title>,
                    <Select key="select" size="large" style={{width: 200}} defaultValue={defaultAgency}
                            onChange={(value) => setDefaultAgency(value)}>
                        {agencies?.data.map((agency) => {
                            return (<Select.Option key={agency.id} value={agency.name}>{agency.name}</Select.Option>)
                        })}
                    </Select>,
                    <Typography.Title level={5} key="type">Type : </Typography.Title>,
                    <Select key="selectType" size={"large"} defaultValue={typeTicket}
                            onChange={(value) => setTypeTicket(value)}>
                        <Select.Option key={0} value={0}>Incidents</Select.Option>
                        <Select.Option key={1} value={1}>Problèmes</Select.Option>
                    </Select>]}
            />
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            <Table loading={isLoading} columns={columns} rowKey="id" rowClassName="waitlist-table_row--shadow"
                   dataSource={filteredData}
                   pagination={{
                       ...pagination, showSizeChanger: true, onChange: (page, pageSize) => {
                           setPagination({current: page, pageSize: pageSize})
                       }
                   }}
                   className="all-tickets_table" scroll={{x: "true"}}/>
        </>
    )
}

export default ArchiveAdmin