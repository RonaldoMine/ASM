import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const updateStatus = (elt) => {
    return axios.patch(`http://localhost:4000/tickets/${elt.id}`, { status: elt.status })
}

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();
    return useMutation(updateStatus, {
        onSuccess: () => {
            queryClient.invalidateQueries("waitlist");
        }
    });
}