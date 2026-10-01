export const getCampaignExperienceCardImage = (imageUrl: string) =>{
    return imageUrl.replace(".s3.us-east-2.amazonaws.com", "")
        .replace(".s3.us-east-1.amazonaws.com", "")
        .replace("", "")
}