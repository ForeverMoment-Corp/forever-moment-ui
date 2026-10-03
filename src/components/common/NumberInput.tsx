import * as React from 'react';

export interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
    /** Numeric value. 0, null, undefined, '' and NaN all render as an empty field. */
    value?: number | string | null;
}

/** Empty string for anything that is "no meaningful number", including a default 0. */
const toDraft = (value: NumberInputProps['value']) => {
    if (value === null || value === undefined || value === '') return '';
    const n = Number(value);
    if (Number.isNaN(n) || n === 0) return '';
    return String(value);
};

const asNumber = (value: NumberInputProps['value']) => {
    if (value === null || value === undefined || value === '') return 0;
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
};

/**
 * `<input type="number">` that does not render a placeholder-like "0" and has no spinner.
 *
 * A default/unset value of 0 shows as an empty field. A 0 the user actually types stays
 * visible, because the local draft is only re-synced from the `value` prop when the two
 * differ numerically (a form reset, or switching to another record).
 *
 * The native change event is forwarded untouched, so callers keep using
 * `Number(e.target.value)`, which yields 0 for an empty field. The browser's
 * increment/decrement buttons are hidden globally in index.css.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, inputMode, ...props }, ref) => {
        const [draft, setDraft] = React.useState(() => toDraft(value));

        React.useEffect(() => {
            setDraft(prev => (asNumber(prev) === asNumber(value) ? prev : toDraft(value)));
        }, [value]);

        return (
            <input
                ref={ref}
                type="number"
                inputMode={inputMode ?? 'decimal'}
                value={draft}
                onChange={(e) => {
                    setDraft(e.target.value);
                    onChange?.(e);
                }}
                {...props}
            />
        );
    }
);
NumberInput.displayName = 'NumberInput';
