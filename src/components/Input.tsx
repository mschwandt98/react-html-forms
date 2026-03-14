import {
    type ChangeEvent,
    type ChangeEventHandler,
    type InputHTMLAttributes,
    type ReactEventHandler,
    type ReactNode,
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

type HTMLInputPropsWithoutChildren = Omit<InputHTMLAttributes<HTMLInputElement>, 'children'>;

export type InputProps<T, Name extends keyof T & string> = HTMLInputPropsWithoutChildren &
    CustomValidationMessages & {
        label?: string;
        name: Name;
        validate?: ValidatorFn<T, T[Name]>;
        children?: (field: {
            name: Name;
            disabled: boolean;
            error?: string;
            label?: string;
            onChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
            onInvalid: ReactEventHandler<HTMLInputElement>;
            inputProps: HTMLInputPropsWithoutChildren;
        }) => ReactNode;
    };
export function Input<T, Name extends keyof T & string>({
    children,
    label,
    validate,
    ...inputProps
}: InputProps<T, Name>) {
    const { type = 'text', disabled, name, onChange, onInvalid } = inputProps;

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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
            inputProps: {
                defaultValue: initialValue,
                ...inputProps
            }
        });
    }

    const inputId = inputProps.id ?? id;
    const errorId = `error-${inputId}`;

    const isCheckboxOrRadio = ['checkbox', 'radio'].includes(type);

    return (
        <div className={cn(styles.fieldWrapper, !isCheckboxOrRadio && styles.withGap)}>
            {isCheckboxOrRadio ? (
                <div className={styles.selectionWrapper}>
                    <input
                        {...inputProps}
                        aria-errormessage={error ? errorId : undefined}
                        aria-invalid={!!error}
                        className={cn(styles.field, inputProps.className)}
                        defaultChecked={
                            Array.isArray(initialValue)
                                ? initialValue.includes(inputProps.value)
                                : initialValue === inputProps.value
                        }
                        disabled={disabled ?? pending}
                        id={inputId}
                        name={name}
                        onChange={handleChange}
                        onInvalid={handleInvalid}
                        type={type}
                    />
                    {label && (
                        <label htmlFor={inputId} className={styles.label}>
                            {label}
                        </label>
                    )}
                </div>
            ) : (
                <>
                    {label && (
                        <label htmlFor={inputId} className={styles.label}>
                            {label}
                        </label>
                    )}
                    <input
                        {...inputProps}
                        aria-errormessage={error ? errorId : undefined}
                        aria-invalid={!!error}
                        className={cn(styles.field, inputProps.className)}
                        defaultValue={initialValue}
                        disabled={disabled ?? pending}
                        id={inputId}
                        name={name}
                        onChange={handleChange}
                        onInvalid={handleInvalid}
                        type={type}
                    />
                </>
            )}
            {error && (
                <div className={styles.err} id={errorId}>
                    {error}
                </div>
            )}
        </div>
    );
}
