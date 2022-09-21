import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const updateStatus = (elt) => {
    return axios.patch(API_URL+`tickets/status/update?ticketId=${elt.id}&statusId=${elt.status}&note=${elt.note}`)
}

export const useUpdateStatus = (queryKey = "waitlist") => {
    const queryClient = useQueryClient();
    return useMutation(updateStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries(queryKey);
        }
    });
}