import { useQuery, useQueryClient } from 'react-query'
import axios from 'axios'

const fetchArticleData = ({ queryKey }) => {
    const articleId = queryKey[1];
    return axios.get(`http://localhost:4000/kb_article/${articleId}`)
}

export const useGetArticle= (articleId) => {

    const qc = useQueryClient();

    return useQuery(['articleData', articleId], fetchArticleData, {
        initialData: () => {
            const article = qc.getQueryData(["articles", "2"])?.data?.find(article => article.id === parseInt(articleId));

            if (article) {
                return { data: article }
            }
            else {
                return undefined
            }
        }

    })




}