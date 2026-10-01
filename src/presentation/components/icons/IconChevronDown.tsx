import React from "react"

export interface IconChevronDownProps extends React.SVGProps<SVGSVGElement> {
    color?: string
    width?: number | string
    height?: number | string
}

const IconChevronDown = ({
    color = "#2F7ABF",
    width = 10,
    height = 7,
    ...props
}: IconChevronDownProps) => {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 10 7"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M1.175 0L5 3.81667L8.825 0L10 1.175L5 6.175L0 1.175L1.175 0Z"
                fill={color}
            />
        </svg>
    )
}

export default IconChevronDown
