import {Button, PageHeader, Table} from 'antd';
import {datas} from '../../../../mockdata/KnowledgeBaseData'
import React, {useState} from "react";
import {Link} from "react-router-dom";
import 'braft-editor/dist/index.css'
import Search from "antd/es/input/Search";

export const columns = [
    {
        title: 'Article',
        dataIndex: 'article',
        key: 'article',
        render: (text, record) => <Link to={`detail/${record.id}`}>{text}</Link>,
    },
    {
        title: 'Catégories',
        dataIndex: 'category',
        key: 'category',
    },
    {
        title: 'Vues',
        dataIndex: 'numberOfViews',
        key: 'numberOfViews',
    },
    {
        title: 'Dernière mise à jour',
        dataIndex: 'updated_At',
        key: 'updated_At',
    },
];

function KnowledgeBaseList() {
    // # Funtions
    // Search In table
    const onSearch = (value) => {
        let filtered;
        if (value !== '') {
            filtered = datas.filter((data) => value === "" || data.article.toLowerCase().includes(value.toLowerCase()))
        } else {
            filtered = datas;
        }
        setDatas(filtered);
    };

    // Hooks
    const [datasState, setDatas] = useState(datas);

    return (
        <>
            <PageHeader style={{marginBottom: 20}}
                        title="Base de connaissances"
                        extra={[<Link to="create" key="add"><Button type="primary">Créer un article</Button></Link>]}
            />
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis distinctio exercitationem mollitia quos
                vitae! Ad dolorem dolores earum eius error, fugiat inventore labore, maiores modi officiis pariatur
                quisquam velit voluptatibus?
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. </p>
            <Search placeholder="Recherche" onSearch={onSearch} style={{width: 300, marginBottom: 20}}/>
            <Table columns={columns} rowSelection={{type: 'checkbox'}} rowKey="id" dataSource={datasState}
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