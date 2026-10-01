import {AxiosError} from "axios"
import {ApiError} from "@/domain/entity/Error/models/ApiError";
import {ErrorCode} from "@/domain/entity/Error/structure/error";
import {convertFailedOtpDetails} from "@/data/adapters/Auth/authAdapters";

interface ErrorResponseData {
    httpCode: number
    message: string
    code: string
    details?: unknown
}

const ERROR_ROUTE_MATCHERS = {
    IDENTIFICATIONS_ONBOARDING: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/onboardings\/identifications$/,
    ACTIVATE_ACCOUNTS_VALIDATE_OTP: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/v\d+\/activate-accounts\/validate-otp$/,
    ACTIVATE_ACCOUNTS: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/v\d+\/activate-accounts$/,
    OAUTH_TOKEN: /^\/identity-api\/oauth\/token$/,
    LOGIN_VALIDATE_OTP: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/auth\/login\/v\d+\/validate-otp$/,
    FORGOT_PASSWORD_VALIDATE_OTP: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/auth\/v\d+\/forgot-password\/validate-otp$/,
    OTP_VALIDATION: /^(?:\/identity-api\/oauth\/token|\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/v\d+\/activate-accounts\/validate-otp|\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/auth\/login\/v\d+\/validate-otp|\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/auth\/v\d+\/forgot-password\/validate-otp)$/,
    TRANSFER_MILES_CALCULATE: /^\/points-transactions-api\/[0-9a-fA-F-]{36}\/calculators\/transfers$/,
    TRANSFER_BENEFICIARY: /^\/points-transactions-api\/[0-9a-fA-F-]{36}\/users\/members\/(?!balances\/)[^/]+$/,
    ME_VALIDATE_OTP: /^\/identity-api\/[0-9a-fA-F-]{36}\/users\/members\/me\/validate-otp$/,
    EXPORT_TRANSACTIONS: /^\/points-transactions-api\/[0-9a-fA-F-]{36}\/transactions\/transaction-history$/,
};

type ErrorContext = { status?: number; data?: ErrorResponseData };

const extractPathname = (url?: string, baseURL?: string): string | null => {
    if (!url) return null;
    try {
        if (url.startsWith("http://") || url.startsWith("https://")) {
            return new URL(url).pathname;
        }
        if (baseURL) {
            return new URL(url, baseURL).pathname;
        }
        return url.startsWith("/") ? url : `/${url}`;
    } catch {
        return url.startsWith("/") ? url : `/${url}`;
    }
};

const getStatusCode = (response?: AxiosError<ErrorResponseData>["response"]): number | undefined => {
    return response?.status ?? response?.data?.httpCode;
};

const ROUTE_HANDLERS: Array<{ matcher: RegExp; handle: (ctx: ErrorContext) => ApiError | undefined }> = [
    {
        matcher: ERROR_ROUTE_MATCHERS.IDENTIFICATIONS_ONBOARDING,
        handle: (ctx) => {
            if (ctx.status === 400) return new ApiError(ErrorCode.INVALID_USER);
        }
    },
    {
        matcher: ERROR_ROUTE_MATCHERS.OTP_VALIDATION,
        handle: (ctx) => {
            if (ctx.status === 400) {
                const raw = ctx.data?.details;
                const details = convertFailedOtpDetails(
                    typeof raw === "string" ? raw : JSON.stringify(raw ?? {})
                );
                const codeNum = ctx.data?.code ? Number(ctx.data.code) : NaN;
                if (codeNum === 101 || details.attempts > 0) {
                    return new ApiError(ErrorCode.INVALID_ATTEMPT, { remainingAttempts: details.attempts });
                }
                if (codeNum === 100 || details.attempts === 0) {
                    return new ApiError(ErrorCode.USER_BLOCKED, { minutes: details.minutes });
                }
            }
        }
    },
    {
        matcher: ERROR_ROUTE_MATCHERS.ACTIVATE_ACCOUNTS,
        handle: (ctx) => {
            if (ctx.status === 400) return new ApiError(ErrorCode.UNKNOWN);
        }
    },
    {
        matcher: ERROR_ROUTE_MATCHERS.EXPORT_TRANSACTIONS,
        handle: (ctx) => {
            if (ctx.status === 400 || ctx.status === 412) {
                return new ApiError(ErrorCode.EXPORT_TRANSACTIONS_NOT_FOUND);
            }
        }
    },
    {
        matcher: ERROR_ROUTE_MATCHERS.TRANSFER_BENEFICIARY,
        handle: (ctx) => {
            if (ctx.status === 400 || ctx.status === 404) {
                return new ApiError(ErrorCode.BENEFICIARY_NOT_FOUND);
            }
        }
    }
];

export const getError = (error: AxiosError<ErrorResponseData>) => {
    const pathname = extractPathname(error.config?.url, error.config?.baseURL);
    if (!pathname) return error;

    const ctx: ErrorContext = {
        status: getStatusCode(error.response),
        data: error.response?.data
    };

    for (const {matcher, handle} of ROUTE_HANDLERS) {
        if (matcher.test(pathname)) {
            const mapped = handle(ctx);
            if (mapped) return mapped;
        }
    }

    return error;
}
