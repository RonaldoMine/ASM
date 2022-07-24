import {Link, useParams} from "react-router-dom";
import {Button, Col, Form, Input, PageHeader, Row, Tooltip, Typography} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";

function TicketDetail() {
    const {id} = useParams();
    const {TextArea} = Input;
    const [title, setEditableTitle] = useState('Fix Account.');
    return (
        <>
            <PageHeader
                title="Detail du ticket"
                extra={[
                    <Tooltip key="edit" title="Modifier"><Link
                        to={`/admin/info/knowledge_base/edit/${id}`}><EditOutlined/></Link> </Tooltip>,
                    <Tooltip key="delete" title="Supprimer"><Button danger type="link" onClick={() => {
                    }} icon={<DeleteOutlined/>}></Button> </Tooltip>]}
            />
            <Row>
                <Col span={18}>
                    <Form
                        layout='vertical'
                    >
                        <Typography.Title
                            editable={{
                                onChange: setEditableTitle,
                                triggerType: "text"
                            }} level={4}>{title}</Typography.Title>
                        <Form.Item label="Description" name="description">
                            <TextArea rows={4} placeholder="Saisir la description">
                            </TextArea>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={6}>
                    col-18 col-push-6
                </Col>
            </Row>
        </>
    );
}

export default TicketDetail