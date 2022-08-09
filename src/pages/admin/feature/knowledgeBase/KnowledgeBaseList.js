import {Button, PageHeader, Table, Input} from 'antd';
import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import 'braft-editor/dist/index.css'
import axios from "axios";
import {useQuery} from "react-query";
import CustomLoader from '../../components/custom/CustomLoader';
import {API_URL} from "../../../../global/axios";

export const columns = [
    {
        title: 'Article',
        dataIndex: 'title',
        key: 'title',
        render: (text, record) => <Link to={`detail/${record.id}`}>{text}</Link>,
    },
    {
        title: 'Catégories',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Vues',
        dataIndex: 'number_of_views',
        key: 'number_of_views',
    },
    {
        title: 'Dernière mise à jour',
        dataIndex: 'updated_at',
        key: 'updated_at',
    },
];

function KnowledgeBaseList() {
    // Hooks
    let [filteredData, setFilteredData] = useState([]);
    const fetchArticle = () => {
        return axios.get(API_URL+"kb_article?knowledgeBase_id=2")

    }
    const {data: articles, isLoading} = useQuery(["articles", "2"], fetchArticle)

    useEffect(() => {
        setFilteredData(articles?.data);
    }, [articles])
    // # Funtions
    // Search In table

    const onSearch = (value) => {
        if (value !== '') {
            setFilteredData(articles?.data.filter((data) => data.title.toLowerCase().includes(value.toLowerCase()) || data.description.toLowerCase().includes(value.toLowerCase())))
        } else {
            setFilteredData(articles?.data);
        }
    };
    if (isLoading) return (<CustomLoader />)
    return (
        <>
            <PageHeader style={{marginBottom: 20}}
                        title="Base de connaissances"
                        extra={[<Link to="create" key="add"><Button type="primary">Créer un article</Button></Link>]}
            />
            <p>Une base de connaissances est une bibliothèque en ligne accessible en libre-service, qui regroupe des informations sur un produit, un service, un département ou un thème. </p>
            <Input.Search placeholder="Recherche" onChange={(e) =>onSearch(e.target.value)} style={{ width: 300, marginBottom: 20}}/>
            <Table columns={columns} rowClassName="waitlist-table_row--shadow" rowSelection={{type: 'checkbox'}} rowKey="id" dataSource={filteredData}
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