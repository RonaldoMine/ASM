import React from "react";
import { Select, Tag } from "antd";
import { Link } from "react-router-dom";

const { Option } = Select;

export const columns = [
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
        render: (assignee) => {
            return (
                <p>{assignee}</p>
            )
        }
    },
    
    {
        title: 'Statut',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
            return (
                <Select defaultValue={status} style={{width: "98px"}}>
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
        title: 'Impact',
        dataIndex: 'impact',
        key: 'impact',
    },
    {
        title: 'Émis le',
        dataIndex: 'created_at',
        key: 'created_at',
    }
];