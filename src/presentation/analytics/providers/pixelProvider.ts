import AnalyticsProvider from "@/presentation/analytics/providers/types";
import {EventName} from "@/presentation/analytics/types";

interface ViewContentParams {
    content_ids: string[];
    content_name?: string;
    content_type: 'product' | 'product_group';
    value: number;
}

interface AddToCartParams {
    content_ids: string[];
    content_name?: string;
    content_type: 'product' | 'product_group';
    value: number;
}

interface PurchaseParams {
    content_ids: string[];
    content_type: 'product' | 'product_group';
    value: number;
    num_items?: number;
}

type FacebookPixelParams =
    | ViewContentParams
    | AddToCartParams
    | PurchaseParams
    | Record<string, unknown>;

declare global {
    interface Window {
        fbq?: (action: string, event: string, data?: FacebookPixelParams) => void;
    }
}

const fbq = (event: string, data?: FacebookPixelParams): void => {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('track', event, data);
    }
};

const pixelProvider: AnalyticsProvider = {
    name: "pixelProvider",
    track: (event) =>{
        if(event.name === EventName.PURCHASED_PRODUCT){
            const { products } = event.payload;
            fbq("Purchase", {
                content_ids: products.map(item => item.slug),
                content_type: 'product',
                value: products.map(p=> p.paymentTypes.points.amount).reduce((sum, num) => sum + num, 0),
                num_items: products.map(p=> p.quantity).reduce((sum, num) => sum + num, 0)
            })
        }

        if(event.name === EventName.ADDED_PRODUCT){
            const { product, pointsAmount } = event.payload;
            fbq("AddToCart", {
                content_ids: [product.slug],
                content_name: product.name,
                content_type: 'product',
                value: pointsAmount
            })
        }

        if(event.name === EventName.VIEWED_PRODUCT){
            const { product } = event.payload;
            fbq("ViewContent", {
                content_ids: [product.slug],
                content_name: product.name,
                content_type: 'product',
                value: product.minPointsPrice
            })
        }
    }
}

export default pixelProvider;
