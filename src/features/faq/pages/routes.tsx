import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

const Faq = lazy(() => import('./Faq'));

export const faqRoutes: RouteObject[] = [
    {
        path: 'faqs',
        element: <Faq />,
    }
];
