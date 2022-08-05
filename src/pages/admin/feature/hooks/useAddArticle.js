import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const addArticle = (article) => {
    return axios.post(API_URL+"kb_article", article)
}

export const useAddArticle = () => {

    const queryClient = useQueryClient();

    return useMutation(addArticle, {
        onSuccess: () => {
            queryClient.invalidateQueries(["articles", "2"]);
        }
    });
}