import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const addComment = (comment) => {
    return axios.post(API_URL+"comments", comment)
}

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation(addComment, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["ticketComment", data.data.ticket_id]);
        }
    });
}