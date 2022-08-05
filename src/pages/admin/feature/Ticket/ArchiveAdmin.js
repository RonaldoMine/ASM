import { PageHeader, Table, Tag } from 'antd';
import { useQuery } from 'react-query'
import { Link } from "react-router-dom";
import axios from 'axios'
import '../TableSharedStyle.css'
import {API_URL} from "../../../../global/axios";

function ArchiveAdmin() {

    const fetchArchive = () => {

        return axios.get(API_URL+"tickets?status=Résolu&status=Fermé&agency=Bonanjo")
    }

    const { data: archived } = useQuery("archived", fetchArchive)

    //Columns
    const columns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => record.status !== "Fermé" ? <Link to={`/admin/ticket/${record.id}`}>{text}</Link> : <p>{text}</p>
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



    return (
        <>
            <PageHeader
                title="Tous les tickets"
            />
            <Table columns={columns} rowKey="id" rowClassName="waitlist-table_row--shadow" dataSource={archived?.data} className="all-tickets_table" scroll={{ x: "true" }} />

        </>
    )
}

export default ArchiveAdmin