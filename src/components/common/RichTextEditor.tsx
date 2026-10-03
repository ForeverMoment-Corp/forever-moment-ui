import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Link2, Link2Off, RemoveFormatting } from 'lucide-react';
import { sanitizeHtml } from '@/utils/html';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
    /** Current value as an HTML string. */
    value: string;
    /** Receives the sanitized HTML, or '' when the editor is visually empty. */
    onChange: (html: string) => void;
    label?: string;
    error?: string;
    placeholder?: string;
    disabled?: boolean;
    /** Applied to the editable area, so callers can set sizing like the Textarea's className. */
    className?: string;
    id?: string;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    /** Focus the editable area on mount — used by the click-to-edit detail panels. */
    autoFocus?: boolean;
}

type Command = 'bold' | 'italic' | 'underline' | 'insertUnorderedList' | 'insertOrderedList' | 'removeFormat';

const TOOLBAR: { command: Command; title: string; icon: typeof Bold }[] = [
    { command: 'bold', title: 'Bold', icon: Bold },
    { command: 'italic', title: 'Italic', icon: Italic },
    { command: 'underline', title: 'Underline', icon: Underline },
    { command: 'insertUnorderedList', title: 'Bulleted list', icon: List },
    { command: 'insertOrderedList', title: 'Numbered list', icon: ListOrdered },
];

/**
 * A `contenteditable` surface that reads and writes HTML, shaped like the shared
 * Textarea so it can stand in for one: `value` / `onChange` / `label` / `error`.
 *
 * `onChange` always reports sanitized HTML, so whatever reaches the store (and the
 * backend) has already been through the same allow-list used to render it.
 */
