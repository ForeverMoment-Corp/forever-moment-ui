import { useMemo } from 'react';
import { sanitizeHtml } from '@/utils/html';
import { cn } from '@/lib/utils';

interface RichTextContentProps {
    html?: string | null;
    className?: string;
    /** Rendered when the value has no visible content. */
    fallback?: React.ReactNode;
}

/**
 * Read-only view of a rich-text field. The value is sanitized on the way in as well
 * as on the way out, so markup that predates the allow-list — or that arrived from
 * somewhere other than this admin UI — still cannot execute here.
 */
export const RichTextContent = ({ html, className, fallback = null }: RichTextContentProps) => {
    const clean = useMemo(() => sanitizeHtml(html), [html]);

    if (!clean) return <>{fallback}</>;

    return (
        <div
            className={cn('rich-text-content', className)}
            dangerouslySetInnerHTML={{ __html: clean }}
        />
    );
};
