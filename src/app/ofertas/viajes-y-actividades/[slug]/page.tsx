import OfferCampaignLandingContainer from "@/presentation/pages/Offers/Campaign/OfferCampaignLandingContainer"

type Props = {
    params: Promise<{
        slug: string
    }>
    searchParams?: Promise<{
        page?: string
    }>
}

const Page = async ({ params, searchParams }: Props) => {
    const { slug } = await params
    const resolvedSearchParams = searchParams ? await searchParams : {}

    return (
        <OfferCampaignLandingContainer slug={slug} searchParams={resolvedSearchParams} />
    )
}

export default Page
