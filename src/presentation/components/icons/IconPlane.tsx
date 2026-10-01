interface IconPlaneProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

const IconPlane = ({ className, ...props }: IconPlaneProps) => {
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
            <path d="M2.49984 19.0003H21.4998V21.0003H2.49984V19.0003ZM22.0698 9.64031C21.8598 8.84031 21.0298 8.36031 20.2298 8.58031L14.9198 10.0003L8.01984 3.57031L6.08984 4.08031L10.2298 11.2503L5.25984 12.5803L3.28984 11.0403L1.83984 11.4303L4.42984 15.9203L20.9998 11.4903C21.8098 11.2603 22.2798 10.4403 22.0698 9.64031Z" fill="currentColor" />
        </svg>
    )
}

export default IconPlane