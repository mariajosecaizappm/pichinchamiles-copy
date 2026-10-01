import React, { FC } from 'react';
import OtpFormContainer, { OtpFormContainerRenderProps, OtpFormProps } from "./OtpFormContainer";
import Form from "@/presentation/components/Form/context/Form";
import FormOtpInput from "@/presentation/components/Form/controls/FormOtpInput";
import {
    defaultOtpFormValues, onOtpFormError,
    otpFormSchema,
} from "@/presentation/components/Layout/OtpForm/OtpFormConfig";
import OtpFormText from "@/presentation/components/Layout/OtpForm/components/OtpFormText";
import OtpFormAccordion from "@/presentation/components/Layout/OtpForm/components/OtpFormAccordion";
import { Divider } from "@heroui/divider";
import OtpFormBlocked from "@/presentation/components/Layout/OtpForm/components/OtpFormBlocked";

const OtpForm: FC<OtpFormProps> = (props) => {
    return (
        <OtpFormContainer {...props}>
            {(containerProps: OtpFormContainerRenderProps) => {
                const {
                    otpExpiredDate,
                    isExpired,
                    blockedUntil,
                    invalidAttempt,
                    formRef,
                    phone,
                    email,
                    handleSubmit,
                    resendOtp,
                    isSendingOtp,
                    isResendingOtp,
                    handleExpireOtp,
                    handleBlock,
                    handleUnblock,
                    setInvalidAttempt
                } = containerProps;

                if (blockedUntil) {
                    return (
                        <OtpFormBlocked
                            blockedUntil={blockedUntil}
                            onUnblock={handleUnblock}
                            onContinueBlockUser={props.onContinueBlockUser}
                        />
                    )
                }

                return (
                    <Form
                        className="w-full flex-1"
                        initialValues={defaultOtpFormValues}
                        onSubmit={handleSubmit}
                        schema={otpFormSchema}
                        onError={(error) => onOtpFormError(error, setInvalidAttempt, handleBlock)}
                        ref={formRef}
                        formErrorId="formsAlert"
                        autoFocusOn="code"
                    >
                        {props.title ? (
                            <div className='flex flex-col items-center gap-4'>
                                <h3 className="text-[22px] leading-7 text-blue-500 font-semibold">{props.title}</h3>
                                <p className="">
                                    Ingresa el código de 6 dígitos que hemos enviado a tu correo electrónico {email} y/o celular [{phone}]
                                </p>
                            </div>
                        ) : (
                            <p className="typo-main-caption-book text-center">
                                Ingresa el código de 6 dígitos que hemos enviado a tu correo electrónico {email} y/o celular [{phone}]
                            </p>
                        )}
                        <div className="flex w-full justify-center mt-4">
                            <FormOtpInput
                                name="code"
                                testId="inputOtp"
                                isDisabled={isSendingOtp || isResendingOtp}
                                length={6}
                                leftHelperText={
                                    <OtpFormText
                                        otpExpiredDate={otpExpiredDate}
                                        isExpired={isExpired}
                                        isSendingOtp={isSendingOtp}
                                        isResendingOtp={isResendingOtp}
                                        isInvalidAttempt={invalidAttempt}
                                        onResendOtp={resendOtp}
                                        onExpireOtp={handleExpireOtp}
                                        errorId="code-error"
                                    />
                                }
                                isInvalid={invalidAttempt}
                                className="max-w-102 mx-auto w-full"
                                classNames={{
                                    segmentWrapper: "justify-between w-full gap-2",
                                    segment: "flex-1 !w-auto h-[48px]",
                                }}
                                disabled={isExpired}
                                onInput={() => setInvalidAttempt(false)}
                                onComplete={() => {
                                    formRef.current?.submitForm();
                                }}
                            />
                        </div>
                        <Divider className="bg-darkGrayishBlue-300 mt-5.5 mb-2" />
                        <OtpFormAccordion />
                    </Form>
                );
            }}
        </OtpFormContainer>
    );
};

export default OtpForm;