import type { RouteObject } from 'react-router-dom';
import PromotionAssets from './PromotionAssets';

export const promotionAssetRoutes: RouteObject[] = [
    {
        path: 'promotion-assets',
        element: <PromotionAssets />,
    },
];
