import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

import { cn } from '../uils';
import styles from './SubmitButton.module.css';

type HTMLButtonPropsWithoutChildren = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

export type SubmitButtonProps<T, Name extends keyof T & string> = HTMLButtonPropsWithoutChildren & {
    name?: Name;
    children?:
        | ReactNode
        | ((field: {
              disabled: boolean;
              type: HTMLButtonPropsWithoutChildren['type'];
              buttonProps: HTMLButtonPropsWithoutChildren;
          }) => ReactNode);
};
export function SubmitButton<T, Name extends keyof T & string>({
    children,
    ...buttonProps
}: SubmitButtonProps<T, Name>) {
    const { pending } = useFormStatus();

    const { disabled = pending, type = buttonProps.formAction ? undefined : 'submit', ...props } = buttonProps;

    if (typeof children === 'function') {
        return children({
            disabled,
            type,
            buttonProps
        });
    }

    return (
        <button
            {...buttonProps}
            className={cn(styles.btn, buttonProps.className)}
            disabled={disabled ?? pending}
            type={type ?? (props.formAction ? undefined : 'submit')}
        >
            {children}
        </button>
    );
}
