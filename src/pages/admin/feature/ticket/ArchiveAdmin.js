import {Input, PageHeader, Select, Table, Tag, Typography} from 'antd';
import {useQuery} from 'react-query'
import {Link} from "react-router-dom";
import axios from 'axios'
import '../TableSharedStyle.css'
import {API_URL, API_USER_URL} from "../../../../global/axios";
import useAuth from "../../../../auth/hook/useAuth";
import React, {useEffect, useState} from "react";
import CustomLoader from "../../components/custom/CustomLoader";
import moment from "moment";

function ArchiveAdmin() {
    // Hooks
    let [filteredData, setFilteredData] = useState([]);
    let {auth} = useAuth();
    let [defaultAgency, setDefaultAgency] = useState(auth.agency);

    //List Archives
    const fetchArchive = () => {
        return axios.get(API_URL+"tickets/archive?offset=0&pageSize=10&source="+defaultAgency)
    }
    //List Agency
    const fetchAgency = () => {
        return axios.get(API_USER_URL+"users/agencies")
    }
    const {data: archives, refetch: refetchArchives, isLoading} = useQuery("archived", fetchArchive)
    const {data: agencies} = useQuery("agencieslist", fetchAgency)

    useEffect(() => {
        setFilteredData(archives?.data.content);
    }, [archives]);
    useEffect(() => {
        refetchArchives().then(() => {
        });
    }, [defaultAgency])

    //Functions

    // Search In table
    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(archives?.data.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(archives?.data);
        }
    };

    //Columns
    const columns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => record.status !== "Fermé" ?
                <Link to={`/admin/ticket/${record.id}`}>{text}</Link> : <p>{text}</p>
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
            render:(created_at) => moment(created_at).fromNow()
        }
    ];

    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader
                title="Tous les archives"
                extra={[
                    <Typography.Title level={5} key="title">Agence : </Typography.Title>,
                    <Select key="select" size="large" style={{width: 200}} defaultValue={defaultAgency}
                            onChange={(value) => setDefaultAgency(value)}>
                        {agencies?.data.map((agency) => {
                            return (<Select.Option key={agency.id} value={agency.name}>{agency.name}</Select.Option>)
                        })}
                    </Select>]}
            />
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            <Table columns={columns} rowKey="id" rowClassName="waitlist-table_row--shadow" dataSource={filteredData}
                   className="all-tickets_table" scroll={{x: "true"}}/>
        </>
    )
}

export default ArchiveAdmin