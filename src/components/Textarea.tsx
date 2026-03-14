import {
    type ChangeEvent,
    type ChangeEventHandler,
    type ReactEventHandler,
    type ReactNode,
    type TextareaHTMLAttributes,
    useEffect,
    useId
} from 'react';
import { useFormStatus } from 'react-dom';

import { useFieldUtils } from '../hooks/useFieldUtils';
import { useOnInvalid } from '../hooks/useOnInvalid';
import type { CustomValidationMessages } from '../models/CustomValidationMessages';
import type { ValidatorFn } from '../models/ValidatorFn';
import { cn } from '../uils';
import styles from './Field.module.css';

type HTMLTextareaPropsWithoutChildren = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'>;

export type TextareaProps<T, Name extends keyof T & string> = HTMLTextareaPropsWithoutChildren &
    CustomValidationMessages & {
        label?: string;
        name: Name;
        validate?: ValidatorFn<T, T[Name]>;
        children?: (field: {
            name: Name;
            disabled: boolean;
            error?: string;
            label?: string;
            onChange: ChangeEventHandler<HTMLTextAreaElement, HTMLTextAreaElement>;
            onInvalid: ReactEventHandler<HTMLTextAreaElement>;
            textareaProps: HTMLTextareaPropsWithoutChildren;
        }) => ReactNode;
    };
export function Textarea<T, Name extends keyof T & string>({
    children,
    label,
    validate,
    ...textareaProps
}: TextareaProps<T, Name>) {
    const { disabled, name, onChange, onInvalid, rows = 3 } = textareaProps;

    const { pending } = useFormStatus();

    const { error, initialValue, setError, addValidator, removeValidator } = useFieldUtils(name);

    useEffect(() => {
        if (validate) {
            addValidator(validate);
        }

        return () => {
            removeValidator();
        };
    }, [name]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        if (error) {
            setError(undefined);
        }
    };

    const handleInvalid = useOnInvalid(name, onInvalid);

    const id = useId();

    if (children) {
        return children({
            name,
            error,
            label,
            onChange: handleChange,
            onInvalid: handleInvalid,
            disabled: disabled ?? pending,
            textareaProps: {
                defaultValue: initialValue,
                ...textareaProps
            }
        });
    }

    const textareaId = textareaProps.id ?? id;
    const errorId = `error-${textareaId}`;

    return (
        <div className={styles.fieldWrapper}>
            {label && (
                <label htmlFor={textareaId} className={styles.label}>
                    {label}
                </label>
            )}
            <textarea
                {...textareaProps}
                aria-errormessage={error ? errorId : undefined}
                aria-invalid={!!error}
                className={cn(styles.field, textareaProps.className)}
                defaultValue={initialValue}
                disabled={disabled ?? pending}
                id={textareaId}
                name={name}
                onChange={handleChange}
                onInvalid={handleInvalid}
                rows={rows}
            />
            {error && (
                <div className={styles.err} id={errorId}>
                    {error}
                </div>
            )}
        </div>
    );
}
