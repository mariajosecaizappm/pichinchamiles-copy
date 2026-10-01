"use client"

import pageMetadata from "@/presentation/config/metadata"
import { useEffect } from "react"

type Props = {
    title: string
}

const DocumentTitle = ({ title }: Props) => {
    useEffect(() => {
        document.title = `${title} | ${pageMetadata.siteName}`
    }, [title])

    return null
}

export default DocumentTitle
