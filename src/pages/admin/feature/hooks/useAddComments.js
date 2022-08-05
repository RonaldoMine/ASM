import {useMutation} from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const addComments = (comment) => {
        return axios.post(API_URL+"comments", comment)
    }

export const useAddComments = () => {
        return useMutation(addComments);
    }