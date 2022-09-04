import { useMutation } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const editTitleandDescription = (elt) => {
    return axios.patch(API_URL+`ticket/${elt.id}`, { title: elt.title, description: elt.description })
}

export const useEditTicketTitleAndDescription = () => {
    return useMutation(editTitleandDescription);
}