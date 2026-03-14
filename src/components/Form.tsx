import { type FormHTMLAttributes, type SubmitEvent, type SyntheticEvent, useCallback, useRef, useState } from 'react';

import { FormContext } from '../FormContext';
import type { FormErrors } from '../models/FormErrors';
import type { HTMLFieldElement } from '../models/HTMLFieldElement';
import type { ValidationErrors } from '../models/ValidationErrors';
import type { ValidatorFn } from '../models/ValidatorFn';
import { cn, getFormData } from '../uils';
import styles from './Form.module.css';

const initValidatorsMap = <T,>() => new Map<string, ValidatorFn<T, any>>();

export type FormProps<T> = {
    action: (data: T) => void | ValidationErrors<T> | Promise<void | ValidationErrors<T>>;
    initialValues?: Partial<T>;
    validate?: (values: T) => ValidationErrors<T> | undefined;
} & Omit<FormHTMLAttributes<HTMLFormElement>, 'action' | 'noValidate'>;
export function Form<T extends Record<string, any>>({
    initialValues = {},
    action,
    children,
    onReset,
    onSubmit,
    validate,
    ...props
}: FormProps<T>) {
    const formRef = useRef<HTMLFormElement>(null);

    const [validators] = useState(initValidatorsMap<T>);
    const [errors, setErrors] = useState<FormErrors>({});

    const reset = useCallback(() => {
        setErrors({});
        formRef.current?.reset();
    }, []);

    const setFieldError = useCallback((name: string, error?: string) => {
        setErrors((prev) => {
            const newErrors = { ...prev, [name]: error };
            if (!error) {
                delete newErrors[name];
            }
            return newErrors;
        });
    }, []);

    const validateForm = (form: HTMLFormElement) => {
        const formData = new FormData(form);

        const allValues = getFormData<T>(form, formData);
        const newErrors: Record<string, string> = {};

        const formElements = form.querySelectorAll<HTMLFieldElement>('[name]');
        formElements.forEach((el) => {
            const field = el;
            const fieldName = field.name;

            const customValidator = validators.get(fieldName);
            if (customValidator) {
                const errorMessage = customValidator(allValues[fieldName], {
                    ...allValues
                });
                field.setCustomValidity(errorMessage || '');
            }

            if (!field.validity.valid) {
                newErrors[fieldName] = field.validationMessage;
            }
        });

        return { newErrors, allValues };
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        const { newErrors, allValues } = validateForm(formRef.current ?? e.currentTarget ?? e.target);

        if (validate) {
            const formLevelErrors = validate(allValues);
            if (formLevelErrors) {
                Object.assign(newErrors, formLevelErrors);
            }
        }

        if (Object.keys(newErrors).length > 0) {
            e.preventDefault();
            setErrors(newErrors);

            // Fokus auf das erste fehlerhafte Element
            formRef.current?.querySelector<HTMLFieldElement>(':invalid')?.focus();
        }

        onSubmit?.(e);
    };

    const handleAction = async (formData: FormData) => {
        const form = formRef.current;
        if (!form) {
            return;
        }

        const allValues = getFormData<T>(form, formData);
        setErrors({});

        try {
            const result = await action(allValues);

            if (result && typeof result === 'object') {
                setErrors(result);
            }
        } catch {
            setErrors({
                _form: 'Ein unerwarteter Fehler ist aufgetreten.'
            });
        }
    };

    const handleReset = (e: SyntheticEvent<HTMLFormElement, Event>) => {
        onReset?.(e);
        setErrors({});

        setTimeout(() => {
            const firstInput = (formRef.current ?? e.currentTarget ?? e.target).querySelector<HTMLElement>(
                'input, select, textarea'
            );
            firstInput?.focus();
        }, 0);
    };

    return (
        <form
            {...props}
            ref={formRef}
            action={handleAction}
            className={cn(styles.form, props.className)}
            onReset={handleReset}
            onSubmit={handleSubmit}
        >
            <FormContext value={{ errors, initialValues, reset, setFieldError, validators }}>{children}</FormContext>
        </form>
    );
}
