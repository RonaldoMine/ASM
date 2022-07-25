import { useMutation } from 'react-query'
import axios from 'axios'

const editStatus = (elt) => {
    return axios.patch(`http://localhost:4000/tickets/${elt.id}`, { status: elt.status })
}

export const useEditStatus = () => {
    return useMutation(editStatus);
}