import {
    AutoComplete,
    Button,
    Dropdown,
    Form,
    Input,
    Menu,
    message, Modal,
    PageHeader,
    Select,
    Space,
    Table,
    Tag,
    Typography
} from 'antd';
import {useQuery} from 'react-query'
import {Link} from "react-router-dom";
import axios from 'axios'
import {useUpdateStatus} from '../hooks/useUpdateStatus';
import {CheckOutlined, DownloadOutlined, ExclamationCircleOutlined, LockOutlined} from "@ant-design/icons";
import '../TableSharedStyle.css'
import React, {useContext, useEffect, useRef, useState} from 'react';
import CustomLoader from '../../components/custom/CustomLoader';
import useAuth from "../../../../auth/hook/useAuth";
import {API_URL, API_USER_URL} from "../../../../global/axios";
import moment from "moment/moment";
import {utils as utilsXLXS, writeFile} from "xlsx";
import {
    TICKET_LABEL_UNASSIGNED,
    TICKET_STATUS_CLOSED,
    TICKET_STATUS_SOLVED
} from "../../../../global/statusTickets";
import {useAssignTicket} from "../hooks/useAssignTicket";
import {GET_COLOR_TICKET_STATUS, GET_ROUTE_WITH_ROLE, GET_TCIKET_LABELS} from "../../../../global/utils";
import {ROLE_AGENT} from "../../../../global/roles";
import TextArea from "antd/lib/input/TextArea";

const {Option} = Select;

const EditableContext = React.createContext(null);

//Functions
//Editable Row component
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

//Editable Cell component
const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          components,
                          defaultValue,
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
            [dataIndex]: defaultValue && defaultValue(record)
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
                    {components({onChange: save, onBlur: toggleEdit, ref: inputRef, record: record})}
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

//Dropdown export options
const MenusExport = (handleExportTicket) => (
    <Menu
        items={[
            {
                label: <span onClick={() => handleExportTicket("EXCEL")}>EXCEL</span>,
                key: 'excel',
            },
        ]}
    />
);

//List Incident
const fetchWaitlist = (page, pageSize, defaultAgency) => {
    let url = API_URL + `tickets/waitlist?page=${page}&pageSize=${pageSize}&type=1&source=`;
    return axios.get(url + defaultAgency)
}
//List user
const fetchUser = ({queryKey}) => {
    let defaultAgency = queryKey[1];
    return axios.get(API_USER_URL + "users/admin?agency=" + defaultAgency)
}
//List Agency
const fetchAgency = () => {
    return axios.get(API_USER_URL + "users/agencies")
}
//List Next Status
const fetchNextStatus = ({queryKey}) => {
    let statusId = queryKey[1];
    return axios.get(API_URL + "tickets/status?following=" + statusId);
}

