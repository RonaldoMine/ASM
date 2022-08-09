import {useNavigate, useParams} from "react-router-dom";
import {
    Button,
    Col,
    Collapse,
    Comment,
    Form, List,
    PageHeader,
    Row,
    Segmented,
    Select,
    Space,
    Tooltip,
    Input,
    Typography, Avatar, Timeline, Card
} from "antd";
import {DeleteOutlined, SmileOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import BraftEditor from "braft-editor";
import moment from "moment";
import CustomAvatarUser from "../CustomAvatarUser";

const {Panel} = Collapse;
const {TextArea} = Input;

function TicketDetail() {
    //Hooks
    const {id} = useParams();
    const [form] = Form.useForm();
    let navigate = useNavigate();
    const [comments, setComments] = useState([]); // List of comment
    const [submittingComment, setSubmitting] = useState(false); // Comment Button to make loader
    const [submittingForm, setSubmittingForm] = useState(false); // Comment Button to make loader
    const [comment, setComment] = useState(''); // Value Comment
    const [title, setEditableTitle] = useState(""); // Manage Typography editable
    const [activity, setActivity] = useState("Commentaires"); // Manage segmented
    useEffect(() => {
        setEditableTitle(ticket.title)
    }, []);

    //Data
    let ticket = {
        id: id,
        title: "Lorem ipsum",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.\n",
        reporter: "Marc",
        assignee: "Ronaldo",
        status: "Assigné",
        priority: "Urgent",
        category: "Infrastructure",
        impact: "Crustial",
    };
    //Function
    //Event change Braft Editor
    const onChangeBraft = (value) => {
        if (value.toHTML() !== "<p></p>") {
            form.setFieldsValue({'description': value})
        } else {
            form.setFieldsValue({'description': ""})
        }
    };
    //Display comments
    const CommentList = ({comments}) => (
        <List
            dataSource={comments}
            header={`${comments.length} ${comments.length > 1 ? 'commentaires' : 'commentaire'}`}
            itemLayout="horizontal"
            renderItem={(props) => <Comment {...props} />}
        />
    );
    //Form comment
    const Editor = ({onChange, onSubmit, submitting, value}) => (
        <>
            <Form.Item>
                <TextArea rows={4} style={{resize: "none"}} onChange={onChange} value={value}/>
            </Form.Item>
            <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
                    Commenter
                </Button>
            </Form.Item>
        </>
    );

    //Submit form comment
    const handleSubmitComment = () => {
        if (!comment) return;
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setComment('');
            setComments([
                ...comments,
                {
                    author: 'Han Solo',
                    avatar: 'https://joeschmoe.io/api/v1/random',
                    content: <p>{comment}</p>,
                    datetime: moment().fromNow(),
                },
            ]);
        }, 1000);
    };

    //Submit Edit ticket Form
    const submitForm = (fields) => {
        let {description} = fields;
        console.log(description.toHTML());
        console.log(title);
        console.log(ticket.status);
    }
    //Event change content comment value
    const handleChangeComment = (e) => {
        setComment(e.target.value);
    };
    return (
        <>
            <PageHeader
                onBack={() => navigate(-1)}
                extra={[<Tooltip key="delete" title="Supprimer"><Button danger type="link" onClick={() => {
                }} icon={<DeleteOutlined/>}></Button> </Tooltip>]}
            />
            <Row>
                <Col span={16} style={{paddingRight: 70}}>
                    <Form
                        layout='vertical'
                        form={form}
                        onFinish={submitForm}
                    >
                        <Typography.Title
                            editable={{
                                onChange: setEditableTitle,
                                triggerType: "text"
                            }} level={4}>{title}</Typography.Title>
                        <Form.Item label="Description" name="description"
                                   rules={[{required: true, message: "Insérez la description de l'article"}]}
                                   initialValue={BraftEditor.createEditorState(ticket.description)}
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
                    </Form>
                    <div>
                        <p>Activité</p>
                        <Segmented options={['Commentaires', 'Historique']} onChange={(value) => setActivity(value)}/>
                        {activity === "Commentaires" ?
                            <div className="comments">
                                {comments.length > 0 && <CommentList comments={comments}/>}
                                <Comment
                                    avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo"/>}
                                    content={
                                        <Editor
                                            onChange={handleChangeComment}
                                            onSubmit={handleSubmitComment}
                                            submitting={submittingComment}
                                            value={comment}
                                        />
                                    }
                                />
                            </div> :
                            <Card style={{marginTop: 20}}>
                                <div className="history">
                                    <Timeline>
                                        <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                                        <Timeline.Item color="green">Create a services site 2015-09-01</Timeline.Item>
                                        <Timeline.Item color="red">
                                            <p>Solve initial network problems 1</p>
                                            <p>Solve initial network problems 2</p>
                                            <p>Solve initial network problems 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item>
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="gray">
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="gray">
                                            <p>Technical testing 1</p>
                                            <p>Technical testing 2</p>
                                            <p>Technical testing 3 2015-09-01</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="#00CCFF" dot={<SmileOutlined/>}>
                                            <p>Custom color testing</p>
                                        </Timeline.Item>
                                    </Timeline>
                                </div>
                            </Card>}

                    </div>
                </Col>
                <Col span={8} style={{padding: 5}}>
                    <div>
                        <Select defaultValue={ticket.status} style={{width: 120, marginBottom: 15}}
                                onChange={(value) => {
                                    ticket.status = value
                                }}>
                            <Select.Option value="Assigné">Assigné</Select.Option>
                            <Select.Option value="En cours">En cours</Select.Option>
                            <Select.Option value="Résolu">Résolu</Select.Option>
                            <Select.Option value="Fermé">Fermé</Select.Option>
                        </Select>
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
                                            <CustomAvatarUser value={ticket.assignee}/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Reporter
                                        </Col>
                                        <Col span="16">
                                            <CustomAvatarUser value={ticket.reporter} color="#1890ff"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Status
                                        </Col>
                                        <Col span="16">
                                            {ticket.priority}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Catégorie
                                        </Col>
                                        <Col span="16">
                                            {ticket.category}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span="8">
                                            Impact
                                        </Col>
                                        <Col span="16">
                                            {ticket.impact}
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