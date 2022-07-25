import {Link, useParams} from "react-router-dom";
import {Avatar, Button, PageHeader, Tag, Tooltip} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import "./KnowledgeBase.css";

function KnowledgeBaseDetail() {
    const {id} = useParams();
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
            <PageHeader
                title={article.article}
                extra={[
                    <Tooltip key="edit" title="Modifier"><Link to={`/admin/info/knowledge_base/edit/${id}`}><EditOutlined/></Link> </Tooltip>,
                    <Tooltip key="delete" title="Supprimer"><Button danger type="link" onClick={() => {
                    }} icon={<DeleteOutlined/>}></Button> </Tooltip>]}
            />
            <div className="userCreate"><Avatar>R</Avatar>
                <p><p>Crée par ronaldo9092</p><p><small>{article.created_At}</small></p></p>
            </div>
            <Tag>{article.category}</Tag>
            <div className="contentDescription" dangerouslySetInnerHTML={{__html: article.description}}></div>
        </>
    );
}

export default KnowledgeBaseDetail