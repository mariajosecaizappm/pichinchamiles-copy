import CookieService from "./CookieService";

export default class AuthServiceUv {
    private static readonly nameCookie = process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE;
    private static referrer: string = "";

    static LoginUv(cookie: string, expiresDate: Date) {
        CookieService.setCookie(cookie, expiresDate.toUTCString());

        if (document.referrer && document.referrer !== "") {
            this.referrer = document.referrer;
        }

        if (this.referrer && this.referrer !== window.location.href) {
            const searchParams = new URLSearchParams(window.location.search);
            const flow = searchParams.get('flow');

            if (flow === "login") {
                window.open(this.referrer, "_self");
            }
        }
    }

    static CloseSession() {
        CookieService.deleteCookie();
    }

    static isCookiePresent(): boolean {
        const cookieValue = CookieService.getCookie();
        return cookieValue !== null && cookieValue !== undefined && cookieValue.trim() !== "";
    }
}
