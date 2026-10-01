interface IconChevronRightProps extends React.SVGProps<SVGSVGElement> {
    color?: string;
}

const IconChevronRight = ({
    color = "currentColor",
    width = "5",
    height = "9",
    ...props
}: IconChevronRightProps) => {
    return (
        <svg
            data-testid="chevron-right-icon"
            width={width}
            height={height}
            viewBox="0 0 6 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M0 7.63702L3.30288 4.32692L0 1.01683L1.01683 0L5.34375 4.32692L1.01683 8.65385L0 7.63702Z"
                fill={color}
            />
        </svg>
    );
};

export default IconChevronRight;
