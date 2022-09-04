import {Button, Form, Input, Space, TreeSelect} from "antd";
import BraftEditor from "braft-editor";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {API_URL} from "../../../../global/axios";
import {useQuery} from "react-query";
import axios from "axios";

//Functions Axios
const fetchCategories = () => {
    return axios.get(API_URL + "tickets/categories/parent")
}

function KnowledgeBaseForm({
                               form,
                               articleValue = "",
                               categoryId = "",
                               categoryValue = "",
                               descriptionValue = "",
                               textButton = "Sauvegarder"
                           }) {
    //Hooks
    let navigate = useNavigate();
    const [treeData, setTreeData] = useState([]);
    const [categoryTreeValue, setcategoryTreeValue] = useState(categoryId);
    const [treeSelectOpen, setTreeSelectOpen] = useState(false)

    useQuery("categorieslist", fetchCategories, {
        onSuccess: (data) => {
            setTreeData(data?.data.map((category) => genTreeNode(category)))
        }
    })

   /*useEffect(() => {
        form.setFieldsValue({category : categoryId});
        console.log(categoryId);
    }, []);*/

    //On Change Braft Editor
    const onChangeBraft = (value) => {
        if (value.toHTML() !== "<p></p>") {
            form.setFieldsValue({'description': value})
        } else {
            form.setFieldsValue({'description': ""})
        }
    };

    const genTreeNode = ({parent, categoryId, name, hasChild}) => {
        return {
            id: categoryId,
            pId: parent,
            value: categoryId,
            title: name,
            isLeaf: !hasChild
        };
    };

    const handleCancel = () => {
        form.resetFields();
        navigate(-1);
    };

    const checkSubTree = (id) => {
        let matches = [];
        matches = treeData.filter((value) => value.pId === id)

        return matches.length > 0
    }

    const onChangeCategoryTree = (newValue) => {
        setcategoryTreeValue(newValue);
    };

    const onLoadData = ({id}) =>
        new Promise((resolve) => {
            if (treeSelectOpen && !checkSubTree(id)) {
                fetch(API_URL + "tickets/categories/" + id + "/subcategories").then(
                    res => res.json()
                ).then(
                    data => {
                        let arr = [];
                        for (let d of data) {
                            arr.push(genTreeNode(d))
                        }
                        resolve(setTreeData(treeData.concat(arr)));
                    }
                )
            } else {
                resolve();
            }

        });

    return (
        <>
            <Form.Item
                label="Titre"
                name="title"
                rules={[{required: true, message: "Insérez un titre"}]}
                initialValue={articleValue}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                label="Catégorie"
                name="category" initialValue={categoryTreeValue}
                rules={[{ required: true, message: 'Choisir une catégorie!' }]}
            >
                <TreeSelect
                    treeDataSimpleMode
                    style={{width: '100%'}}
                    value={categoryTreeValue}
                    dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                    placeholder="Choisir la catégorie"
                    onChange={onChangeCategoryTree}
                    loadData={onLoadData}
                    treeData={treeData}
                    onDropdownVisibleChange={(open) => setTreeSelectOpen(open)}
                />
            </Form.Item>
            <Form.Item label="Description" name="description"
                       rules={[{required: true, message: "Insérez la description de l'article"}]}
                       initialValue={BraftEditor.createEditorState(descriptionValue)}>
                <BraftEditor language="fr"
                             contentStyle={{height: 300, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                             onChange={onChangeBraft} fixPlaceholder={true}/>
            </Form.Item>
            <Form.Item style={{textAlign: "right"}}>
                <Space size="middle">
                    <Button size="large" type="default" htmlType="reset" onClick={handleCancel}>Annuler</Button>
                    <Button size="large" type="primary" htmlType="submit">{textButton}</Button>
                </Space>
            </Form.Item>
        </>
    );
}

export default KnowledgeBaseForm