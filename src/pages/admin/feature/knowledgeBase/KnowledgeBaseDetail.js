import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, PageHeader, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import "./KnowledgeBase.css";
import CustomLoader from "../../components/custom/CustomLoader";
import {useGetArticle} from "../hooks/useGetArticle";
import CustomAvatarUser from "../../components/custom/CustomAvatarUser";
import useAuth from "../../../../auth/hook/useAuth";

function KnowledgeBaseDetail() {
    const { articleId } = useParams();
    let navigate = useNavigate();
    const { data: article, isLoading } = useGetArticle(articleId);
    const  { auth } = useAuth();
    if (isLoading) return (<CustomLoader />)
    return (
        <>
            <PageHeader
                title={article?.data.title}
                onBack={() => navigate(-1)}
                extra={article?.data.creator === auth.username && [
                    <Tooltip key="edit" title="Modifier"><Link to={`/admin/info/knowledge_base/edit/${articleId}`}><EditOutlined /></Link> </Tooltip>,
                    /*<Tooltip key="delete" title="Supprimer"><Button danger type="link" onClick={() => {
                    }} icon={<DeleteOutlined />}></Button> </Tooltip>*/]}
            />
            <div className="header_avatar">
                <div>
                    <CustomAvatarUser value={article?.data.creator} />
                </div>
            </div>
            <Tag>{article?.data.category.name}</Tag>
            <div className="main-content_description" dangerouslySetInnerHTML={{ __html: article?.data.content }}></div>
            <br />
        </>
    );
}

export default KnowledgeBaseDetail