import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchTicketData = ({ queryKey }) => {
    const ticketId = queryKey[1];
    return axios.get(`http://localhost:4000/tickets/${ticketId}`)
}

export const useEditTicketData = (ticketId) => {

    const qc = useQueryClient();

    return useQuery(['ticketData', ticketId], fetchTicketData, {
        initialData: () => {
            const ticket = qc.getQueryData('waitlist')?.data?.find(ticket => ticket.id === parseInt(ticketId));

            if (ticket) {
                return {data: ticket}
            }
            else {
                return undefined
            }
        }

    })




}