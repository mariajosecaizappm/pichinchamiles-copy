import clsx from "clsx"
import { formatMiles } from "@/presentation/helpers/quantities"

export type CardPricesProps = {
    points: number
    isHorizontal: boolean
}

const DESDE_LABEL_CLASS = "font-medium text-[14px] leading-5 text-grayscale-500"

const getPriceClass = (isHorizontal: boolean) =>
    clsx(
        "font-semibold text-blue-500",
        isHorizontal ? "text-lg leading-4" : "text-[28px] leading-7",
    )

const ExperienceCardPrices = ({ points, isHorizontal }: CardPricesProps) => (
    <p>
        <span className={DESDE_LABEL_CLASS}>Desde </span>
        <span className={getPriceClass(isHorizontal)}>
            {formatMiles(points)} millas
        </span>
    </p>
)

export default ExperienceCardPrices
