type Props = {
    searchQuery: string
    total: number
}

const ProductCampaignSearchResultsText = ({ searchQuery, total }: Props) => {
    const normalizedQuery = searchQuery.trim()
    if (normalizedQuery) {
        if (total === 0) {
            return (
                <p className="text-[22px] font-normal text-blue-500 font-slab">
                    No se encontraron resultados
                </p>
            )
        }

        return (
            <p className="text-[22px] font-normal text-blue-500 font-slab">
                Resultado de &ldquo;{normalizedQuery}&rdquo;
                {` (${total})`}
            </p>
        )
    }

    return null
}

export default ProductCampaignSearchResultsText