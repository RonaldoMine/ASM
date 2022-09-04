import {useMutation, useQueryClient} from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const addArticle = (datas) => {
    return axios.post(API_URL + `article?kbId=` + datas.kbId, datas.article)
}

export const useAddArticle = (knowledgeBaseId) => {

    const queryClient = useQueryClient();

    return useMutation(addArticle, {
        onSuccess: () => {
            queryClient.invalidateQueries(["articles", knowledgeBaseId]);
        }
    });
}