import axios from "axios";
import { getError } from "../errorMap";
import TokenService from "@/domain/services/TokenService";
import {Token} from "@/domain/entity/Token/token";
import container from "@/presentation/config/inversify.config";
import RefreshTokenUseCase from "@/domain/interactors/Auth/RefreshTokenUseCase";
import UseCaseTypes from "@/domain/entity/Types/UseCaseTypes";

const axPrivate = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    withXSRFToken: true,
    xsrfCookieName: 'xdtoken',
    xsrfHeaderName: 'xdtoken',
    headers: {
        "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY
    }
})

axPrivate.interceptors.request.use(
    async (config) => {
        const token = await TokenService.getToken();
        if (token !== null) {
            config.headers.Authorization = `Bearer ${token.accessToken}`
        }
        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

let isRefreshing = false;
let refreshSubscribers: Array<(token: Token) => void> = [];
let refreshAttempts = 0;

axPrivate.interceptors.response.use(
    undefined,
    error =>{
        const { config, response: { status } } = error;
        const originalRequest = config;
        if (status === 401) {
            if(config.url.includes('refresh-token')){
                clearTokensAndRedirectToLogin()
            }

            if (!isRefreshing) {
                isRefreshing = true;
                refreshToken().then((newToken: Token) => {
                    isRefreshing = false;
                    onRefreshed(newToken);
                    refreshSubscribers = [];
                }).catch(() =>{
                    clearTokensAndRedirectToLogin()
                });
            }

            refreshAttempts++;

            if (refreshAttempts >= 6) {
                clearTokensAndRedirectToLogin();
                return Promise.reject(error);
            }

            return new Promise(resolve => {
                subscribeTokenRefresh((token: Token) => {
                    originalRequest.headers.Authorization = `Bearer ${token.accessToken}`;
                    resolve(axPrivate(originalRequest));
                });
            });
        }

        const mappedError = getError(error);
        return mappedError ? Promise.reject(mappedError) : Promise.reject(error);
    }
)

let isLoggedOut = false;

async function clearTokensAndRedirectToLogin() {
    if (!isLoggedOut) {
        isLoggedOut = true;
        await TokenService.clearToken();
        sessionStorage.clear();
        window.location.href = '/';
    }
}

function subscribeTokenRefresh(cb: (token: Token) => void) {
    refreshSubscribers.push(cb);
}

function onRefreshed(token: Token) {
    refreshSubscribers.forEach(cb => cb(token));
    refreshAttempts = 0;
}

function refreshToken() {
    const refreshTokenUseCase = container.get<RefreshTokenUseCase>(UseCaseTypes.RefreshTokenUseCase);
    return refreshTokenUseCase.refresh()
        .then(response => {
            return response;
        });
}

export default axPrivate
