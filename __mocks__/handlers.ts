import { http, HttpResponse } from 'msw';

// Base URL and prefixes matching RepositoryBase
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const identityPrefix = '/identity-api';
const programId = process.env.NEXT_PUBLIC_PROGRAM_ID || 'test-program-id';
const basketsPrefix = '/baskets-api';
const programsPrefix = '/programs-api';
const pointsTransactionsPrefix = '/points-transactions-api';

export const handlers = [
    // Verify Member Identification
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/onboardings/identifications`, () => {
        return HttpResponse.json({ nextStep: 'LOGIN' });
    }),

    // Verify Activation OTP
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/v2/activate-accounts/validate-otp`, () => {
        return HttpResponse.json({ activateAccountToken: 'default-activate-token' });
    }),

    // Active Account
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/v2/activate-accounts`, () => {
        return HttpResponse.json({
            access_token: 'default-access-token',
            refresh_token: 'default-refresh-token',
            refresh_token_expires_in: 3600
        });
    }),

    // Refresh Token / Login / Get Login OTP (OAuth Token)
    http.post(`${baseUrl}${identityPrefix}/oauth/token`, async ({ request }) => {
        const body = await request.json() as Record<string, unknown>;
        
        if (body.grant_type === 'password') {
            // Get Login OTP
            return HttpResponse.json({
                mfaToken: 'default-mfa-token',
                cellPhone: '123***7890',
                email: 'test@example.com'
            });
        }
        
        // Refresh Token or other OAuth
        return HttpResponse.json({
            access_token: 'default-new-access-token',
            refresh_token: 'default-new-refresh-token',
            refresh_token_expires_in: 3600
        }, {
            headers: { 'xdcartokens': 'default-cookie' }
        });
    }),

    // Verify Login OTP
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/auth/login/v2/validate-otp`, () => {
        return HttpResponse.json({
            access_token: 'default-access-token',
            refresh_token: 'default-refresh-token',
            refresh_token_expires_in: 3600
        }, {
            headers: { 'xdcartokens': 'default-cookie' }
        });
    }),

    // Get Reset Password OTP
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/auth/forgot-password`, () => {
        return HttpResponse.json({ mfaToken: 'default-mfa-token' });
    }),

    // Verify Reset Password OTP
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/auth/v2/forgot-password/validate-otp`, () => {
        return HttpResponse.json({
            mfaToken: 'default-mfa-token',
            token: 'default-token-hash' 
        });
    }),

    // Reset Password
    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/auth/v2/reset-password`, () => {
        return HttpResponse.json({
            access_token: 'default-access-token',
            refresh_token: 'default-refresh-token',
            refresh_token_expires_in: 3600
        }, {
            headers: { 'xdcartokens': 'default-cookie' }
        });
    }),

    // Is Valid Cookie
    http.get(`${baseUrl}${identityPrefix}/${programId}/users/members/auth/cookie`, () => {
        return HttpResponse.json(true);
    }),

    http.get(`${baseUrl}${basketsPrefix}/${programId}/baskets`, () => {
        return HttpResponse.json({ buyerId: 'default-buyer-id', items: [] });
    }),

    http.post(`${baseUrl}${basketsPrefix}/${programId}/baskets`, () => {
        return HttpResponse.json({ buyerId: 'default-buyer-id', items: [] });
    }),

    http.get(`${baseUrl}${identityPrefix}/${programId}/users/members/me`, () => {
        return HttpResponse.json({
            memberType: 'personal',
            identification: 'default-id',
            city: 'QUITO',
            country: 'ECUADOR',
            state: 'PICHINCHA',
            registrationDate: '2026-01-01T00:00:00.000Z',
            segments: [],
        });
    }),

    http.post(`${baseUrl}${identityPrefix}/${programId}/users/members/lopd`, () => {
        return HttpResponse.json({}, { status: 200 });
    }),

    http.get(`${baseUrl}${pointsTransactionsPrefix}/${programId}/users/members/balances/:currencyId`, () => {
        return HttpResponse.json({ total: 1234 });
    }),

    http.get(`${baseUrl}${programsPrefix}/${programId}/currencies`, () => {
        return HttpResponse.json({
            entities: [
                { type: 'points', priority: 1, currencyId: 'points-id' },
                { type: 'coin', priority: 1, currencyId: 'coins-id' },
            ]
        });
    }),

    // Revoke Token
    http.post(`${baseUrl}${identityPrefix}/oauth/revoke`, () => {
        return HttpResponse.json({});
    }),

    // Algolia Search API - Mock all search requests
    http.post(`${baseUrl}/search-api/1/indexes/:index/query`, () => {
        return HttpResponse.json({
            hits: [],
            page: 0,
            hitsPerPage: 10,
            nbHits: 0,
            nbPages: 0,
            facets: {}
        });
    }),

    // Algolia Multi-Query Search API
    http.post(`${baseUrl}/search-api/1/indexes/*/queries`, () => {
        return HttpResponse.json({
            results: [{
                hits: [],
                page: 0,
                hitsPerPage: 10,
                nbHits: 0,
                nbPages: 0,
                facets: {}
            }]
        });
    }),
];
