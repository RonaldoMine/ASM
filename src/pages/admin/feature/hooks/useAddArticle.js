import { useMutation, useQueryClient } from 'react-query'
import axios from 'axios'

const addArticle = (article) => {
    return axios.post("http://localhost:4000/kb_article", article)
}

export const useAddArticle = () => {

    const queryClient = useQueryClient();

    return useMutation(addArticle, {
        onSuccess: () => {
            queryClient.invalidateQueries(["articles", "2"]);
        }
    });
}