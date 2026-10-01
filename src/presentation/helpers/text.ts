export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
        return text
    }

    return `${text.slice(0, maxLength)}...`
}

export const toTitleCase = (text: string): string =>
    text
        .toLowerCase()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
