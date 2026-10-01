import { BasketItem } from "@/domain/entity/Basket/structure/basket";

type ShoppingCartProductFeatureLineProps = {
    feature: BasketItem["variationInfo"]["features"][number];
};

const ShoppingCartProductFeatureLine = ({ feature }: ShoppingCartProductFeatureLineProps) => (
    <p className="text-sm leading-5 text-grayscale-500">
        <span className="font-bold capitalize">{feature.name}: </span>
        <span className="font-medium">{feature.option}</span>
    </p>
);

export default ShoppingCartProductFeatureLine;
