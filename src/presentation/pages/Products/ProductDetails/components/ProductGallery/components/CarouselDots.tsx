import { ProductAsset } from "@/domain/entity/Product/product";

type Props = {
    assets: ProductAsset[];
    selectedImage: number;
    setSelectedImage: (index: number) => void;
}

const CarouselDots = ({ assets, selectedImage, setSelectedImage }: Props) => {
    return (
        <ol aria-label="imágenes del producto" className="flex items-center justify-center gap-2">
            {assets.map((asset, index) => (
                <li key={asset.id}>
                    <button
                        data-selected={selectedImage === index}
                        onClick={() => setSelectedImage(index)}
                        aria-selected={selectedImage === index}
                        role="tab"
                        aria-label={`Ir a imagen ${index + 1}`}
                        className="w-2 h-2 rounded-full cursor-pointer bg-blue-100 data-[selected=true]:bg-blue-500"
                    />
                </li>
            ))}
        </ol>
    )
}

export default CarouselDots