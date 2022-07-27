import { PageHeader, Select, Table, Tag, Input } from 'antd';
import { useQuery } from 'react-query'
//import { data as dt } from '../../../mockdata/TicketData'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useUpdateStatus } from './hooks/useUpdateStatus';
import { useState, useEffect } from 'react';
import './TableSharedStyle.css'
import CustomLoader from '../components/custom/CustomLoader';

const { Option } = Select;

function WaitList() {

    let [filteredData, setFilteredData] = useState([]);
    const fetchWaitlist = () => {
        return axios.get("http://localhost:4000/tickets?status_ne=Résolu&status_ne=Fermé&agency=Bonanjo")
    }

    const { mutate: updateState } = useUpdateStatus();

    const { data: waitlist, isLoading } = useQuery("waitlist", fetchWaitlist)
    useEffect(() => {
        setFilteredData(waitlist?.data);
    }, [waitlist])

    //Columns
    const columns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`ticket/${record.id}`}>{text}</Link>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <p>{new DOMParser().parseFromString(text, 'text/html').body.textContent}</p>
        },

        {
            title: 'Emetteur',
            dataIndex: 'reporter',
            key: 'reporter',
        },
        {
            title: 'Attribuer à',
            dataIndex: 'assignee',
            key: 'assignee'
        },

        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                return (
                    <Select defaultValue={status} style={{ width: "98px" }}
                     onChange={(status) => { updateState({ id: record.id, status: status })
                    }}>
                        <Option value="Nouveau">Nouveau</Option>
                        <Option value="Assigné">Assigné</Option>
                        <Option value="En cours">En cours</Option>
                        <Option value="Résolu">Résolu</Option>
                        <Option value="Fermé">Fermé</Option>
                    </Select>
                )
            }
        },
        {
            title: 'Departement',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Priorité',
            key: 'priority',
            dataIndex: 'priority',
            render: (priority) => {
                let color = priority === 'Urgent' ? 'red' : priority === 'Important' ? 'volcano' : priority === 'Moyen' ? 'orange' : 'cyan';
                return (
                    <Tag color={color} key={priority}>
                        {priority.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: 'Catégorie',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Émis le',
            dataIndex: 'created_at',
            key: 'created_at',
        }
    ];
    // Search In table

    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(waitlist?.data.filter((data) =>  data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(waitlist?.data);
        }
    };
    if (isLoading) return (<CustomLoader />)
    return (
        <>
            <PageHeader
                title="Tous les tickets"
            />
            <Input.Search placeholder="Recherche" onChange={(e) =>onSearch(e.target.value)} style={{ width: 300, marginBottom: 20}}/>
            <Table columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={{ type: 'checkbox' }} rowKey="id" dataSource={filteredData} className="all-tickets_table" scroll={{ x: "true" }} />

        </>
    )
}

export default WaitList