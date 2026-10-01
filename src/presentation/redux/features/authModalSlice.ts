import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface LoginModalState{
    isOpen: boolean
    onLoginSuccess?: () => void
}

const initialLoginModalState: LoginModalState = {
    isOpen: false,
}

export const authModalSlice = createSlice({
    name: 'authModal',
    initialState: initialLoginModalState,
    reducers: {
        openAuthModal: (state, action: PayloadAction<(() => void) | undefined>) => {
            state.isOpen = true;
            state.onLoginSuccess = action.payload
        },
        closeAuthModal: (state) => {
            state.isOpen = false;
            state.onLoginSuccess = undefined;
        },
    }
})

export const { openAuthModal, closeAuthModal } = authModalSlice.actions

export default authModalSlice.reducer
