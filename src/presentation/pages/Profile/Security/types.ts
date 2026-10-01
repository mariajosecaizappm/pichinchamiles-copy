export type EmailFormValues = {
    email: string;
    newEmail: string | undefined;
    emailConfirmation: string | undefined;
};

export type PasswordFormValues = {
    password: string;
    newPassword: string;
    newPasswordConfirm: string;
};

export type SecurityFormValues = EmailFormValues | PasswordFormValues;