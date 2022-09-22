import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const assignTicket = (elt) => {
    return axios.patch(API_URL+`ticket/assign?ticketId=${elt.id}&to=${elt.to}`)
}

export const useAssignTicket = (queryKey = "waitlist-incident") => {
    const queryClient = useQueryClient();
    return useMutation(assignTicket, {
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey);
        }
    });
}