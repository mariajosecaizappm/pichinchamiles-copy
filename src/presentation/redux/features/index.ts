import { combineReducers } from "@reduxjs/toolkit"
import authModalReducer from "@/presentation/redux/features/authModalSlice";
import userReducer from "@/presentation/redux/features/userSlice";

const rootReducer = combineReducers({
    authModal: authModalReducer,
    user: userReducer,
})

export default rootReducer
