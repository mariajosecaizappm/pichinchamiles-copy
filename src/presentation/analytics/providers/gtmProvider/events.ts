type GtmProgramEventDetail = {
    event: string
    product: string
    sub_product: string
    userflow_type: string
    step_name: string
    value?: number
    miles?: number
    funnel_aux?: string
    identification?: string
    aux?: string
    aux2?: string
}

const baseEvent = {
    product: "pmiles",
    userflow_type: "web",
}

type SubProductBase = Pick<GtmProgramEventDetail, "product" | "userflow_type" | "sub_product">

const createSubProductBase = (subProduct: string): SubProductBase => ({
    ...baseEvent,
    sub_product: subProduct,
})

type FunnelStepExtra = Partial<Omit<GtmProgramEventDetail, keyof SubProductBase | "event" | "step_name">>

const createOnClickEvent = (
    base: SubProductBase,
    funnelStep: string,
    extra: FunnelStepExtra = {}
): GtmProgramEventDetail => ({
    ...base,
    event: "onclick",
    step_name: funnelStep,
    ...extra,
})

const createFunnelStepEvent = (
    base: SubProductBase,
    funnelStep: string,
    extra: FunnelStepExtra = {}
): GtmProgramEventDetail => ({
    ...base,
    event: "funnel_step",
    step_name: funnelStep,
    ...extra,
})

const loginBaseEvent = createSubProductBase("Login")
export const loginEvents: GtmProgramEventDetail[] = [
    createOnClickEvent(loginBaseEvent, "01_PrincipalLogin"),
    createFunnelStepEvent(loginBaseEvent, "01_PrincipalLogin"),
    createFunnelStepEvent(loginBaseEvent, "02_LoginID"),
    createOnClickEvent(loginBaseEvent, "02_LoginID"),
    createFunnelStepEvent(loginBaseEvent, "03_LoginPass"),
    createOnClickEvent(loginBaseEvent, "03_LoginPass"),
    createFunnelStepEvent(loginBaseEvent, "04_LoginCodigoVerif"),
    createOnClickEvent(loginBaseEvent, "04_LoginCodigoVerif"),
    createFunnelStepEvent(loginBaseEvent, "05_LoginFinal"),
]

const activationBaseEvent = createSubProductBase("Activation")
export const activationEvents: GtmProgramEventDetail[] = [
    createFunnelStepEvent(activationBaseEvent, "01_LoginID"),
    createOnClickEvent(activationBaseEvent, "01_LoginID"),
    createFunnelStepEvent(activationBaseEvent, "02_CodigoVerifi"),
    createOnClickEvent(activationBaseEvent, "02_CodigoVerifi"),
    createFunnelStepEvent(activationBaseEvent, "03_CreaPass"),
    createOnClickEvent(activationBaseEvent, "03_CreaPass"),
    createFunnelStepEvent(activationBaseEvent, "04_ActivationFinal"),
]

const transferBaseEvent = createSubProductBase("transferir")
export const transferEvents: GtmProgramEventDetail[] = [
    createOnClickEvent(transferBaseEvent, "01_PrincipalTransferir"),
    createFunnelStepEvent(transferBaseEvent, "01_TransferirMillas"),
    createOnClickEvent(transferBaseEvent, "01_TransferirMillas"),
    createFunnelStepEvent(transferBaseEvent, "02_TransferirMillas"),
]

const redemptionBaseEvent = createSubProductBase("redencion")
export const redemptionEvents: GtmProgramEventDetail[] = [
    createFunnelStepEvent(redemptionBaseEvent, "01_Principal"),
    createOnClickEvent(redemptionBaseEvent, "01_Principal"),
    createOnClickEvent(redemptionBaseEvent, "01_Categoria"),
    createFunnelStepEvent(redemptionBaseEvent, "02_Subcategoria"),
    createOnClickEvent(redemptionBaseEvent, "02_Subcategoria"),
    createFunnelStepEvent(redemptionBaseEvent, "03_Shopping"),
    createOnClickEvent(redemptionBaseEvent, "03_Shopping_Carrito"),
    createOnClickEvent(redemptionBaseEvent, "03_Shopping_Copago"),
    createOnClickEvent(redemptionBaseEvent, "03_Shopping_VerCarrito"),
    createFunnelStepEvent(redemptionBaseEvent, "04_CarritoCompra"),
    createOnClickEvent(redemptionBaseEvent, "04_CarritoCompra"),
    createFunnelStepEvent(redemptionBaseEvent, "05_CarritoCompra_Direc"),
    createOnClickEvent(redemptionBaseEvent, "05_CarritoCompra_Direc"),
    createFunnelStepEvent(redemptionBaseEvent, "06_CarritoCompra_Fact"),
    createOnClickEvent(redemptionBaseEvent, "06_CarritoCompra_Fact"),
    createFunnelStepEvent(redemptionBaseEvent, "07_CarritoCompra_Resum"),
    createOnClickEvent(redemptionBaseEvent, "07_CarritoCompra_Resum"),
    createFunnelStepEvent(redemptionBaseEvent, "08_CarritoCompra_Exitoso"),
]

export const conversionEvents: GtmProgramEventDetail[] = [
    {
        ...baseEvent,
        event: "conversion_pmiles",
        sub_product: "redencion",
        step_name: "",
        aux: "Productos"
    },
    {
        ...baseEvent,
        event: "conversion_pmiles",
        sub_product: "transferir",
        step_name: "",
    },
]
