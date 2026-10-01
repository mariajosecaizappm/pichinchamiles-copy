import { AddressLocation } from "@/domain/entity/Address/structure/address"
import * as Yup from "yup"

export const locationSchema = Yup.object({
    id: Yup.string().required(),
    name: Yup.string().required(),
})

export const hasLocation = (location: AddressLocation | null) =>
    Boolean(location?.id)

export const createRequiredLocationFields = () => ({
    state: locationSchema.nullable().required("Provincia requerida"),
    city: locationSchema.nullable().required("Ciudad requerida"),
    zone: locationSchema.nullable().required("Sector requerido"),
})
