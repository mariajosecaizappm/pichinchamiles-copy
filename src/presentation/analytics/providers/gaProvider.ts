import AnalyticsProvider from "@/presentation/analytics/providers/types";
import {EventName} from "@/presentation/analytics/types";
import { sendGAEvent } from '@next/third-parties/google'

const gaProvider: AnalyticsProvider = {
    name: "gaProvider",
    track: (event) =>{
        if(event.name === EventName.LOADED_USER && event.payload.cif){
            sendGAEvent('event', 'set_cif', {
                cif: event.payload.cif.padStart(16, "0")
            })
        }
    }
}

export default gaProvider;