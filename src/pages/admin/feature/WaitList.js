import {Button, Input, PageHeader, Select, Space, Table, Tag, AutoComplete, Form} from 'antd';
import {useQuery} from 'react-query'
import {Link} from "react-router-dom";
import axios from 'axios'
import {useUpdateStatus} from './hooks/useUpdateStatus';
import {CheckOutlined, LockOutlined} from "@ant-design/icons";
import './TableSharedStyle.css'
import {useResolveSelectedTickets} from './hooks/useResolveSelectedTickets';
import React, {useContext, useEffect, useRef, useState} from 'react';
import CustomLoader from '../components/custom/CustomLoader';

const {Option} = Select;
const EditableContext = React.createContext(null);

const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          components,
                          type,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            //[dataIndex]: record[dataIndex]
            [dataIndex]: ""
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            setEditing(!editing);
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };
    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <>
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `Ce champs est requis`,
                        },
                    ]}
                >
                    {components({onChange: save, onBlur: toggleEdit, ref: inputRef})}
                </Form.Item>
            </>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

function WaitList() {

    //hooks
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const {mutate: markedAsResolvedOrClosed} = useResolveSelectedTickets();
    const {mutate: updateState} = useUpdateStatus();
    let [filteredData, setFilteredData] = useState([]);
    let [filteredUserData, setFilteredUserData] = useState([]);
    const fetchWaitlist = () => {
        return axios.get("http://localhost:4000/tickets?status_ne=Résolu&status_ne=Fermé&agency=Bonanjo")
    }
    const {data: waitlist, isLoading} = useQuery("waitlist", fetchWaitlist)
    //List user
    const fetchUser = () => {
        return axios.get("http://localhost:4000/users")
    }
    const {data: users} = useQuery("userlist", fetchUser)

    useEffect(() => {
        setFilteredData(waitlist?.data);
        setFilteredUserData(users?.data);
    }, [waitlist, users])


    //functions
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        type: "checkbox",
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    const markSelectedAsSolvedOrClosed = (action) => {
        selectedRowKeys.forEach((ticketId) => {
            markedAsResolvedOrClosed({ticketId: ticketId, status: action})
        })
    }
    //Filter users in table
    const onSearchUser = (value) => {
        if (value !== '') {
            setFilteredUserData(users?.data.filter((user) => user.username.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredUserData(users?.data);
        }
    };

    //Columns
    const defaultColumns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`${record.id}`}>{text}</Link>
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
            key: 'assignee',
            editable: true,
            type: "select",
            components: ({onChange, onBlur, ref}) => {
                return (
                    <AutoComplete
                        style={{
                            width: 200,
                        }}
                        onSelect={onChange}
                        onBlur={onBlur}
                        onSearch={onSearchUser}
                        placeholder="Rechercher les utilisateurs" ref={ref}
                    >
                        {filteredUserData.map((user, key) => (
                            <Option key={user.username+key} value={user.username}>
                                {user.username}
                            </Option>
                        ))}
                    </AutoComplete>)
            }
        },

        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => {
                return (
                    <Select defaultValue={status} style={{width: "98px"}}
                            onChange={(status) => {
                                updateState({id: record.id, status: status})
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
            setFilteredData(waitlist?.data.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(waitlist?.data);
        }
    };
    //Custom Construct Data Colum and Cell
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    //Save change row in Data
    const handleSave = (row) => {
        const newData = [...filteredData];
        const index = newData.findIndex((item) => row.id === item.id);
        const item = newData[index];
        newData.splice(index, 1, {...item, ...row});
        setFilteredData(newData);
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                components: col.components,
                type: col.type,
                handleSave,
            }),
        };
    });


    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader
                title="Tous les tickets"
            />
            {hasSelected ? <Space style={{marginBottom: 12, display: 'flex', justifyContent: 'end'}}>
                <Button onClick={() => markSelectedAsSolvedOrClosed("Résolu")} icon={<CheckOutlined/>}>Marquer comme
                    résolu</Button>
                <Button onClick={() => markSelectedAsSolvedOrClosed("Fermé")} icon={<LockOutlined/>}>Fermer les
                    tickets</Button>
            </Space> : ''}
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            <Table
                components={components}  //Add new Custom Cell and Row
                columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={rowSelection} rowKey="id"
                dataSource={filteredData} className="all-tickets_table" scroll={{x: "true"}}/>

        </>
    )
}

export default WaitList