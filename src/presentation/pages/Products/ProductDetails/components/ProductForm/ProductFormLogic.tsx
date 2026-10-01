import { PaymentMethod } from "@/domain/entity/Payment/payment"
import CopaymentCalculatorService from "@/domain/services/CopaymentCalculatorService"
import FormContext, { FormContextValues } from "@/presentation/components/Form/context/FormContext"
import { useContext, useEffect, useMemo, useRef } from "react"
import { useProductDetailsContext } from "../../context/useProductDetailsContext"
import { ProductFormValues } from "./ProductFormConfig"

const ProductFormLogic = () => {
    const { values, setFieldValue } = useContext(FormContext) as  FormContextValues<ProductFormValues>
    const {
        variation,
        setSelectedFeatures,
    } = useProductDetailsContext()

    const paymentType = values.paymentType
    const quantity = values.quantity
    const features = values.features

    const isCopayment = paymentType === PaymentMethod.COPAYMENT
    const hasCopaymentConfig = !!variation?.copayment


    const calculator = useMemo(() => {
        if (!hasCopaymentConfig || !variation?.copayment ) return null
        return new CopaymentCalculatorService(
            quantity || 1,
            variation.pointsPrice,
            variation.price,
            variation.copayment
        )
    }, [quantity, variation, hasCopaymentConfig])

    // Initialize default features from the active variation on mount
    const initializedVariationRef = useRef<string | null>(null)
    useEffect(() => {
        if (variation && variation.id !== initializedVariationRef.current && (!features || Object.keys(features).length === 0)) {
            initializedVariationRef.current = variation.id
            const initialFeatures: Record<string, string> = {}
            variation.features.forEach(f => {
                initialFeatures[f.name] = f.option
            })
            setFieldValue("features", initialFeatures)
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [variation, setFieldValue])

    useEffect(() => {
        if (features) {
            const mappedFeatures = Object.entries(features).map(([name, option]) => ({
                name,
                option: option || null,
            }))
            setSelectedFeatures(mappedFeatures)
        }
    }, [features, setSelectedFeatures])

    // 2. Formik side effects: when mode is Solo Millas, reset points & coins in Formik values
    useEffect(() => {
        if (paymentType === PaymentMethod.POINTS && variation) {
            setFieldValue("points", variation.pointsPrice * quantity)
            setFieldValue("coins", 0)
        }
    }, [paymentType, variation, quantity, setFieldValue])

    // 3. Formik side effects: when switching to copayment, set initial points & coins values
    useEffect(() => {
        if (isCopayment && calculator) {
            const initialValues = calculator.getCopaymentInitialValues()
            setFieldValue("points", initialValues.points)
            setFieldValue("coins", initialValues.coins)
        }
    }, [isCopayment, quantity, calculator, setFieldValue])

    return null
}

export default ProductFormLogic
