import { ReactNode } from "react"
import clsx from "clsx"
import { colStyles } from "./styles"

export type ColSizing = {
  xs?: number
  sm?: number
  md?: number
  lg?: number
  xl?: number
  xxl?: number
}

type Props = {
  children: ReactNode
} & ColSizing &
  React.HTMLAttributes<HTMLDivElement>

const Col = ({
    children,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    className,
    ...rest
}: Props) => {
    return (
        <div
            className={clsx(colStyles(xs, sm, md, lg, xl, xxl), className)}
            {...rest}
        >
            {children}
        </div>
    )
}

export default Col
