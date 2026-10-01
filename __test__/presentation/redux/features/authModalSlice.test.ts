import {describe, it, expect, vi} from 'vitest';
import authModalReducer, {
    openAuthModal,
    closeAuthModal,
    LoginModalState,
} from '@/presentation/redux/features/authModalSlice';

describe('authModalSlice', () => {
    const initialState: LoginModalState = {
        isOpen: false,
    };

    describe('when reducer initializes', () => {
        it('should return the initial state', () => {
            const result = authModalReducer(undefined, {type: 'unknown'});
            expect(result).toEqual(initialState);
        });
    });

    describe('when openAuthModal is dispatched with a callback', () => {
        it('should set isOpen to true and store the callback', () => {
            const mockCallback = vi.fn();
            const action = openAuthModal(mockCallback);
            
            const result = authModalReducer(initialState, action);

            expect(result.isOpen).toBe(true);
            expect(result.onLoginSuccess).toBe(mockCallback);
        });
    });

    describe('when openAuthModal is dispatched without a callback', () => {
        it('should set isOpen to true and callback should be undefined', () => {
            const action = openAuthModal(undefined);
            
            const result = authModalReducer(initialState, action);

            expect(result.isOpen).toBe(true);
            expect(result.onLoginSuccess).toBeUndefined();
        });
    });

    describe('when closeAuthModal is dispatched', () => {
        it('should reset state to closed and clear callback', () => {
            const startState: LoginModalState = {
                isOpen: true,
                onLoginSuccess: vi.fn(),
            };
            const action = closeAuthModal();
            const expectedState: LoginModalState = {
                isOpen: false,
                onLoginSuccess: undefined,
            };

            const result = authModalReducer(startState, action);

            expect(result).toEqual(expectedState);
        });
    });
});
