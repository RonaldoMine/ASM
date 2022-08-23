import {useQuery} from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const fetchTicketData = ({ queryKey }) => {
    const ticketId = queryKey[1];
    return axios.get(API_URL+`tickets/${ticketId}`)
}

export const useGetTicketData = (ticketId) => {

    //const qc = useQueryClient();

    return useQuery(['ticketData', ticketId], fetchTicketData, {
       /* initialData: () => {
            const ticket = qc.getQueryData('waitlist')?.data?.find(ticket => ticket.id === parseInt(ticketId));

            if (ticket) {
                return {data: ticket}
            }
            else {
                return undefined
            }
        }*/
    })
}