//Waitlist component
function Incident() {
    //hooks
    let {auth} = useAuth();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    let [defaultAgency, setDefaultAgency] = useState(auth.agency);
    const {mutate: updateState} = useUpdateStatus();
    const {
        mutate: assignTicket,
        isLoading: isLoadingAssign
    } = useAssignTicket(["waitlist-problem", pagination.current, pagination.pageSize, defaultAgency, auth]);
    let [filteredData, setFilteredData] = useState([]);
    let [filteredUserData, setFilteredUserData] = useState([]);
    let [currentSelectedStatus, setCurrentSelectedStatus] = useState("");

    const {
        data: waitlist,
        isLoading
    } = useQuery(["waitlist-problem", pagination.current, pagination.pageSize, defaultAgency], () => fetchWaitlist(pagination.current - 1, pagination.pageSize, defaultAgency), {
        onSuccess: (data) => {
            setFilteredData(data?.data.content);
            setPagination({
                ...pagination, total: data?.data.totalElements
            });

        },
        keepPreviousData: true
    })

    const {data: followingStatus} = useQuery(["following_statuses", currentSelectedStatus], fetchNextStatus, {
        enabled: currentSelectedStatus !== ""
    })

    const {data: users} = useQuery(["userlist", defaultAgency], fetchUser);
    const {data: agencies, isAgencyLoading} = useQuery("agencieslist", fetchAgency);

    useEffect(() => {
        setFilteredUserData(users?.data.content);
    }, [users]);

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
            updateState({id: ticketId, status: action})
        })
        message.success('Tickets mis à jour');
        setSelectedRowKeys([]);
    }
    const handleExportTicket = (type) => {
        if (type === 'EXCEL') {
            let datas = filteredData.filter((data) => selectedRowKeys.includes(data.id));
            let wb = utilsXLXS.book_new();
            let ws = utilsXLXS.json_to_sheet(datas.map((data) => {
                return {
                    Titre: data.title,
                    Description: data.description,
                    Emetteur: data.reporter,
                    'Attribuer à': data.assigned_to,
                    Status: data.status.statusLabel,
                    Departement: data.department,
                    'Priorité': data.priority.priorityLabel,
                    'Catégorie': data.category.name,
                    'Émis le': moment(data.createdAt).format('MM-DD-YYYY'),
                };
            }));
            utilsXLXS.book_append_sheet(wb, ws, "Classeur 1");
            writeFile(wb, "Listes des Tickets.xlsx");
        } else {

        }
    }
    //Filter users in table
    const onSearchUser = (value) => {
        if (value !== '') {
            setFilteredUserData(users?.data.filter((user) => user.username.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredUserData(users?.data);
        }
    };
    //Filter users in table
    const onAssignTicket = (data) => {
        if (data.value !== data.old_value) {
            assignTicket(data);
            message.success(`Ticket assigné à ${data.to}`);
        }
    };
    const onUpdateStatutTicket = (data, onChange, onBlur) => {
        data.note = '';
        if (data.assigned_to === TICKET_LABEL_UNASSIGNED) {
            onBlur();
            message.warning(`Vous devez d'abord attribué la tâche à un utilisateur`);
        } else {
            if (data.status !== data.old_value) {
                if (data.status === 3) {
                    Modal.confirm({
                        title: 'Confimer la résolution de ce ticket',
                        icon: <ExclamationCircleOutlined/>,
                        content: <>
                            <TextArea placeholder="Note de résolution"
                                      onChange={(e) => data.note = e.target.value}>{data.note}</TextArea>
                        </>,
                        okText: 'Valider',
                        style: {position: 'relative', top: 'calc(100vh - 68%)'},
                        cancelText: 'Annuler',
                        onOk: () => {
                            if (data.note !== '') {
                                updateState(data);
                                onChange(data.status);
                                message.success(`Ticket ${data.label}`);
                            } else {
                                message.error(`Mise à jour non prise en compte, vous n'avez pas renseigner une note`);
                            }
                        },
                        onCancel: () => {
                        }
                    });
                } else {
                    updateState(data);
                    onChange(data.status);
                    message.success(`Ticket ${data.label}`);
                }
            }
        }
    };

    //Columns
    const defaultColumns = [
        {
            title: 'Intitulé',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => <Link to={`/${GET_ROUTE_WITH_ROLE(auth.role)}/general/problems/${record.id}`}>{text}</Link>
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
            editable: auth.role !== ROLE_AGENT,
            type: "select",
            sorter: {
                compare: (a, b) => a.assigned_to.length - b.assigned_to.length,
                multiple: 2,
            },
            components: ({onChange, record, onBlur, ref}) => {
                return (
                    <AutoComplete
                        style={{
                            width: 200,
                        }}
                        onSelect={(value) => {
                            onChange(value);
                            onAssignTicket({id: record.id, to: value, old_value: record.assigned_to})
                        }}
                        onBlur={onBlur}
                        onSearch={onSearchUser}
                        placeholder="Rechercher les utilisateurs" ref={ref}
                    >
                        {filteredUserData?.map((user, key) => (user.username !== auth.username &&
                            <Option key={user.username + key} value={user.username}>
                                {user.username}
                            </Option>
                        ))}
                    </AutoComplete>)
            },
            defaultValue: (record) => record.assigned_to !== TICKET_LABEL_UNASSIGNED ? record.assigned_to : ''
        },
        {
            title: 'Statut',
            dataIndex: 'status',
            key: 'status',
            editable: auth.role !== ROLE_AGENT,
            filters: [
                {
                    text: 'Nouveau',
                    value: 'Nouveau',
                },
                {
                    text: 'Assigné',
                    value: 'Assigné',
                },
                {
                    text: 'En cours',
                    value: 'En cours',
                }
            ],
            type: "select",
            render: (status) => {
                const typeOfStatus = typeof status;
                return (
                    <Tag color={GET_COLOR_TICKET_STATUS(typeOfStatus === 'number' ? status : status.statusId)}
                         key={status}>
                        {typeOfStatus === 'number' ? GET_TCIKET_LABELS(typeOfStatus === 'number' ? status : status.statusId) : status.statusLabel.toUpperCase()}
                    </Tag>
                );
            },
            onFilter: (value, record) => record.status.statusLabel.indexOf(value) === 0,
            components: ({onChange, record, onBlur, ref}) => {
                return (
                    <Select ref={ref} style={{width: "98px"}}
                            onChange={(status, option) => {
                                onUpdateStatutTicket({
                                    id: record.id,
                                    status: status,
                                    old_value: record.status.statusId,
                                    label: option.children,
                                    note: record.note,
                                    assigned_to: record.assigned_to
                                }, onChange, onBlur)
                            }} onBlur={onBlur} onClick={() => {
                        setCurrentSelectedStatus(record.status.statusId)
                    }}>
                        <Option value={record.status.statusId}>{record.status.statusLabel}</Option>
                        {
                            followingStatus?.data?.map((fstatus) =>
                                (<Option key={fstatus.status.statusId}
                                         value={fstatus.status.statusId}>{fstatus.status.statusLabel}</Option>)
                            )
                        }
                    </Select>
                )
            },
            defaultValue: (record) => record.status.statusId
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
            onFilter: (value, record) => record.priority.priorityLabel.indexOf(value) === 0,
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
    // Search In table
    const onSearch = (value) => {
        setSelectedRowKeys([]);
        if (value !== '') {
            setFilteredData(waitlist?.data.content.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(waitlist?.data.content);
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
                defaultValue: col.defaultValue,
                handleSave,
            }),
        };
    });

    return (
        <>
            <PageHeader
                title="Tous les problèmes"
                extra={[
                    <Typography.Title level={5} key="title">Agence : </Typography.Title>,
                    (!isAgencyLoading && (
                        <Select key="select" size="large" style={{width: 200}} defaultValue={defaultAgency}
                                onChange={(value) => setDefaultAgency(value)}>
                            {agencies?.data.map((agency) => {
                                return (<Option key={agency.id} value={agency.name}>{agency.name}</Option>)
                            })}
                        </Select>))
                ]}
            />
            {hasSelected ? <Space style={{marginBottom: 12, display: 'flex', justifyContent: 'end'}}>
                <Button onClick={() => markSelectedAsSolvedOrClosed(TICKET_STATUS_SOLVED)} icon={<CheckOutlined/>}>Marquer
                    comme
                    résolu</Button>
                <Button onClick={() => markSelectedAsSolvedOrClosed(TICKET_STATUS_CLOSED)} icon={<LockOutlined/>}>Fermer
                    les
                    tickets</Button>
                <Dropdown overlay={MenusExport(handleExportTicket)} trigger={['click']} overlayStyle={{width: 70}}>
                    <Button icon={<DownloadOutlined/>}></Button>
                </Dropdown>
            </Space> : ''}
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            {!isLoading ? <Table loading={isLoadingAssign}
                                 components={components}//Add new Custom Cell and Row
                                 pagination={{
                                     ...pagination, showSizeChanger: true, onChange: (page, pageSize) => {
                                         setPagination({current: page, pageSize: pageSize})
                                     }
                                 }}
                                 columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={rowSelection}
                                 rowKey="id"
                                 dataSource={[...filteredData]} className="all-tickets_table" scroll={{x: "true"}}/> :
                <CustomLoader/>}

        </>
    )
}

export default Incident