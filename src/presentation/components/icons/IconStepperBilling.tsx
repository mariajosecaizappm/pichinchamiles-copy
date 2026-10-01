interface IconStepperBillingProps extends React.SVGProps<SVGSVGElement> {
    className?: string
}

const IconStepperBilling = ({ className, ...props }: IconStepperBillingProps) => {
    return (
        <svg
            width="27"
            height="30"
            viewBox="0 0 27 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M24.75 2.25L22.5 0L20.25 2.25L18 0L15.75 2.25L13.5 0L11.25 2.25L9 0L6.75 2.25L4.5 0L2.25 2.25L0 0V30L2.25 27.75L4.5 30L6.75 27.75L9 30L11.25 27.75L13.5 30L15.75 27.75L18 30L20.25 27.75L22.5 30L24.75 27.75L27 30V0L24.75 2.25ZM24 25.635H3V4.365H24V25.635ZM4.5 19.5H22.5V22.5H4.5V19.5ZM4.5 13.5H22.5V16.5H4.5V13.5ZM4.5 7.5H22.5V10.5H4.5V7.5Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default IconStepperBilling
