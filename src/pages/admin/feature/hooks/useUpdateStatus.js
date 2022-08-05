import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const updateStatus = (elt) => {
    return axios.patch(API_URL+`tickets/${elt.id}`, { status: elt.status })
}

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();
    return useMutation(updateStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries("waitlist");
        }
    });
}