import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const addComments = ({ticket_id, comment}) => {
        return axios.post(API_URL+`ticket/${ticket_id}/comment`, comment)
    }


export const useAddComments = (queryKey) => {
    const queryClient = useQueryClient();
        return useMutation(addComments, {
            onSuccess: (comment) => {
                queryClient.invalidateQueries(queryKey);
            }
        });
    }