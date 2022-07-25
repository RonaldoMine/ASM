import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

 const addTickets = (ticket) => {
        return axios.post("http://localhost:4000/tickets", ticket)
    }

export const useAddTickets = () => {
    const queryClient = useQueryClient();
        return useMutation(addTickets, {
            onSuccess: () => {
                queryClient.invalidateQueries("mytickets");
            }
        });
    }