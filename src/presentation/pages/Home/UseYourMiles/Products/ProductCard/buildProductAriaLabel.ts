import { Product } from '@/domain/entity/Product/product'

export const buildProductAriaLabel = (product: Product): string => {
    const parts: string[] = [product.name]

    if (product.tags && product.tags.length > 0) {
        parts.push(product.tags.map(t => t.tag).join(', '))
    }

    if (product.minPointsPrice) {
        const raw = product.minPointsPrice.toString().replaceAll(/\D/g, '')
        const num = Number(raw)
        if (!Number.isNaN(num) && raw) {
            const formatted = raw.length > 3
                ? raw.slice(0, - 3) + '.' + raw.slice(-3)
                : raw
            parts.push(`desde ${formatted} millas`)
        }
    }

    if (product.maxPointsPrice && product.maxPointsPrice !== product.minPointsPrice) {
        const rawMax = product.maxPointsPrice.toString().replaceAll(/\D/g, '')
        if (rawMax) parts.push(`antes ${rawMax} millas`)
    }

    parts.push('ver detalle')
    return parts.join(', ')
}
