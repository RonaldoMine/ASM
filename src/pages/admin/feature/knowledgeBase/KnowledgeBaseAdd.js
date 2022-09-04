import {useNavigate, useParams} from "react-router-dom";
import KnowledgeBaseForm from "./KnowledgeBaseForm";
import {Form, message, PageHeader} from "antd";
import {useAddArticle} from "../hooks/useAddArticle";
import useAuth from "../../../../auth/hook/useAuth";

function KnowledgeBaseAdd() {
    // Hooks
    const [form] = Form.useForm();
    let navigate = useNavigate();
    let {knowledgeBaseId} = useParams();
    const {mutate: addArticle} = useAddArticle(knowledgeBaseId);
    const { auth } = useAuth();

    const submitForm = (fields) => {
        let {title, description, category} = fields;
        addArticle({
            article: {
                title: title,
                categoryId: category,
                content: description.toHTML(),
                creator: auth.username
            },
            kbId: knowledgeBaseId
        });
        message.success(`Article ajouté`);
        navigate(-1)
    }
    return (
        <>
            <PageHeader title="Création d'un article" onBack={() => navigate(-1)}/>
            <Form
                name="edit_knowledge"
                layout='vertical'
                autoComplete="off"
                form={form}
                onFinish={submitForm}
            >
                <KnowledgeBaseForm form={form}/>
            </Form>
        </>
    );
}

export default KnowledgeBaseAdd