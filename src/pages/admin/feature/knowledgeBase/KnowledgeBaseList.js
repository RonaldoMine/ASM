import {Button, Input, PageHeader, Select, Table, Typography} from 'antd';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import 'braft-editor/dist/index.css'
import axios from "axios";
import {useQuery} from "react-query";
import CustomLoader from '../../components/custom/CustomLoader';
import {API_URL, API_USER_URL} from "../../../../global/axios";
import moment from "moment";
import useAuth from "../../../../auth/hook/useAuth";
import {ROLE_ADMIN, ROLE_SUPER_ADMIN} from "../../../../global/roles";

const {Option} = Select;

export const columns = [
    {
        title: 'Article',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`detail/${record.articleId}`}>{text}</Link>,
    },
    {
        title: 'Catégories',
        dataIndex: 'category',
        key: 'category',
        render: (text, record) => record.category.name,
    },
    /*{
        title: 'Vues',
        dataIndex: 'number_of_views',
        key: 'number_of_views',
    },*/
    {
        title: 'Dernière mise à jour',
        dataIndex: 'updated_at',
        key: 'updated_at',
        render: (createdAt, record) => moment(record.updatedAt ?? record.createdAt).fromNow()
    },
];

// Function Axios
const fetchKnowlegeBase = ({queryKey}) => {
    const agency = queryKey[1];
    return axios.get(API_URL + `knowledgebase/${agency}`);
}
const fetchArticle = (page, pageSize, knowledgeBaseId) => {
    return axios.get(API_URL + `articles?page=${page}&pageSize=${pageSize}&kbId=${knowledgeBaseId}`);
}

const fetchAgencies = () => {
    return axios.get(API_USER_URL + "users/agencies")
}

function KnowledgeBaseList() {
    // Hooks
    let [filteredData, setFilteredData] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [knowledgeBaseId, setKnowledgeBaseId] = useState(null);
    const [tableIsLoading, setTableIsLoading] = useState(true);
    const {auth} = useAuth();
    let [defaultAgency, setDefaultAgency] = useState(auth.agency);
    const {refetch: refetchKnowledgebase} = useQuery(['knowledgebase', defaultAgency], fetchKnowlegeBase, {
        onSuccess: (data) => {
            setKnowledgeBaseId(data.data.knowledgeBaseId);
        },
        onError: () => {
            setFilteredData([]);
            setKnowledgeBaseId(null);
            setTableIsLoading(false);
        },
        retry: 2
    });
    const {
        data: articles,
        isLoading,
        refetch: refetchArticles
    } = useQuery(["articles", pagination.current, pagination.pageSize, knowledgeBaseId], () => fetchArticle(pagination.current - 1, pagination.pageSize, knowledgeBaseId), {
        onSuccess: (data) => {
            setFilteredData(data?.data.content);
            setPagination({
                ...pagination, total: data?.data.totalElements
            });
            setTableIsLoading(false);
        },
        enabled: false
    });
    const {data: agencies, isAgencyLoading} = useQuery("agencieslist", fetchAgencies);
    useEffect(() => {
        if (knowledgeBaseId) {
            setTableIsLoading(true);
            refetchArticles();
        }
    }, [knowledgeBaseId]);
    useEffect(() => {
        if (knowledgeBaseId) {
            setTableIsLoading(true);
            refetchKnowledgebase();
        }
    }, [defaultAgency]);

    // # Funtions
    // Search In table

    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(articles?.data.content.filter((data) => data.title.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(articles?.data.content);
        }
    };
    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader style={{marginBottom: 20}}
                        title="Base de connaissances"
                        extra={(auth.role === ROLE_ADMIN || auth.role === ROLE_SUPER_ADMIN) && [<Typography.Title level={5} key="title">Agence : </Typography.Title>,
                            (!isAgencyLoading && (
                                <Select key="select" style={{width: 200}} defaultValue={defaultAgency}
                                        onChange={(value) => setDefaultAgency(value)}>
                                    {agencies?.data.map((agency) => {
                                        return (<Option key={agency.id} value={agency.name}>{agency.name}</Option>)
                                    })}
                                </Select>)),
                            <Link to={`create/${knowledgeBaseId}`} key="add"><Button type="primary">Créer un article</Button></Link>]}
            />
            <p>Une base de connaissances est une bibliothèque en ligne accessible en libre-service, qui regroupe des
                informations sur un produit, un service, un département ou un thème. </p>
            <Input.Search placeholder="Recherche" onChange={(e) => onSearch(e.target.value)}
                          style={{width: 300, marginBottom: 20}}/>
            <Table loading={tableIsLoading} columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={{type: 'checkbox'}}
                   rowKey="articleId" dataSource={filteredData}
                   className="all-knowledgebase_table" scroll={{x: "true"}}/>

            {/*Modal */}
            {/*<Modal width={800}
                   cancelText={"Annuler"} okText={"Créer"} visible={isOpen} onCancel={handleCancel} onOk={handleCreate}
                   confirmLoading={confirmLoading}>
                <Form
                    name="create_knowledge"
                    layout='vertical'
                    autoComplete="off"
                    form={form}
                >
                    <Form.Item
                        label="Titre"
                        name="title" rules={[{required: true, message: "Insérez un titre"}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="Catégorie"
                        name="category">
                        <Select name="catergory" placeholder="Sélectionnez une catégorie">
                            <Select.Option>
                                Categorie 1
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Description" name="description"
                               rules={[{required: true, message: "Insérez la description de l'article"}]}>
                        <BraftEditor language="fr"
                                     contentStyle={{height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                                     onChange={onChangeBraft}/>
                    </Form.Item>
                </Form>
            </Modal>*/}
            {/*Modal */}
        </>
    )
}

export default KnowledgeBaseList