import axios from "axios"
import { useMutation, useQueryClient } from "react-query"

const patchTickets = (ticket) => axios.patch(`http://localhost:4000/tickets/${ticket.ticketId}`, {status: ticket.status})

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