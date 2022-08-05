import axios from "axios"
import { useMutation, useQueryClient } from "react-query"
import {API_URL} from "../../../../global/axios";

const patchTickets = (ticket) => axios.patch(API_URL+`tickets/${ticket.ticketId}`, {status: ticket.status})

export const useResolveSelectedTickets = () => {

    const queryClient = useQueryClient();
    return useMutation(
        patchTickets, {
        onSuccess: () => {
            queryClient.invalidateQueries(['waitlist']);
        }
    }
    )
} 