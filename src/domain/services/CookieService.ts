export default class CookieService {
    static setCookie(value: string | null | undefined, expires?: string) {
        const isInvalidValue = value === null || value === undefined || value === "undefined"
        const isEmptyValue = value === ""
        const hasExpires = expires !== undefined && expires !== null && expires !== ""

        if (isInvalidValue) return
        if (isEmptyValue && !hasExpires) return

        const name = process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE
        const domain = process.env.NEXT_PUBLIC_CROSS_DOMAIN_COOKIE
        const secure = true

        const cookieValue = value ?? ""
        const cookiePME = `${name}=${cookieValue};domain=${domain}; expires=${expires}; SameSite=None; path=/${secure ? ';secure' : ''}`;
        document.cookie = cookiePME;
    }

    static deleteCookie(): void {
        const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT"
        this.setCookie("", pastDate)
    }

    static getCookie(): string {
        const name = process.env.NEXT_PUBLIC_CROSS_NAME_COOKIE
        if (!name) return "";

        const cookies = document.cookie.split(";");
        for (const c of cookies) {
            const cookie = c.trim();
            if (cookie.startsWith(`${name}=`)) {
                return cookie.substring(name.length + 1);
            }
        }
        return "";
    }
}
