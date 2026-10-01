import {Token} from "@/domain/entity/Token/token";

export default class TokenService{
    private static readonly tokenKey = '6ef85843-e7ee-4074-bddd-35fea1305ea2';

    static async getToken(): Promise<Token | null>{
        const encryptedStorageToken = localStorage.getItem(TokenService.tokenKey);
        const storageToken = encryptedStorageToken ? atob(encryptedStorageToken) : null;
        return storageToken ? JSON.parse(storageToken) : null
    }

    static async setToken(token: Token): Promise<void>{
        const encryptedStorageToken = btoa(JSON.stringify(token));
        localStorage.setItem(TokenService.tokenKey, encryptedStorageToken);
    }

    static async clearToken(): Promise<void>{
        localStorage.removeItem(TokenService.tokenKey);
    }
}