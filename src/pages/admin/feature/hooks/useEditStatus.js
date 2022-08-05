import { useMutation } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const editStatus = (elt) => {
    return axios.patch(API_URL+`tickets/${elt.id}`, { status: elt.status })
}

export const useEditStatus = () => {
    return useMutation(editStatus);
}