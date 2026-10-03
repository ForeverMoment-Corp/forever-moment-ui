import DOMPurify from 'dompurify';

/**
 * Tags and attributes allowed in rich-text description fields. Deliberately small:
 * these values are authored in the admin UI but rendered on the storefront too, so
 * the allow-list is the contract for what can ever reach a customer's browser.
 */
const ALLOWED_TAGS = [
    'p', 'br', 'b', 'strong', 'i', 'em', 'u', 's',
    'ul', 'ol', 'li', 'a', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'blockquote',
];

const ALLOWED_ATTR = ['href', 'target', 'rel', 'title'];

/** Strips anything outside the allow-list; returns '' for nullish input. */
export const sanitizeHtml = (html?: string | null): string => {
    if (!html) return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        // No javascript:/data: URLs, no <form>/<input> smuggled into a description.
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ['style', 'script', 'iframe', 'form', 'input', 'object', 'embed'],
        FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
    });
};

/**
 * Plain-text form of a rich-text value, for places that cannot render markup:
 * table cells, truncated previews, search filters and `title` tooltips.
 */
export const htmlToPlainText = (html?: string | null): string => {
    if (!html) return '';
    // Sanitize first so the parse below never materialises an active element.
    const clean = sanitizeHtml(html);
    if (typeof document === 'undefined') return clean.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const holder = document.createElement('div');
    holder.innerHTML = clean;
    return (holder.textContent || '').replace(/\s+/g, ' ').trim();
};

/** True when a rich-text value carries no visible content (e.g. `<p><br></p>`). */
export const isHtmlEmpty = (html?: string | null): boolean => htmlToPlainText(html) === '';
