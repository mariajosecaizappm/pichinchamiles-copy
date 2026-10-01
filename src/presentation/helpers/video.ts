export const getVideoId = (url: string): string | null => {
    try {
        const urlParams = new URLSearchParams(new URL(url).search);
        const videoId = urlParams.get('v');
        if (!videoId) {
            return null;
        }
        return videoId;
    } catch {
        return null;
    }
}

export const getVideoThumbnail = (url: string): string | null => {
    const videoId = getVideoId(url);
    if (!videoId) return null;
    return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export const getVideoIframeUrl = (url: string): string | null => {
    const videoId = getVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
}

