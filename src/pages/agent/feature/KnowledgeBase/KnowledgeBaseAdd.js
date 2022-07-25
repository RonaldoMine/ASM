import {useNavigate} from "react-router-dom";
import KnowledgeBaseForm from "./KnowledgeBaseForm";
import {Button, Form, PageHeader} from "antd";
import {LeftOutlined} from "@ant-design/icons";

function KnowledgeBaseAdd() {
    // Hooks
    const [form] = Form.useForm();
    let navigate = useNavigate();

    //Functions
    const back = () => {
        navigate(-1)
    }

    const submitForm = (fields) => {
        let {title, description, category} = fields;
        console.log(title);
        console.log(category);
        console.log(description.toHTML());
    }
    return (
        <>
            <PageHeader title="Création d'un article" extra={[<Button key="back" type="link" onClick={() => back()} icon={<LeftOutlined/>}> Retour</Button>]}/>
            <Form
                name="edit_knowledge"
                layout='vertical'
                autoComplete="off"
                form={form}
                onFinish={submitForm}
            >
                <KnowledgeBaseForm form={form} />
            </Form>
        </>
    );
}

export default KnowledgeBaseAdd