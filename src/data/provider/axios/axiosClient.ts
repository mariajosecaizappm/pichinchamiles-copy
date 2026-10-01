import axios from "axios"
import {getError} from "../errorMap"

const ax = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'xdtoken',
    xsrfHeaderName: 'xdtoken',
    headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY
    }
})

ax.interceptors.response.use(undefined, error => {
    throw getError(error)
})

export default ax
