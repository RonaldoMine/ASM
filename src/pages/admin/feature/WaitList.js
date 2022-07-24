import { PageHeader, Select, Table } from 'antd';
import { useQuery } from 'react-query'
//import { data as dt } from '../../../mockdata/TicketData'
import axios from 'axios'
import { columns } from '../Columns'


function WaitList() {

    const fetchWaitlist = () => {

        return axios.get("http://192.168.100.17:4000/tickets?resolved=false&closed_at=")
    }

    const { data: waitlist } = useQuery("waitlist", fetchWaitlist)

    return (
        <>
            <PageHeader
                title="Tous les tickets"
                extra={[<Select key={1} defaultValue={"Exporter"} style={{ width: 100 }} options={[{ label: "PDF", value: "PDF" }, { label: "XLS", value: "XLS" }]}>
                </Select>]}
            />
            <Table columns={columns} rowSelection={{ type: 'checkbox' }} rowKey="id" dataSource={waitlist?.data} className="all-tickets_table" scroll={{ x: "true" }} />

        </>
    )
}

export default WaitList