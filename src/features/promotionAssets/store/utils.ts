import { format, isAfter, isBefore, isValid, parseISO } from 'date-fns';
import { getMediaAssetUrl } from '@/features/images/store/api';
import type { PromotionAssetPayload, PromotionAssetType } from './action-types';

/**
 * The backend uses LocalDateTime (no zone). Jackson normally emits an ISO string such as
 * "2026-10-02T10:00:00", but a timestamp-array form ([y, M, d, h, m, s]) is tolerated too.
 */
export const parseApiDate = (value?: string | number[] | Date | null): Date | null => {
    if (!value) return null;
    if (value instanceof Date) return isValid(value) ? value : null;
    if (Array.isArray(value)) {
        const [y, m = 1, d = 1, h = 0, min = 0, s = 0] = value;
        const date = new Date(y, m - 1, d, h, min, s);
        return isValid(date) ? date : null;
    }
    const date = parseISO(value);
    return isValid(date) ? date : null;
};

/** Value to send to the API: local wall-clock time formatted as `yyyy-MM-dd'T'HH:mm:ss`. */
export const toApiDateTime = (value?: string | number[] | Date | null): string | null => {
    const date = parseApiDate(value);
    return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss") : null;
};

/** Value for an `<input type="datetime-local">`. */
export const toInputDateTime = (value?: string | null): string => {
    const date = parseApiDate(value);
    return date ? format(date, "yyyy-MM-dd'T'HH:mm") : '';
};

export const formatDateTime = (value?: string | null, fallback = '—'): string => {
    const date = parseApiDate(value);
    return date ? format(date, 'dd MMM yyyy, HH:mm') : fallback;
};

export type ScheduleState = 'live' | 'scheduled' | 'expired' | 'inactive';

export const SCHEDULE_STATES: ScheduleState[] = ['live', 'scheduled', 'expired', 'inactive'];

export const SCHEDULE_LABEL: Record<ScheduleState, string> = {
    live: 'Live',
    scheduled: 'Scheduled',
    expired: 'Expired',
    inactive: 'Inactive',
};

export const SCHEDULE_BADGE_VARIANT: Record<ScheduleState, 'success' | 'info' | 'warning' | 'neutral'> = {
    live: 'success',
    scheduled: 'info',
    expired: 'warning',
    inactive: 'neutral',
};

/** What the public endpoint would do with this row right now. */
export const getScheduleState = (asset: Pick<PromotionAssetType, 'isActive' | 'startAt' | 'endAt'>, now: Date = new Date()): ScheduleState => {
    if (!asset.isActive) return 'inactive';
    const start = parseApiDate(asset.startAt);
    const end = parseApiDate(asset.endAt);
    if (start && isBefore(now, start)) return 'scheduled';
    if (end && isAfter(now, end)) return 'expired';
    return 'live';
};

export const describeWindow = (asset: Pick<PromotionAssetType, 'startAt' | 'endAt'>): string => {
    const start = parseApiDate(asset.startAt);
    const end = parseApiDate(asset.endAt);
    if (!start && !end) return 'Always on';
    if (start && !end) return `From ${formatDateTime(asset.startAt)}`;
    if (!start && end) return `Until ${formatDateTime(asset.endAt)}`;
    return `${formatDateTime(asset.startAt)} → ${formatDateTime(asset.endAt)}`;
};

export const heroSrc = (asset: Partial<PromotionAssetType>) =>
    getMediaAssetUrl(asset.heroUrl || asset.url || asset.originalUrl || asset.thumbnailUrl);

export const thumbSrc = (asset: Partial<PromotionAssetType>) =>
    getMediaAssetUrl(asset.thumbnailUrl || asset.heroUrl || asset.url || asset.originalUrl);

/**
 * Every PUT replaces the whole record (including the media binding), so inline edits must
 * always start from the full row and override only what changed.
 */
export const toPayload = (
    asset: PromotionAssetType,
    overrides: Partial<PromotionAssetPayload> = {},
): PromotionAssetPayload => ({
    mediaId: asset.mediaId ?? null,
    promoKey: asset.promoKey,
    placement: asset.placement,
    startAt: toApiDateTime(asset.startAt),
    endAt: toApiDateTime(asset.endAt),
    priority: asset.priority ?? 100,
    isActive: asset.isActive ?? true,
    title: asset.title ?? null,
    altTextOverride: asset.altTextOverride ?? null,
    ...overrides,
});

/** Client-side mirror of the backend's validation so users get feedback before the round trip. */
export const validatePayload = (payload: PromotionAssetPayload): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (payload.mediaId == null) errors.mediaId = 'Pick an image from the media library.';
    if (!payload.promoKey?.trim()) errors.promoKey = 'Promotion key is required.';
    else if (payload.promoKey.trim().length > 100) errors.promoKey = 'Promotion key cannot exceed 100 characters.';
    if (!payload.placement?.trim()) errors.placement = 'Placement is required.';
    else if (payload.placement.trim().length > 40) errors.placement = 'Placement cannot exceed 40 characters.';
    if (payload.title && payload.title.length > 120) errors.title = 'Title cannot exceed 120 characters.';
    if (payload.altTextOverride && payload.altTextOverride.length > 300) errors.altTextOverride = 'Alt text cannot exceed 300 characters.';
    if (!Number.isInteger(payload.priority)) errors.priority = 'Priority must be a whole number.';
    const start = parseApiDate(payload.startAt);
    const end = parseApiDate(payload.endAt);
    if (start && end && isBefore(end, start)) errors.endAt = 'End must be on or after the start.';
    return errors;
};
