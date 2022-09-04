import { useMutation } from 'react-query'
import axios from 'axios'
import {API_URL} from "../../../../global/axios";

const editArticle = (elt) => {
    return axios.patch(API_URL+`article/${elt.id}`, { title: elt.title, categoryId: elt.categoryId, content: elt.content })
}

export const useEditArticle = () => {
    return useMutation(editArticle);
}