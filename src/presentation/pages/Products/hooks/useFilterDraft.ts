"use client"

import { useEffect, useState } from "react"

const useFilterDraft = <T,>(urlValue: T) => {
    const [draft, setDraft] = useState<T>(urlValue)

    useEffect(() => {
        setDraft(urlValue)
    }, [urlValue])

    const reset = (value: T) => setDraft(value)

    return { draft, setDraft, reset }
}

export default useFilterDraft
