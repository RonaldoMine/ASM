import {useNavigate, useParams} from "react-router-dom";
import KnowledgeBaseForm from "./KnowledgeBaseForm";
import {Form, message, PageHeader} from "antd";
import {useGetArticle} from "../hooks/useGetArticle";
import CustomLoader from "../../components/custom/CustomLoader";
import {useEditArticle} from "../hooks/useEditArticle";

function KnowledgeBaseEdit() {
    // Hooks
    const [form] = Form.useForm();
    const {articleId} = useParams()
    let navigate = useNavigate();

    const {data: article, isLoading} = useGetArticle(articleId);
    const {mutate: editArticle} = useEditArticle();

    //Functions
    const submitForm = (fields) => {
        let {description, title, category} = fields;
        editArticle({id: articleId, title: title, categoryId: category, content: description.toHTML()})
        message.success("Modifié avec succès")
    }

    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader
                title={"Modification d'un article"}
                onBack={() => navigate(-1)}/>
            <Form
                name="edit_knowledge"
                layout='vertical'
                autoComplete="off"
                form={form}
                onFinish={submitForm}
            >
                <KnowledgeBaseForm form={form} articleValue={article.data.title}
                                   categoryId={article.data.category.categoryId}
                                   categoryValue={article.data.category.name}
                                   descriptionValue={article.data.content} editorHeight={300} textButton="Modifier"/>
            </Form>
        </>
    );
}

export default KnowledgeBaseEdit