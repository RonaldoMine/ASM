import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'

const addComment = (comment) => {
    return axios.post("http://localhost:4000/comments", comment)
}

export const useAddComment = () => {
    const queryClient = useQueryClient();
    return useMutation(addComment, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(["ticketComment", data.data.ticket_id]);
        }
    });
}