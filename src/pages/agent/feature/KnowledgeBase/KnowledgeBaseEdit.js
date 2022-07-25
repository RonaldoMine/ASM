import {useNavigate, useParams} from "react-router-dom";
import KnowledgeBaseForm from "./KnowledgeBaseForm";
import {Button, Form, PageHeader} from "antd";
import {LeftOutlined} from "@ant-design/icons";

function KnowledgeBaseEdit() {
    // Hooks
    const [form] = Form.useForm();
    const {id} = useParams()
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

    // Datas
    const article = {
        id: id,
        article: "What is Lorem Ipsum? is simply dummy text of the printing and  typesetting industry",
        description: "<p> What is Lorem Ipsum?<br/> <strong>Lorem Ipsum</strong> is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry&#x27;s standard  dummy text ever since the 1500s, when an unknown printer took a galley  of type and scrambled it to make a type specimen book. It has survived  not only five centuries, but also the leap into electronic typesetting,  remaining essentially unchanged. It was popularised in the 1960s with  the release of Letraset sheets containing Lorem Ipsum passages, and more  recently with desktop publishing software like Aldus PageMaker  including versions of Lorem Ipsum.<br/> </p><p>Articles</p><ol><li>Tennis</li><li>Chapeau</li></ol>",
        category: "Reseau",
        created_At: new Date().toDateString(),
        updated_At: new Date().toDateString()
    }
    return (
        <>
            <PageHeader extra={[<Button key="back" type="link" onClick={() => back()} icon={<LeftOutlined/>}> Retour</Button>]}/>
            <Form
                name="edit_knowledge"
                layout='vertical'
                autoComplete="off"
                form={form}
                onFinish={submitForm}
            >
                <KnowledgeBaseForm form={form} articleValue={article.article} categoryValue={article.category}
                                   descriptionValue={article.description} editorHeight={300} textButton="Modifier"/>
            </Form>
        </>
    );
}

export default KnowledgeBaseEdit