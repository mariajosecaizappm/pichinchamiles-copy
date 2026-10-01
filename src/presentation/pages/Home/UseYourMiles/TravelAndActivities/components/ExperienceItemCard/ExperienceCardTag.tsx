import ProductCardTag from "../../../Products/ProductCard/ProductCardTag"
import colors from "@/presentation/style/colors"

type Props = {
    tag: string
}

const ExperienceCardTag = ({ tag }: Props) => (
    <ProductCardTag
        tag={tag}
        backgroundColor={colors.yellow[500]}
        textColor={colors.blue[500]}
        className="max-w-18 truncate"
    />
)

export default ExperienceCardTag
