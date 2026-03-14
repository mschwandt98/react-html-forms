import type { FieldsetHTMLAttributes } from 'react';

import { useFieldUtils } from '../hooks/useFieldUtils';
import { cn } from '../uils';
import styles from './Fieldset.module.css';

export type FieldsetProps<T, Name extends keyof T & string> = {
    label: string;
    name: Name;
} & FieldsetHTMLAttributes<HTMLFieldSetElement>;
export function Fieldset<T, Name extends keyof T & string>({
    label,
    name,
    children,
    ...props
}: FieldsetProps<T, Name>) {
    const { error } = useFieldUtils(name);

    return (
        <fieldset {...props} className={cn(styles.fieldset, props.className)}>
            <legend className={styles.legend}>{label}</legend>
            <div className={styles.group}>{children}</div>
            {error && (
                <div className={styles.err} role="alert">
                    {error}
                </div>
            )}
        </fieldset>
    );
}
