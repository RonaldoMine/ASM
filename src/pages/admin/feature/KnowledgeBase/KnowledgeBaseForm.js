import {Button, Form, Input, Select, Space} from "antd";
import BraftEditor from "braft-editor";
import {useNavigate} from "react-router-dom";

function KnowledgeBaseForm({ form, articleValue = "", categoryValue = "", descriptionValue = "", textButton = "Sauvegarder" }) {
    //Hooks
    let navigate = useNavigate();

    //On Change Braft Editor
    const onChangeBraft = (value) => {
        if (value.toHTML() !== "<p></p>") {
            form.setFieldsValue({ 'description': value })
        } else {
            form.setFieldsValue({ 'description': "" })
        }
    };
    const handleCancel = () => {
        form.resetFields();
        navigate(-1);
    };


    return (
        <>
            <Form.Item
                label="Titre"
                name="title"
                rules={[{ required: true, message: "Insérez un titre" }]}
                initialValue={articleValue}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Catégorie"
                name="category" initialValue={categoryValue}>
                <Select name="category">
                    <Select.Option value="" disabled>
                        Sélectionnez une catégorie
                    </Select.Option>
                    <Select.Option value="Infrastructure">
                        Infrastructure
                    </Select.Option>
                    <Select.Option value="Reseau">
                        Reseau
                    </Select.Option>
                </Select>
            </Form.Item>
            <Form.Item label="Description" name="description"
                rules={[{ required: true, message: "Insérez la description de l'article" }]}
                initialValue={BraftEditor.createEditorState(descriptionValue)}>
                <BraftEditor language="fr"
                    contentStyle={{ height: 300, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                    onChange={onChangeBraft} fixPlaceholder={true} />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
                <Space size="middle" >
                    <Button size="large" type="default" htmlType="reset" onClick={handleCancel}>Annuler</Button>
                    <Button size="large" type="primary" htmlType="submit">{textButton}</Button>
                </Space>
            </Form.Item>
        </>
    );
}

export default KnowledgeBaseForm