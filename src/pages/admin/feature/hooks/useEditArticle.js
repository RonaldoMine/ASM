import { useMutation } from 'react-query'
import axios from 'axios'

const editArticle = (elt) => {
    return axios.patch(`http://localhost:4000/kb_article/${elt.id}`, { title: elt.title, category: elt.category, content: elt.content })
}

export const useEditArticle = () => {
    return useMutation(editArticle);
}