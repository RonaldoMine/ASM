import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

 const addComments = (comment) => {
        return axios.post("http://localhost:4000/comments", comment)
    }

export const useAddComments = () => {
        return useMutation(addComments);
    }