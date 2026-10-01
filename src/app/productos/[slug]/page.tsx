import ProductDetails from "@/presentation/pages/Products/ProductDetails"

type Props = {
    params: Promise<{
        slug: string
    }>
}

const ProductPage = async ({ params }: Props) => {
    const { slug } = await params
    return <ProductDetails slug={slug} />
}

export default ProductPage
