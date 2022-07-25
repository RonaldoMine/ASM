import { PageHeader, Select, Table, Tag } from 'antd';
import { useQuery } from 'react-query'
//import { data as dt } from '../../../mockdata/TicketData'
import { Link } from "react-router-dom";
import axios from 'axios'
import { useUpdateStatus } from './hooks/useUpdateStatus';


const { Option } = Select;

function AgentTickets() {

    const fetchAgentTickets = () => {

        return axios.get("http://localhost:4000/tickets?status_ne=Résolu&status_ne=Fermé&agency=Bonanjo&author_id=3")
    }

    const { mutate: updateState } = useUpdateStatus();

    const { data: mytickets } = useQuery("mytickets", fetchAgentTickets)


    //Columns
    const columns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: text => <Link to=''>{text}</Link>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },

        {
            title: 'Emetteur',
            dataIndex: 'reporter',
            key: 'reporter',
        },
        {
            title: 'Attribuer à',
            dataIndex: 'assignee',
            key: 'assignee',
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



    return (
        <>
            <PageHeader
                title="Tous les tickets"
            />
            <Table columns={columns} rowSelection={{ type: 'checkbox' }} rowKey="id" dataSource={mytickets?.data} className="all-tickets_table" scroll={{ x: "true" }} />

        </>
    )
}

export default AgentTickets