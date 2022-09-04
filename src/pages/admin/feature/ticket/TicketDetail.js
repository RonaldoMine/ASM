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
    Popconfirm,
    Row,
    Segmented,
    Select,
    Space,
    Timeline,
    Tooltip,
    Typography
} from "antd";
import {IssuesCloseOutlined, FolderOpenOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import BraftEditor from "braft-editor";
import CustomAvatarUser from "../../components/custom/CustomAvatarUser";
import {useGetTicketData} from "../hooks/useGetTicketData";
import axios from "axios";
import {useQuery} from "react-query";
import {useEditTicketTitleAndDescription} from "../hooks/useEditTicketTitleAndDescription";
import {useUpdateStatus} from "../hooks/useUpdateStatus";
import CustomLoader from "../../components/custom/CustomLoader";
import {useAddComments} from "../hooks/useAddComments";
import {API_URL} from "../../../../global/axios";
import moment from "moment";
import useAuth from "../../../../auth/hook/useAuth";

const {Panel} = Collapse;
const {TextArea} = Input;

//Functions

//fetch ticket comments
const fetchTicketComment = ({queryKey}) => {
    let ticketId = queryKey[1];
    return axios.get(API_URL + `ticket/${ticketId}/comments`);
}

//fetch ticket history
const fetchTicketHistory = ({queryKey}) => {
    let ticketId = queryKey[1];
    return axios.get(API_URL + `history?item_id=${ticketId}`)
}

function TicketDetail() {
    //Hooks
    const {ticketId} = useParams();//url ticket id param

    const [submittingComment, setSubmitting] = useState(false); // Comment Button to make loader
    const [submittingForm, setSubmittingForm] = useState(false); // Comment Button to make loader
    const [comment, setComment] = useState(''); // Value Comment
    const [title, setEditableTitle] = useState(""); // Manage Typography editable
    const [activity, setActivity] = useState("Commentaires"); // Manage segmented

    const {data: ticket, isLoading} = useGetTicketData(ticketId);//get ticket data
    const {mutate: editTitleandDescription} = useEditTicketTitleAndDescription();//edit ticket title and description
    const {mutate: addComments} = useAddComments();//add comment
    const {auth} = useAuth(); // Get Auth
    const {mutate: updateState} = useUpdateStatus(['ticketData', ticketId]);
    const [form] = Form.useForm();
    let navigate = useNavigate();

    const {
        data: ticketCommentData,
        isLoading: loadingComment
    } = useQuery(["ticketComment", ticketId], fetchTicketComment)


    const {
        data: ticketHistoryData,
        isLoading: loadingHistory,
        refetch
    } = useQuery(["ticketHistory", ticketId], fetchTicketHistory, {
        enabled: false
    })

    //side effect, set title
    useEffect(() => {
        setEditableTitle(ticket?.data.title)

    }, [ticket?.data.title])

    //side effect, load history
    useEffect(() => {
        if (activity === "Historique") refetch();
    }, [activity])


    //Function
    //Event change Braft Editor
    const onChangeBraft = (value) => {
        if (value.toHTML() !== "<p></p>") {
            form.setFieldsValue({'description': value})
        } else {
            form.setFieldsValue({'description': ""})
        }
    };
    //Close ticket
    const changeStatus = (status, text) => {
        updateState({id: ticketId, status: status})
        /*if (status === 4) {
            navigate(-1);
        }*/
        message.success(`Ticket ${text}`);

    }

    //Display comments
    const CommentList = ({comments}) => (comments &&
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'commentaires' : comments.length <= 1 && 'commentaire'}`}
            itemLayout="horizontal"
            renderItem={(props) => <Comment
                avatar={<Avatar style={{background: "#1890ff", color: "#fff"}}>{props.author[0].toUpperCase()}</Avatar>}
                author={props.author} content={props.content} datetime={moment(props.createdAt).fromNow()}/>}
        />
    );

    //Submit form comment
    const handleSubmitComment = () => {
        if (!comment) return;
        setSubmitting(true);
        setComment('');
        let data = {ticket_id: ticketId, comment: {content: comment, author: auth.username}}
        addComments(data);
        setSubmitting(false);
    };

    //Submit Edit ticket Form
    const submitForm = (fields) => {
        let {description} = fields;
        setSubmittingForm(true);
        editTitleandDescription({id: ticketId, title: title, description: description.toHTML()})
        setSubmittingForm(false);
        message.success("Modification prise en compte");
    }
    //Event change content comment value
    const handleChangeComment = (e) => {
        setComment(e.target.value);
    };

    function StateButton({status}) {
        if (status === 4) {
            return (<Tooltip key="open" title="Ouvrir"><Popconfirm
                title="Confirmer la réouverture du ticket" okText={"Ouvrir"} cancelText={"Annuler"} placement={'left'}
                onConfirm={() => changeStatus("2", "En cours")}>
                <Button type="link" icon={<FolderOpenOutlined style={{fontSize: 25}}/>}></Button>
            </Popconfirm> </Tooltip>);
        } else {
            return (<Tooltip key="delete" title="Fermer"><Popconfirm
                title="Confirmer la ferméture du ticket" okText={"Fermé"} cancelText={"Annuler"} placement={'left'}
                onConfirm={() => changeStatus("4", "Fermé")}>
                <Button type="link" danger icon={<IssuesCloseOutlined style={{fontSize: 25}}/>}></Button>
            </Popconfirm> </Tooltip>);
        }
    }

    if (isLoading) return (<CustomLoader/>)
    return (
        <>
            <PageHeader
                onBack={() => navigate(-1)}
                extra={[<StateButton key={"button"} status={ticket?.data.status.statusId}/>]}
            />
            <Row>
                <Col span={16} style={{paddingRight: 70}}>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={submitForm}
                    >
                        {ticket?.data.status.statusId !== 4 ? (<>
                            <Typography.Title
                                editable={{
                                    onChange: setEditableTitle,
                                    triggerType: "text",
                                }} level={4}>{title}</Typography.Title>
                            <Form.Item label="Description" name="description"
                                       rules={[{required: true, message: "Insérez la description de l'article"}]}
                                       initialValue={BraftEditor.createEditorState(ticket?.data.description)}
                            >
                                <BraftEditor language="fr"
                                             contentStyle={{height: 200, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)'}}
                                             onChange={onChangeBraft} fixPlaceholder={true}/>
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" loading={submittingForm} type="primary">
                                    Modifier
                                </Button>
                            </Form.Item>
                        </>) : (<>
                            <Typography.Title
                                level={4}>Titre : {title}</Typography.Title>
                            <Typography.Title
                                level={4}>Description</Typography.Title>

                            <p dangerouslySetInnerHTML={{ __html: ticket?.data.description}} style={{textAlign: "justify"}}></p></>)}
                    </Form>
                    <div>
                        <p>Activité</p>
                        <Segmented options={['Commentaires', 'Historique']} onChange={(value) => setActivity(value)}/>
                        {activity === "Commentaires" ?
                            <div className="comments">
                                {loadingComment ? <CustomLoader/> : <CommentList comments={ticketCommentData?.data}/>}
                                {ticket?.data.status.statusId !== 4 && <Comment
                                    content={
                                        (<>
                                            <Form.Item>
                                                <TextArea key="textareaComment" rows={4} style={{resize: "none"}}
                                                          onChange={handleChangeComment} value={comment}/>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button htmlType="submit" loading={submittingComment}
                                                        onClick={handleSubmitComment} type="primary">
                                                    Commenter
                                                </Button>
                                            </Form.Item>
                                        </>)
                                    }
                                />}
                            </div> : loadingHistory ? <CustomLoader/> :
                                <Card style={{marginTop: 20}} bordered={false}>
                                    <div className="history">
                                        <Timeline>
                                            {ticketHistoryData?.data.map(event => {
                                                return (<Timeline.Item key={event.id}
                                                                       color="gray">{event.message}</Timeline.Item>)
                                            })}
                                        </Timeline>
                                    </div>
                                </Card>}

                    </div>
                </Col>
                <Col span={8} style={{padding: 5}}>
                    <div>
                        {ticket?.data.status.statusId !== 4 && <Select defaultValue={ticket?.data.status.statusLabel}
                                                                       style={{width: 120, marginBottom: 15}}
                                                                       onChange={(status, option) => {
                                                                           changeStatus(status, option.children)
                                                                       }}>
                            <Select.Option value="1">Assigné</Select.Option>
                            <Select.Option value="2">En cours</Select.Option>
                            <Select.Option value="3">Résolu</Select.Option>
                        </Select>}
                    </div>
                    <Space size="small" direction="vertical" style={{display: "flex"}}>
                        <Collapse expandIconPosition="end" defaultActiveKey={['1']} onChange={() => {
                        }}>
                            <Panel header="Details" key="1">
                                <Space size="large" style={{display: "flex"}} direction="vertical">
                                    <Row>
                                        <Col span="8">
                                            Assigné
                                        </Col>
                                        <Col span="16">
                                            <CustomAvatarUser value={ticket?.data.assigned_to}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Reporter
                                        </Col>
                                        <Col span="16">
                                            <CustomAvatarUser value={ticket?.data.reporter} color="#1890ff"/>
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