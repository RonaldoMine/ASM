import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar, Button, PageHeader, Tag, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./KnowledgeBase.css";
import CustomLoader from "../../components/custom/CustomLoader";
import { useGetArticle } from "../hooks/useGetArticle";

function KnowledgeBaseDetail() {

    const { articleId } = useParams();

    let navigate = useNavigate();

    const back = () => {
        navigate(-1)
    }

    const { data: article, isLoading } = useGetArticle(articleId);

    // const article = {
    //     id: id,
    //     article: "What is Lorem Ipsum? is simply dummy text of the printing and  typesetting industry",
    //     description: "<p> What is Lorem Ipsum?<br/> <strong>Lorem Ipsum</strong> is simply dummy text of the printing and  typesetting industry. Lorem Ipsum has been the industry&#x27;s standard  dummy text ever since the 1500s, when an unknown printer took a galley  of type and scrambled it to make a type specimen book. It has survived  not only five centuries, but also the leap into electronic typesetting,  remaining essentially unchanged. It was popularised in the 1960s with  the release of Letraset sheets containing Lorem Ipsum passages, and more  recently with desktop publishing software like Aldus PageMaker  including versions of Lorem Ipsum.<br/> </p><p>Articles</p><ol><li>Tennis</li><li>Chapeau</li></ol>",
    //     category: "Reseau",
    //     created_At: new Date().toDateString(),
    //     updated_At: new Date().toDateString()
    // }
    if (isLoading) return (<CustomLoader />)

    return (
        <>
            <PageHeader
                title={article.data.title}
                onBack={() => navigate(-1)}
                extra={[
                    <Tooltip key="edit" title="Modifier"><Link to={`/admin/info/knowledge_base/edit/${articleId}`}><EditOutlined /></Link> </Tooltip>,
                    <Tooltip key="delete" title="Fermer"><Button danger type="link" onClick={() => {
                    }} icon={<DeleteOutlined />}></Button> </Tooltip>]}
            />
            <div className="header_avatar"><Avatar>R</Avatar>
                <div>
                    <p><span>Crée par ronaldo9092</span></p>
                    <p><small>{article.data.created_at}</small></p>
                </div>
            </div>
            <Tag>{article.data.category}</Tag>
            <div className="main-content_description" dangerouslySetInnerHTML={{ __html: article.data.content }}></div>
            <br />
            <Button size="large" type="primary" htmlType="reset" onClick={back}>Retour</Button>
        </>
    );
}

export default KnowledgeBaseDetail