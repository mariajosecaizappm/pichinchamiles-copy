import { Otp } from "@/domain/entity/Otp/otp"

const CI_COEFFICIENTS = [2, 1, 2, 1, 2, 1, 2, 1, 2] as const
const MAX_PROVINCE_CODE = 24
const NON_DIGIT_REGEXP = /\D/i

const validateCi = (cedula: string): boolean => {
    if (cedula.length !== 10 || NON_DIGIT_REGEXP.test(cedula)) {
        return false
    }

    const personType = Number.parseInt(cedula[2], 10)
    if (personType > 6) {
        return false
    }

    const provinceCode = Number.parseInt(cedula.slice(0, 2), 10)
    if (provinceCode < 1 || provinceCode > MAX_PROVINCE_CODE) {
        return false
    }

    const receivedCheckDigit = Number.parseInt(cedula[9], 10)
    let sum = 0

    for (let i = 0; i < CI_COEFFICIENTS.length; i++) {
        const value = CI_COEFFICIENTS[i] * Number.parseInt(cedula[i], 10)
        sum = value > 9 ? sum + (value - 9) : sum + value
    }

    let calculatedCheckDigit: number
    if (sum >= 10) {
        const remainder = sum % 10
        calculatedCheckDigit = remainder === 0 ? remainder : 10 - remainder
    } else {
        calculatedCheckDigit = sum
    }

    return calculatedCheckDigit === receivedCheckDigit
}

const calculateWeightedSum = (value: string, coefficients: readonly number[]): number => {
    let sum = 0
    for (let i = 0; i < coefficients.length; i++) {
        sum += coefficients[i] * Number.parseInt(value[i], 10)
    }
    return sum
}

const validateNaturalPersonRuc = (ruc: string): boolean => {
    const checkDigit = Number.parseInt(ruc[9], 10)
    let sum = 0

    for (let i = 0; i < CI_COEFFICIENTS.length; i++) {
        const value = CI_COEFFICIENTS[i] * Number.parseInt(ruc[i], 10)
        sum += value > 9 ? (value % 10) + 1 : value
    }

    const remainder = sum % 10

    if (remainder === 0 && checkDigit === 0) {
        return true
    }

    return 10 - remainder === checkDigit
}

const validatePublicEntityRuc = (ruc: string): boolean => {
    const checkDigit = Number.parseInt(ruc[8], 10)
    const coefficients = [3, 2, 7, 6, 5, 4, 3, 2] as const
    const remainder = calculateWeightedSum(ruc, coefficients) % 11

    if (remainder === 0 && checkDigit === 0) {
        return true
    }

    return 11 - remainder === checkDigit
}

const validateLegalEntityRuc = (ruc: string): boolean => {
    const checkDigit = Number.parseInt(ruc[9], 10)
    const coefficients = [4, 3, 2, 7, 6, 5, 4, 3, 2] as const
    const remainder = calculateWeightedSum(ruc, coefficients) % 11

    return remainder === 0 && checkDigit === 0
}

const validateRuc = (ruc: string): boolean => {
    if (ruc.length !== 13 || NON_DIGIT_REGEXP.test(ruc)) {
        return false
    }

    const personType = Number.parseInt(ruc[2], 10)
    if (personType > 6 && personType !== 9) {
        return false
    }

    const provinceCode = Number.parseInt(ruc.slice(0, 2), 10)
    if (provinceCode < 1 || provinceCode > MAX_PROVINCE_CODE) {
        return false
    }

    if (ruc.slice(10, 13) === "000") {
        return false
    }

    if (personType < 6) {
        return validateNaturalPersonRuc(ruc)
    }

    if (personType === 6) {
        return validatePublicEntityRuc(ruc)
    }

    return validateLegalEntityRuc(ruc)
}

export function validDocument(value: string, type: string): boolean {
    if (!value) return false

    switch (type) {
    case "CI":
        return /^\d{10}$/.test(value) && validateCi(value)
    case "RUC":
        return /^\d{13}$/.test(value) && validateRuc(value)
    case "PPN":
        return /^(?=.*\d)[A-Za-z\d]{4,16}$/.test(value)
    default:
        return false
    }
}

export const validationPhone = new RegExp(/^(09)\d{8}$/)

/** Allows only digits while typing (max 10). Full format validated on submit. */
export const phoneInputRegExp = new RegExp(/^\d{0,10}$/)

export const validateOtp = (dataOtp: Otp) => {
    return (
        (dataOtp.cellPhone !== null || dataOtp.email !== null) &&
        dataOtp.durationOtpCodeMinutes > 0 &&
        dataOtp.mfaToken !== ""
    )
}


export const alphanumericRegExp = /^[\p{L}\d\s]+$/u
