import React from "react"
import {render, screen} from "@testing-library/react"
import {describe, it, expect, vi} from "vitest"
import {ApiError} from "@/domain/entity/Error/models/ApiError"
import {ErrorCode} from "@/domain/entity/Error/structure/error"
import {
    defaultIdentificationFormValues,
    identificationFormSchema,
    onIdentificationFormError,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/IdentificationForm/IdentificationFormConfig"

vi.mock("next/link", async () => {
    const React = await import("react")
    return {
        default: (props: any) => {
            const {href, children, ...rest} = props
            return (
                <a href={typeof href === "string" ? href : ""} {...rest}>
                    {children}
                </a>
            )
        },
    }
})

describe("IdentificationFormConfig", () => {
    describe("when defaultIdentificationFormValues is used", () => {
        it("should have an empty identificationNumber", () => {
            expect(defaultIdentificationFormValues).toEqual({
                identificationNumber: "",
            })
        })
    })

    describe("when identificationFormSchema validates identificationNumber", () => {
        it("should reject when value is undefined with required message", async () => {
            await expect(
                identificationFormSchema.validate({
                    identificationNumber: undefined,
                }),
            ).rejects.toMatchObject({
                message: "El documento de identificación es requerido",
            })
        })

        it("should reject when value is shorter than 4 with min message", async () => {
            await expect(
                identificationFormSchema.validate({
                    identificationNumber: "123",
                }),
            ).rejects.toMatchObject({
                message:
                    "El documento de identificación debe tener al menos 4 dígitos",
            })
        })

        it("should accept when value has 4 or more characters", async () => {
            await expect(
                identificationFormSchema.validate({
                    identificationNumber: "1234",
                }),
            ).resolves.toEqual({identificationNumber: "1234"})
        })
    })

    describe("when onIdentificationFormError receives INVALID_USER", () => {
        it("should return a message with phone number", () => {
            const errorNode = onIdentificationFormError(
                new ApiError(ErrorCode.INVALID_USER),
            )

            render(<div>{errorNode}</div>)

            expect(
                screen.getByText(
                    /El documento de identificación ingresado no forma parte del programa\./i,
                ),
            ).toBeInTheDocument()

            expect(
                screen.getByText(/1800\s*-\s*BPMILE\s*\(276-453\)/i),
            ).toBeInTheDocument()
        })
    })

    describe("when onIdentificationFormError receives USER_CANCELED", () => {
        it("should return a blocked access message with phone number", () => {
            const errorNode = onIdentificationFormError(
                new ApiError(ErrorCode.USER_CANCELED),
            )

            render(<div>{errorNode}</div>)

            expect(
                screen.getByText(
                    /El número de identificación se encuentra bloqueado o no tiene permitido el acceso\./i,
                ),
            ).toBeInTheDocument()

            expect(
                screen.getByText(/1800\s*-\s*BPMILE\s*\(276-453\)/i),
            ).toBeInTheDocument()
        })
    })

    describe("when onIdentificationFormError receives an unhandled code", () => {
        it("should return undefined", () => {
            expect(onIdentificationFormError(new ApiError(ErrorCode.UNKNOWN))).toBeUndefined()
        })
    })
})

