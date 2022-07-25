import { useMutation } from 'react-query'
import axios from 'axios'

const editTitleandDescription = (elt) => {
    return axios.patch(`http://localhost:4000/tickets/${elt.id}`, { title: elt.title, description: elt.description })
}

export const useEditTicketTitleAndDescription = () => {
    return useMutation(editTitleandDescription);
}