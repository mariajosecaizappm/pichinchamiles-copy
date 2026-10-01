import colors from '@/presentation/style/colors'
import { cn } from '@heroui/react'

type Props = {
    tag: string
    backgroundColor?: string
    textColor?: string
    className?: string
}

const ProductCardTag = ({ tag, backgroundColor, textColor, className }: Props) => {
    return (
        <span
            aria-label={tag}
            className={cn("uppercase py-1 px-1.5 rounded-lg text-xs font-sans font-bold leading-2.75", className)}
            style={{
                backgroundColor: backgroundColor == '' ? colors.yellow[500] : backgroundColor,
                color: textColor == '' ? colors.blue[500] : textColor  
            }}
        >{tag}</span>
    )
}

export default ProductCardTag
