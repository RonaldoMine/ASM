import {useNavigate, useParams} from "react-router-dom";
import {
    Avatar,
    Button,
    Card,
    Col,
    Collapse,
    Comment,
    Form,
    Input,
    List,
    message,
    PageHeader,
    Row,
    Segmented,
    Select,
    Space,
    Timeline,
    Tooltip,
    Typography
} from "antd";
import {DeleteOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import BraftEditor from "braft-editor";
import CustomAvatarUser from "../../components/custom/CustomAvatarUser";
import {useGetTicketData} from "../hooks/useGetTicketData";
import {useEditStatus} from "../hooks/useEditStatus";
import axios from "axios";
import {useQuery} from "react-query";
import {useEditTicketTitleAndDescription} from "../hooks/useEditTicketTitleAndDescription";
import {useUpdateStatus} from "../hooks/useUpdateStatus";
import CustomLoader from "../../components/custom/CustomLoader";
import {useAddComments} from "../hooks/useAddComments";
import {API_URL} from "../../../../global/axios";
import moment from "moment";
import useAuth from "../../../../auth/hook/useAuth";

const { Panel } = Collapse;
const { TextArea } = Input;

function TicketDetail() {
    //Hooks
    const { ticketId } = useParams();//url ticket id param

    const [submittingComment, setSubmitting] = useState(false); // Comment Button to make loader
    const [submittingForm, setSubmittingForm] = useState(false); // Comment Button to make loader
    const [comment, setComment] = useState(''); // Value Comment
    const [title, setEditableTitle] = useState(""); // Manage Typography editable
    const [activity, setActivity] = useState("Commentaires"); // Manage segmented

    const { data: ticket, isLoading } = useGetTicketData(ticketId);//get ticket data
    const { mutate: editTitleandDescription } = useEditTicketTitleAndDescription();//edit ticket title and description
    const { mutate: addComments } = useAddComments();//add comment
    const { mutate: editStatus } = useEditStatus();//add status
    const { auth } = useAuth(); // Get Auth


    //fetch ticket comments
    const fetchTicketComment = () => {

        return axios.get(API_URL+`ticket/${ticketId}/comments`);
    }

    const { data: ticketCommentData, isLoading: loadingComment } = useQuery(["ticketComment", ticketId], fetchTicketComment)

    //fetch ticket history
    const fetchTicketHistory = () => {

        return axios.get(API_URL+`history?item_id=${ticketId}`)
    }

    const { data: ticketHistoryData, isLoading: loadingHistory, refetch } = useQuery(["ticketHistory", ticketId], fetchTicketHistory, {
        enabled: false
    })


    const { mutate: updateState } = useUpdateStatus();

    //side effect, set title
    useEffect(() => {
        setEditableTitle(ticket?.data.title)

    }, [ticket?.data.title])

    //side effect, load history
    useEffect(() => {
        if (activity === "Historique") refetch();
    }, [activity])


    const [form] = Form.useForm();
    let navigate = useNavigate();

    //Function
    //Event change Braft Editor
    const onChangeBraft = (value) => {
        if (value.toHTML() !== "<p></p>") {
            form.setFieldsValue({ 'description': value })
        } else {
            form.setFieldsValue({ 'description': "" })
        }
    };
    //Close ticket
    const closeTicket = () => {
        updateState({ id: ticketId, status: "Fermé" })
        navigate(-1);
        message.success("ticket fermé");
    }

    //Display comments
    const CommentList = ({ comments }) => ( comments &&
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'commentaires' : comments.length <= 1 && 'commentaire'}`}
            itemLayout="horizontal"
            renderItem={(props) => <Comment avatar={<Avatar style={{ background: "#1890ff", color: "#fff" }}>{props.author[0].toUpperCase()}</Avatar>} author={props.author} content={props.content} datetime={moment(props.createdAt).fromNow()} />}
        />
    );

    //Submit form comment
    const handleSubmitComment = () => {
        if (!comment) return;
        setSubmitting(true);
        setComment('');
        let data = { ticket_id: ticketId, comment: {content: comment, author: auth.username} }
        addComments(data);
        setSubmitting(false);
    };

    //Submit Edit ticket Form
    const submitForm = (fields) => {
        let { description } = fields;
        setSubmittingForm(true);
        editTitleandDescription({ id: ticketId, title: title, description: description.toHTML() })
        setSubmittingForm(false);
        message.success("Modification prise en compte");
    }
    //Event change content comment value
    const handleChangeComment = (e) => {
        setComment(e.target.value);
    };
    if (isLoading) return (<CustomLoader />)
    return (
        <>
            <PageHeader
                onBack={() => navigate(-1)}
                extra={[<Tooltip key="delete" title="Fermer"><Button danger type="link" onClick={closeTicket}
                    icon={<DeleteOutlined />}></Button> </Tooltip>]}
            />
            <Row>
                <Col span={16} style={{ paddingRight: 70 }}>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={submitForm}
                    >
                        <Typography.Title
                            editable={{
                                onChange: setEditableTitle,
                                triggerType: "text",
                            }} level={4}>{title}</Typography.Title>
                        <Form.Item label="Description" name="description"
                            rules={[{ required: true, message: "Insérez la description de l'article" }]}
                            initialValue={BraftEditor.createEditorState(ticket?.data.description)}
                        >
                            <BraftEditor language="fr"
                                contentStyle={{ height: 200, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                                onChange={onChangeBraft} fixPlaceholder={true} />
                        </Form.Item>
                        <Form.Item>
                            <Button htmlType="submit" loading={submittingForm} type="primary">
                                Modifier
                            </Button>
                        </Form.Item>
                    </Form>
                    <div>
                        <p>Activité</p>
                        <Segmented options={['Commentaires', 'Historique']} onChange={(value) => setActivity(value)} />
                        {activity === "Commentaires" ?
                            <div className="comments">
                                {loadingComment ? <CustomLoader /> : <CommentList comments={ticketCommentData?.data} />}
                                <Comment
                                    content={
                                        (<>
                                            <Form.Item>
                                                <TextArea key="textareaComment" rows={4} style={{ resize: "none" }}
                                                    onChange={handleChangeComment} value={comment} />
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType="submit" loading={submittingComment}
                                                    onClick={handleSubmitComment} type="primary">
                                                    Commenter
                                                </Button>
                                            </Form.Item>
                                        </>)
                                    }
                                />
                            </div> : loadingHistory ? <CustomLoader /> :
                                <Card style={{ marginTop: 20 }} bordered={false}>
                                    <div className="history">
                                        <Timeline>
                                            {ticketHistoryData?.data.map(event => {
                                                return (<Timeline.Item key={event.id} color="gray">{event.message}</Timeline.Item>)
                                            })}
                                        </Timeline>
                                    </div>
                                </Card>}

                    </div>
                </Col>
                <Col span={8} style={{ padding: 5 }}>
                    <div>
                        <Select defaultValue={ticket?.data.status.statusLabel} style={{ width: 120, marginBottom: 15 }}
                            onChange={(status) => {
                                editStatus({ id: ticket?.data.id, status: status })
                            }}>
                            <Select.Option value="Assigné">Assigné</Select.Option>
                            <Select.Option value="En cours">En cours</Select.Option>
                            <Select.Option value="Résolu">Résolu</Select.Option>
                            <Select.Option value="Fermé">Fermé</Select.Option>
                        </Select>
                    </div>
                    <Space size="small" direction="vertical" style={{ display: "flex" }}>
                        <Collapse expandIconPosition="end" defaultActiveKey={['1']} onChange={() => {
                        }}>
                            <Panel header="Details" key="1">
                                <Space size="large" style={{ display: "flex" }} direction="vertical">
                                    <Row>
                                        <Col span="8">
                                            Assigné
                                        </Col>
                                        <Col span="16">
                                            <CustomAvatarUser value={ticket?.data.assigned_to} />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Reporter
                                        </Col>
                                        <Col span="16">
                                            <CustomAvatarUser value={ticket?.data.reporter} color="#1890ff" />
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Status
                                        </Col>
                                        <Col span="16">
                                            {ticket?.data.status.statusLabel}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Catégorie
                                        </Col>
                                        <Col span="16">
                                            {ticket?.data.category.name}
                                        </Col>
                                    </Row>
                                </Space>
                            </Panel>
                        </Collapse>
                    </Space>
                </Col>
            </Row>
        </>
    );
}

export default TicketDetail