import { configureStore, Tuple } from "@reduxjs/toolkit"
import { serializableMiddleware } from "@/presentation/redux/middleware/serialize"
import rootReducer from "../redux/features"

export const store = configureStore({
    reducer: rootReducer,
    middleware: () => new Tuple(serializableMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
