import clsx from "clsx"
import { cn } from "@heroui/react"
import IconPing from "@/presentation/components/icons/IconPing"
import ExperienceCardPrices, { CardPricesProps } from "./ExperienceCardPrices"

export type CardContentProps = CardPricesProps & {
    title: string
    address?: string
}

const ExperienceCardContent = ({ title, address, points, isHorizontal }: CardContentProps) => (
    <div className={cn("flex-1 flex flex-col", isHorizontal ? "py-2 px-1" : "py-4 px-5")}>
        <div className="flex flex-col gap-1 h-full">
            <div>
                <p className={clsx("line-clamp-1 text-blue-500", isHorizontal ? "text-xs font-medium leading-4" : "text-[22px] leading-7")}>
                    {title}
                </p>
                {address && (
                    <div className="flex items-center gap-1">
                        <IconPing className="text-grayscale-400" />
                        <span className={clsx("text-grayscale-300 text-xs font-medium", isHorizontal ? "leading-4" : "leading-6")}>
                            {address}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between h-full gap-3">
                <ExperienceCardPrices points={points} isHorizontal={isHorizontal} />
                <p
                    className={clsx(
                        "font-medium text-grayscale-500",
                        isHorizontal ? "text-xs leading-4" : "text-sm",
                    )}
                >
                    Puedes utilizar millas + tarjeta
                </p>
            </div>
        </div>
    </div>
)

export default ExperienceCardContent
