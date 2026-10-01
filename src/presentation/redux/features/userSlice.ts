import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ProgramCurrency} from "@/domain/entity/Currency/currency";
import {Basket} from "@/domain/entity/Basket/structure/basket";
import {Member, MemberType} from "@/domain/entity/Member/member";
import {AuthMember} from "@/domain/entity/Member/authMember";
import {Consent} from "@/domain/entity/Member/consent";

export interface UserState{
    information: Member | null
    balance: number
    programCurrency: ProgramCurrency | null
    isLogged: boolean
    isValidatingSession: boolean
    basket: Basket | null
    cif: string
    consent: Consent | null
}

const initialState: UserState = {
    information: null,
    balance: 0,
    programCurrency: null,
    isLogged: false,
    isValidatingSession: true,
    basket: null,
    cif: "",
    consent: null,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        startSession: (state, action: PayloadAction<AuthMember>) =>{
            state.isLogged = true;
            state.information = action.payload.member;
            state.balance = action.payload.balance;
            state.programCurrency = action.payload.currency;
            state.basket = action.payload.basket;
            state.cif = action.payload.cif;
            state.consent = action.payload.consent;
        },

        closeSession: state =>{
            state.isLogged = false;
            state.information = null;
            state.programCurrency = null;
            state.balance = 0;
            state.basket = null;
            state.cif = "";
            state.consent = null;
        },

        updateBalance: (state, action: PayloadAction<{ balance: number }>) => {
            state.balance = action.payload.balance
        },
        updateEmail: (state, action: PayloadAction<{ email: string }>) => {
            if (state.information) {
                state.information.enrollmentEmail =  action.payload.email
            }
        },
        updateGender: (state, action: PayloadAction<{ gender: string }>) => {
            if (state.information?.memberType === MemberType.PERSONAL) {
                state.information.gender =  action.payload.gender
            }
        },
        updateBasket: (state, action: PayloadAction<{ basket: Basket | null }>) => {
            state.basket = action.payload.basket;
        },
        setValidatingSession: (state, action: PayloadAction<{ validating: boolean }>) => {
            state.isValidatingSession = action.payload.validating
        },
        updateConsent: (state, action: PayloadAction<{ consent: Consent | null }>) => {
            state.consent = action.payload.consent
        },
        updateMemberLegalConsent: (
            state,
            action: PayloadAction<{ acceptedTermsAndCondition: boolean; acceptLopd: boolean }>
        ) => {
            if (!state.information) return
            state.information.acceptedTermsAndCondition = action.payload.acceptedTermsAndCondition
            state.information.acceptLopd = action.payload.acceptLopd
        },
    }
})

export const {
    startSession,
    closeSession,
    updateBasket,
    updateBalance,
    updateEmail,
    updateGender,
    setValidatingSession,
    updateConsent,
    updateMemberLegalConsent,
} = userSlice.actions
export default userSlice.reducer