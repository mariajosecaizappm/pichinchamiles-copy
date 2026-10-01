import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { server } from '../../../../__mocks__/server';
import { http, HttpResponse } from 'msw';
import { AuthFlow, ActiveAccountArgs } from '@/domain/entity/Auth/auth';
import { sha512 } from 'js-sha512';
import { Token } from '@/domain/entity/Token/token';

// Mock container to avoid circular dependency
vi.mock('@/presentation/config/inversify.config', () => {
    return {
        default: {
            get: vi.fn(),
            bind: vi.fn().mockReturnThis(),
            to: vi.fn(),
        }
    };
});

import AuthRepository from '@/data/repository/Auth/AuthRepository';

describe('AuthRepository', () => {
    let repository: AuthRepository;
    const baseUrl = 'http://localhost:3000';
    const identityPrefix = '/identity-api';
    const programId = 'test-program-id';

    beforeAll(() => {
        repository = new AuthRepository();
    });

    afterEach(() => {
        server.resetHandlers();
    });

    describe('verifyMemberIdentification', () => {
        const identificationNumber = '1234567890';
        const recaptchaAction = 'login';
        const recaptchaToken = 'token';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/onboardings/identifications`;

        describe('when API call is successful', () => {
            it('should return Authentication object with LOGIN flow', async () => {
                const mockResponse = { nextStep: 'LOGIN' };
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.identification).toBe(identificationNumber);
                        expect(request.headers.get('Recaptchaaction')).toBe(recaptchaAction);
                        expect(request.headers.get('Recaptchatoken')).toBe(recaptchaToken);
                        return HttpResponse.json(mockResponse);
                    })
                );

                const result = await repository.verifyMemberIdentification(identificationNumber, recaptchaAction, recaptchaToken);
                expect(result).toEqual({ flow: AuthFlow.LOGIN });
            });
        });

        describe('when API returns ERROR', () => {
            it('should throw ApiError with USER_CANCELED code', async () => {
                const mockResponse = { nextStep: 'ERROR' };
                server.use(
                    http.post(url, () => HttpResponse.json(mockResponse))
                );

                await expect(repository.verifyMemberIdentification(identificationNumber, recaptchaAction, recaptchaToken))
                    .rejects.toThrow('USER_CANCELED');
            });
        });
    });

    describe('verifyActivationOtp', () => {
        const identificationNumber = '1234567890';
        const otpCode = '123456';
        const otpToken = 'token';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/v2/activate-accounts/validate-otp`;

        describe('when API call is successful', () => {
            it('should return activateAccountToken', async () => {
                const mockResponse = { activateAccountToken: 'activate-token' };
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body).toEqual({
                            identification: identificationNumber,
                            mfaCode: otpCode,
                            mfaToken: otpToken
                        });
                        return HttpResponse.json(mockResponse);
                    })
                );

                const result = await repository.verifyActivationOtp(identificationNumber, otpCode, otpToken);
                expect(result).toBe('activate-token');
            });
        });
    });

    describe('activeAccount', () => {
        const args: ActiveAccountArgs = {
            acceptedLopd: true,
            acceptedTermsAndCondition: true,
            activeAccountToken: 'token',
            identificationNumber: '1234567890',
            password: 'password',
            mfaToken: 'mfaToken',
            mfaCode: '123456'
        };
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/v2/activate-accounts`;

        describe('when API call is successful', () => {
            it('should return Token object and cookie', async () => {
                const mockResponse = {
                    access_token: 'access-token',
                    refresh_token: 'refresh-token',
                    refresh_token_expires_in: 3600
                };
                const mockCookie = 'cookie-value';
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.identification).toBe(args.identificationNumber);
                        return HttpResponse.json(mockResponse, {
                            headers: { 'xdcartokens': mockCookie }
                        });
                    })
                );

                const result = await repository.activeAccount(args);
                expect(result.token.accessToken).toBe('access-token');
                expect(result.token.refreshToken).toBe('refresh-token');
                expect(result.cookie).toBe(mockCookie);
            });
        });
    });

    describe('refreshToken', () => {
        const recaptchaToken = 'token';
        const recaptchaAction = 'refresh';
        const url = `${baseUrl}${identityPrefix}/oauth/token`;

        describe('when API call is successful', () => {
            it('should return Token object and cookie', async () => {
                const mockResponse = {
                    access_token: 'new-access-token',
                    refresh_token: 'new-refresh-token',
                    refresh_token_expires_in: 3600
                };
                const mockCookie = 'cookie-value';

                server.use(
                    http.post(url, async ({ request }) => {
                        expect(request.headers.get('Recaptchaaction')).toBe(recaptchaAction);
                        expect(request.headers.get('Recaptchatoken')).toBe(recaptchaToken);
                        return HttpResponse.json(mockResponse, {
                            headers: { 'xdcartokens': mockCookie }
                        });
                    })
                );

                const result = await repository.refreshToken(recaptchaToken, recaptchaAction);
                expect(result.token.accessToken).toBe('new-access-token');
                expect(result.cookie).toBe(mockCookie);
            });
        });
    });

    describe('getLoginOtp', () => {
        const identificationNumber = '1234567890';
        const password = 'password';
        const recaptchaAction = 'login';
        const recaptchaToken = 'token';
        const url = `${baseUrl}${identityPrefix}/oauth/token`;

        describe('when API call is successful', () => {
            it('should return Otp object', async () => {
                vi.useFakeTimers();
                vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
                
                const mockResponse = {
                    mfaToken: 'mfa-token',
                    cellPhone: '123***7890',
                    email: 'test@example.com',
                    durationOtpCodeMinutes: 5
                };
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.username).toBe(identificationNumber);
                        return HttpResponse.json(mockResponse);
                    })
                );

                const result = await repository.getLoginOtp(identificationNumber, password, recaptchaAction, recaptchaToken);
                expect(result).toEqual({
                    ...mockResponse,
                    expirationDate: new Date("2020-01-01T00:05:00.000Z")
                });
                
                vi.useRealTimers();
            });
        });
    });

    describe('verifyLoginOtp', () => {
        const identificationNumber = '1234567890';
        const otpCode = '123456';
        const otpToken = 'token';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/auth/login/v2/validate-otp`;

        describe('when API call is successful', () => {
            it('should return Token object and cookie', async () => {
                const mockResponse = {
                    access_token: 'access-token',
                    refresh_token: 'refresh-token',
                    refresh_token_expires_in: 3600
                };
                const mockCookie = 'cookie-value';

                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.identification).toBe(identificationNumber);
                        return HttpResponse.json(mockResponse, {
                            headers: { 'xdcartokens': mockCookie }
                        });
                    })
                );

                const result = await repository.verifyLoginOtp(identificationNumber, otpCode, otpToken);
                expect(result.token.accessToken).toBe('access-token');
                expect(result.cookie).toBe(mockCookie);
            });
        });
    });

    describe('getResetPasswordOtp', () => {
        const identificationNumber = '1234567890';
        const recaptchaAction = 'reset';
        const recaptchaToken = 'token';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/auth/forgot-password`;

        describe('when API call is successful', () => {
            it('should return Otp object', async () => {
                vi.useFakeTimers();
                vi.setSystemTime(new Date("2020-01-01T00:00:00.000Z"));
                
                const mockResponse = { 
                    mfaToken: 'mfa-token',
                    durationOtpCodeMinutes: 5
                };
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.identification).toBe(identificationNumber);
                        return HttpResponse.json(mockResponse);
                    })
                );

                const result = await repository.getResetPasswordOtp(identificationNumber, recaptchaAction, recaptchaToken);
                expect(result).toEqual({
                    ...mockResponse,
                    cellPhone: null,
                    email: null,
                    expirationDate: new Date("2020-01-01T00:05:00.000Z")
                });
                
                vi.useRealTimers();
            });
        });
    });

    describe('verifyResetPasswordOtp', () => {
        const identificationNumber = '1234567890';
        const otpCode = '123456';
        const otpToken = 'token';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/auth/v2/forgot-password/validate-otp`;

        describe('when hash matches', () => {
            it('should return mfaToken', async () => {
                const mfaToken = 'new-mfa-token';
                const hashValue = sha512(`${identificationNumber}-${otpCode}-${mfaToken}`);
                const mockResponse = {
                    mfaToken: mfaToken,
                    token: hashValue
                };

                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.mfaCode).toBe(otpCode);
                        return HttpResponse.json(mockResponse);
                    })
                );

                const result = await repository.verifyResetPasswordOtp(identificationNumber, otpCode, otpToken);
                expect(result).toBe(mfaToken);
            });
        });

        describe('when hash does not match', () => {
            it('should throw ApiError', async () => {
                const mfaToken = 'new-mfa-token';
                const mockResponse = {
                    mfaToken: mfaToken,
                    token: 'invalid-hash'
                };

                server.use(
                    http.post(url, () => HttpResponse.json(mockResponse))
                );

                await expect(repository.verifyResetPasswordOtp(identificationNumber, otpCode, otpToken))
                    .rejects.toThrow();
            });
        });
    });

    describe('resetPassword', () => {
        const identification = '1234567890';
        const mfaRequest = { mfaCode: '123456', mfaToken: 'token' };
        const resetPasswordToken = 'reset-token';
        const password = 'new-password';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/auth/v2/reset-password`;

        describe('when API call is successful', () => {
            it('should return Token object and cookie', async () => {
                const mockResponse = {
                    access_token: 'access-token',
                    refresh_token: 'refresh-token',
                    refresh_token_expires_in: 3600
                };
                const mockCookie = 'cookie-value';

                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.password).toBe(password);
                        return HttpResponse.json(mockResponse, {
                            headers: { 'xdcartokens': mockCookie }
                        });
                    })
                );

                const result = await repository.resetPassword(identification, mfaRequest, resetPasswordToken, password);
                expect(result.token.accessToken).toBe('access-token');
                expect(result.cookie).toBe(mockCookie);
            });
        });
    });

    describe('isValidCookie', () => {
        const recaptchaToken = 'token';
        const recaptchaAction = 'check';
        const url = `${baseUrl}${identityPrefix}/${programId}/users/members/auth/cookie`;

        describe('when API returns true', () => {
            it('should return true', async () => {
                server.use(
                    http.get(url, async ({ request }) => {
                        expect(request.headers.get('Recaptchaaction')).toBe(recaptchaAction);
                        return HttpResponse.json(true);
                    })
                );

                const result = await repository.isValidCookie(recaptchaToken, recaptchaAction);
                expect(result).toBe(true);
            });
        });
    });

    describe('revokeToken', () => {
        const token: Token = {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            refreshTokenExpireDate: new Date()
        };
        const url = `${baseUrl}${identityPrefix}/oauth/revoke`;

        describe('when API call is successful', () => {
            it('should complete without error', async () => {
                server.use(
                    http.post(url, async ({ request }) => {
                        const body = await request.json() as any;
                        expect(body.refresh_token).toBe(token.refreshToken);
                        return HttpResponse.json({});
                    })
                );

                await repository.revokeToken(token);
            });
        });
    });
});
