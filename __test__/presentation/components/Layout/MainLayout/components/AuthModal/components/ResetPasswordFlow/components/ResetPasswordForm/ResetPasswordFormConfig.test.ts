import {describe, it, expect} from "vitest"
import {
    defaultResetPasswordFormValues,
    resetPasswordFormSchema,
} from "@/presentation/components/Layout/MainLayout/components/AuthModal/components/ResetPasswordFlow/components/ResetPasswordForm/ResetPasswordFormConfig"

describe("ResetPasswordFormConfig", () => {
    describe("when defaultResetPasswordFormValues is used", () => {
        it("should have empty password and confirmPassword", () => {
            expect(defaultResetPasswordFormValues).toEqual({
                password: "",
                confirmPassword: "",
            })
        })
    })

    describe("when resetPasswordFormSchema validates confirmPassword", () => {
        it("should reject when confirmPassword does not match password", async () => {
            await expect(
                resetPasswordFormSchema.validate({
                    password: "Abcdef1!",
                    confirmPassword: "Xbcdef1!",
                }),
            ).rejects.toThrow("Las contraseñas no coinciden")
        })

        it("should accept when confirmPassword matches password", async () => {
            await expect(
                resetPasswordFormSchema.validate({
                    password: "Abcdef1!",
                    confirmPassword: "Abcdef1!",
                }),
            ).resolves.toMatchObject({
                password: "Abcdef1!",
                confirmPassword: "Abcdef1!",
            })
        })
    })
})

