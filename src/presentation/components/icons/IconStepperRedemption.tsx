interface IconStepperRedemptionProps extends React.SVGProps<SVGSVGElement> {
    className?: string
}

const IconStepperRedemption = ({ className, ...props }: IconStepperRedemptionProps) => {
    return (
        <svg
            width="29"
            height="24"
            viewBox="0 0 29 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M0 19.5H3V20.25H1.5V21.75H3V22.5H0V24H4.5V18H0V19.5ZM1.5 6H3V0H0V1.5H1.5V6ZM0 10.5H2.7L0 13.65V15H4.5V13.5H1.8L4.5 10.35V9H0V10.5ZM7.5 1.5V4.5H28.5V1.5H7.5ZM7.5 22.5H28.5V19.5H7.5V22.5ZM7.5 13.5H28.5V10.5H7.5V13.5Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default IconStepperRedemption
