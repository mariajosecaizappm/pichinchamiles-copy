import { Asset } from "@/domain/entity/Asset/asset"
import AssetImage from "@/presentation/components/AssetImage"
import { cn } from "@heroui/react"
import ExperienceCardTag from "./ExperienceCardTag"

type Props = {
    asset: Asset
    title: string
    tag?: string
    isHorizontal: boolean
    classNameImage?: string
}

const ExperienceCardImage = ({ asset, title, tag, isHorizontal, classNameImage }: Props) => {
    if (isHorizontal) {
        return (
            <div className="relative w-[140px] shrink-0 self-stretch min-h-[150px]">
                <AssetImage
                    asset={asset}
                    alt={title}
                    width={140}
                    height={150}
                    breakpoint={640}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                {tag && (
                    <div className="absolute right-2 top-2 flex gap-2 flex-wrap justify-end">
                        <ExperienceCardTag tag={tag} />
                    </div>
                )}
            </div>
        )
    }

    return (
        <AssetImage
            asset={asset}
            alt={title}
            width={250}
            height={155}
            breakpoint={640}
            className={cn("object-fill w-full max-w-[250px] h-38.75", classNameImage)}
        />
    )
}

export default ExperienceCardImage
