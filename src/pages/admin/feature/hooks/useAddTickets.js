import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

 const addTickets = (ticket) => {
        return axios.post(API_URL+"ticket", ticket)
    }

export const useAddTickets = () => {
    const queryClient = useQueryClient();
        return useMutation(addTickets, {
            onSuccess: () => {
                queryClient.invalidateQueries("waitlist");
            }
        });
    }