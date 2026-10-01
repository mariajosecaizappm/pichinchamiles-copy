import {load} from "recaptcha-v3";

export default class RecaptchaService{
    static async getToken(action: string): Promise<string>{
        const recaptcha = await load(process.env.NEXT_PUBLIC_SITE_KEY as string, {autoHideBadge: true});
        return recaptcha.execute(action);
    }
}