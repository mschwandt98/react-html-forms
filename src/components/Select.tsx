import {
    type ChangeEvent,
    type ChangeEventHandler,
    type ReactEventHandler,
    type ReactNode,
    type SelectHTMLAttributes,
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

type HTMLSelectPropsWithoutChildren = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>;

export type SelectProps<T, Name extends keyof T & string> = HTMLSelectPropsWithoutChildren &
    CustomValidationMessages & {
        label?: string;
        name: Name;
        validate?: ValidatorFn<T, T[Name]>;
        children?:
            | ReactNode
            | ((field: {
                  name: Name;
                  disabled: boolean;
                  error?: string;
                  label?: string;
                  onChange: ChangeEventHandler<HTMLSelectElement, HTMLSelectElement>;
                  onInvalid: ReactEventHandler<HTMLSelectElement>;
                  selectProps: HTMLSelectPropsWithoutChildren;
              }) => ReactNode);
    };
export function Select<T, Name extends keyof T & string>({
    children,
    label,
    validate,
    ...selectProps
}: SelectProps<T, Name>) {
    const { disabled, name, onChange, onInvalid } = selectProps;

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

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange?.(e);
        if (error) {
            setError(undefined);
        }
    };

    const handleInvalid = useOnInvalid(name, onInvalid);

    const id = useId();

    if (typeof children === 'function') {
        return children({
            name,
            error,
            onChange: handleChange,
            onInvalid: handleInvalid,
            disabled: disabled ?? pending,
            selectProps: {
                defaultValue: initialValue,
                ...selectProps
            }
        });
    }

    const inputId = selectProps.id ?? id;
    const errorId = `error-${inputId}`;

    return (
        <div className={styles.fieldWrapper}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
            )}
            <select
                {...selectProps}
                aria-errormessage={error ? errorId : undefined}
                aria-invalid={!!error}
                className={cn(styles.field, selectProps.className)}
                defaultValue={initialValue}
                disabled={disabled ?? pending}
                id={inputId}
                name={name}
                onChange={handleChange}
                onInvalid={handleInvalid}
            >
                {children}
            </select>
            {error && (
                <div className={styles.err} id={errorId}>
                    {error}
                </div>
            )}
        </div>
    );
}
