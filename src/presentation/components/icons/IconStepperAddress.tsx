interface IconStepperAddressProps extends React.SVGProps<SVGSVGElement> {
    className?: string
}

const IconStepperAddress = ({ className, ...props }: IconStepperAddressProps) => {
    return (
        <svg
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="M18 6C20.895 6 25.5 8.1 25.5 13.725C25.5 16.965 22.92 20.73 18 24.705C13.08 20.73 10.5 16.95 10.5 13.725C10.5 8.1 15.105 6 18 6ZM18 3C13.095 3 7.5 6.69 7.5 13.725C7.5 18.405 10.995 23.34 18 28.5C25.005 23.34 28.5 18.405 28.5 13.725C28.5 6.69 22.905 3 18 3Z"
                fill="currentColor"
            />
            <path
                d="M18 10.5C16.35 10.5 15 11.85 15 13.5C15 15.15 16.35 16.5 18 16.5C18.7956 16.5 19.5587 16.1839 20.1213 15.6213C20.6839 15.0587 21 14.2956 21 13.5C21 12.7044 20.6839 11.9413 20.1213 11.3787C19.5587 10.8161 18.7956 10.5 18 10.5V10.5ZM7.5 30H28.5V33H7.5V30Z"
                fill="currentColor"
            />
        </svg>
    )
}

export default IconStepperAddress
