import {Authentication, AuthFlow} from "@/domain/entity/Auth/auth";
import {Otp} from "@/domain/entity/Otp/otp";

const convertTimeFormatToMinutes = (time: string) =>{
    const [h, m, s] = time.split(":").map(v => Number.parseInt(v, 10) || 0);
    return (h * 60) + m + Math.floor(s / 60);
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
}

const getNullableString = (value: unknown): string | null => {
    if (typeof value === "string") return value;
    if (value === null) return null;
    return null;
}

const getString = (value: unknown): string => {
    return typeof value === "string" ? value : "";
}

const getNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    const parsed = typeof value === "string" ? Number.parseFloat(value) : Number.NaN;
    return Number.isFinite(parsed) ? parsed : 0;
}

export const convertFailedOtpDetails = (stringDetails: string) => {
    let details: Record<string, unknown> = {};
    try{
        const parsed: unknown = JSON.parse(stringDetails);
        details = isRecord(parsed) ? parsed : {};
    }catch{
        details = {};
    }
    const minutesStr = getString(details.Minutes) || "00:00:00";
    const attemptsVal = getNumber(details.ValidAttempts);
    return{
        attempts: attemptsVal,
        minutes: convertTimeFormatToMinutes(minutesStr)
    }
}

export const otpAdapter = (data: unknown): Otp => {
    const record = isRecord(data) ? data : {};
    const durationOtpCodeMinutes = getNumber(record.durationOtpCodeMinutes);
    return {
        cellPhone: getNullableString(record.cellPhone),
        durationOtpCodeMinutes,
        email: getNullableString(record.email),
        mfaToken: getString(record.mfaToken),
        expirationDate: new Date(Date.now() + (durationOtpCodeMinutes * 60 * 1000))
    }
}

export const getOtp = (data: unknown): Otp | null => {
    const record = isRecord(data) ? data : {};
    const hasContact = getNullableString(record.cellPhone) !== null || getNullableString(record.email) !== null;
    const hasDuration = record.durationOtpCodeMinutes !== null && record.durationOtpCodeMinutes !== undefined;
    const hasMfaToken = getString(record.mfaToken) !== "";

    return hasContact && hasDuration && hasMfaToken ? otpAdapter(record) : null;
}

export const validateIdentificationAdapter = (data: unknown): Authentication =>{
    const record = isRecord(data) ? data : {};
    const nextStep = getString(record.nextStep) as AuthFlow;
    const flow = Object.values(AuthFlow).includes(nextStep) ? nextStep : AuthFlow.LOGIN;

    if (flow === AuthFlow.ACTIVATE_ACCOUNT) {
        return {
            flow: AuthFlow.ACTIVATE_ACCOUNT,
            otp: otpAdapter(record)
        }
    }

    if (flow === AuthFlow.RESET_PASSWORD) {
        return {
            flow: AuthFlow.RESET_PASSWORD,
            otp: otpAdapter(record)
        }
    }

    if (flow === AuthFlow.UPDATE_PERSONAL_INFORMATION) {
        return {
            flow: AuthFlow.UPDATE_PERSONAL_INFORMATION
        }
    }

    return {
        flow: AuthFlow.LOGIN
    }
}

export const getTokenAdapter = (unformattedToken: unknown) =>{
    const record = isRecord(unformattedToken) ? unformattedToken : {};
    const getExpirationDate = (expiresIn: number) =>{
        const currenDate = new Date();
        return new Date(currenDate.getTime() + (expiresIn * 1000));
    }

    return {
        accessToken: getString(record.access_token),
        refreshToken: getString(record.refresh_token),
        refreshTokenExpireDate: getExpirationDate(getNumber(record.refresh_token_expires_in)),
    }
}