export const RichTextEditor = React.forwardRef<HTMLDivElement, RichTextEditorProps>(({
    value,
    onChange,
    label,
    error,
    placeholder = 'Write a description…',
    disabled,
    className,
    id,
    onBlur,
    onKeyDown,
    autoFocus,
}, forwardedRef) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>({});
    const [isFocused, setIsFocused] = useState(false);

    const setRefs = useCallback((node: HTMLDivElement | null) => {
        editorRef.current = node;
        if (typeof forwardedRef === 'function') forwardedRef(node);
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }, [forwardedRef]);

    // Push `value` in only when it differs from what is already rendered. Writing on
    // every render would reset the caret to the start on each keystroke.
    useEffect(() => {
        const node = editorRef.current;
        if (!node) return;
        const next = sanitizeHtml(value || '');
        if (node.innerHTML !== next) node.innerHTML = next;
    }, [value]);

    useEffect(() => {
        if (autoFocus) editorRef.current?.focus();
    }, [autoFocus]);

    const refreshActiveCommands = useCallback(() => {
        if (disabled) return;
        const next: Record<string, boolean> = {};
        for (const { command } of TOOLBAR) {
            try {
                next[command] = document.queryCommandState(command);
            } catch {
                next[command] = false;
            }
        }
        setActiveCommands(next);
    }, [disabled]);

    const emitChange = useCallback(() => {
        const node = editorRef.current;
        if (!node) return;
        const html = sanitizeHtml(node.innerHTML);
        // An "empty" contenteditable still holds markup like <br> or <p></p>; report ''
        // so required-field checks and `value || 'Empty'` fallbacks keep working.
        const isBlank = node.textContent?.trim() === '' && !/<(img|hr)\b/i.test(html);
        onChange(isBlank ? '' : html);
    }, [onChange]);

    const runCommand = useCallback((command: Command) => {
        if (disabled) return;
        const node = editorRef.current;
        if (!node) return;
        node.focus();
        document.execCommand(command, false);
        refreshActiveCommands();
        emitChange();
    }, [disabled, emitChange, refreshActiveCommands]);

    const applyLink = useCallback(() => {
        if (disabled) return;
        const node = editorRef.current;
        if (!node) return;
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            window.alert('Select the text you want to turn into a link first.');
            return;
        }
        const url = window.prompt('Link URL', 'https://');
        if (!url) return;
        node.focus();
        document.execCommand('createLink', false, url);
        emitChange();
    }, [disabled, emitChange]);

    const removeLink = useCallback(() => {
        if (disabled) return;
        editorRef.current?.focus();
        document.execCommand('unlink', false);
        emitChange();
    }, [disabled, emitChange]);

    // Paste as plain text so copied styles from Word or another site cannot smuggle
    // in markup the sanitizer would only have to strip again.
    const handlePaste = useCallback((e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
        emitChange();
    }, [emitChange]);

    const isEmpty = !value || value.trim() === '';

    return (
        <div className="w-full space-y-2">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm font-medium leading-none text-gray-700 dark:text-gray-300"
                >
                    {label}
                </label>
            )}

            <div
                className={cn(
                    'rounded-md border border-input bg-transparent shadow-sm transition-colors',
                    isFocused && 'ring-1 ring-[var(--accent-ring)] border-[var(--accent)]',
                    error && 'border-red-500',
                    disabled && 'opacity-50'
                )}
            >
                {/* ── Toolbar ─────────────────────────────── */}
                <div className="flex flex-wrap items-center gap-0.5 border-b border-input px-1.5 py-1">
                    {TOOLBAR.map(({ command, title, icon: Icon }) => (
                        <ToolbarButton
                            key={command}
                            title={title}
                            disabled={disabled}
                            active={activeCommands[command]}
                            onClick={() => runCommand(command)}
                        >
                            <Icon size={14} />
                        </ToolbarButton>
                    ))}
                    <span className="mx-1 h-4 w-px bg-input" />
                    <ToolbarButton title="Add link" disabled={disabled} onClick={applyLink}>
                        <Link2 size={14} />
                    </ToolbarButton>
                    <ToolbarButton title="Remove link" disabled={disabled} onClick={removeLink}>
                        <Link2Off size={14} />
                    </ToolbarButton>
                    <ToolbarButton title="Clear formatting" disabled={disabled} onClick={() => runCommand('removeFormat')}>
                        <RemoveFormatting size={14} />
                    </ToolbarButton>
                </div>

                {/* ── Editable area ───────────────────────── */}
                <div className="relative">
                    {isEmpty && !isFocused && (
                        <span className="pointer-events-none absolute left-3 top-2 text-sm text-muted-foreground">
                            {placeholder}
                        </span>
                    )}
                    <div
                        id={id}
                        ref={setRefs}
                        role="textbox"
                        aria-multiline="true"
                        aria-label={label}
                        contentEditable={!disabled}
                        suppressContentEditableWarning
                        onInput={emitChange}
                        onBlur={() => { setIsFocused(false); emitChange(); onBlur?.(); }}
                        onFocus={() => setIsFocused(true)}
                        onKeyUp={refreshActiveCommands}
                        onMouseUp={refreshActiveCommands}
                        onKeyDown={onKeyDown}
                        onPaste={handlePaste}
                        className={cn(
                            'rich-text-content min-h-[80px] w-full px-3 py-2 text-sm leading-relaxed outline-none',
                            'text-gray-900 dark:text-gray-100',
                            disabled && 'cursor-not-allowed',
                            className
                        )}
                    />
                </div>
            </div>

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        </div>
    );
});
RichTextEditor.displayName = 'RichTextEditor';

const ToolbarButton = ({
    title, onClick, disabled, active, children,
}: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    children: React.ReactNode;
}) => (
    <button
        type="button"
        title={title}
        aria-label={title}
        aria-pressed={!!active}
        disabled={disabled}
        // The editor loses its selection on mousedown, so keep focus where it is.
        onMouseDown={(e) => e.preventDefault()}
        onClick={onClick}
        className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded transition-colors',
            'text-slate-600 dark:text-slate-300',
            'hover:bg-slate-100 dark:hover:bg-gray-700',
            active && 'bg-[var(--accent-light)] text-[var(--accent)]',
            disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
        )}
    >
        {children}
    </button>
);
