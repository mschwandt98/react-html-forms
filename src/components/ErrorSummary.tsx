import { type HTMLAttributes, useEffect, useId, useRef } from 'react';

import { useForm } from '../hooks/useForm';
import { cn } from '../uils';
import styles from './ErrorSummary.module.css';

export type ErrorSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'aria-labelledby' | 'role' | 'tabIndex'>;
export function ErrorSummary(props: ErrorSummaryProps) {
    const { errors } = useForm();
    const summaryRef = useRef<HTMLDivElement>(null);

    const errorEntries = Object.entries(errors);
    useEffect(() => {
        if (errorEntries.length > 0) {
            summaryRef.current?.focus();
        }
    }, [errors]);

    const id = useId();

    if (errorEntries.length === 0) {
        return;
    }

    return (
        <div
            {...props}
            ref={summaryRef}
            aria-labelledby={id}
            className={cn(styles.summary, props.className)}
            role="alert"
            tabIndex={-1}
        >
            <div id={id} className={styles.title}>
                Es gibt Probleme mit deiner Eingabe:
            </div>
            {errors._form && (
                <p className="global-error-message">
                    <strong>Achtung:</strong> {errors._form}
                </p>
            )}
            <ul className={styles.list}>
                {errorEntries.map(([name, message]) =>
                    name === '_form' ? undefined : (
                        <li key={name}>
                            <button
                                className={styles.errBtn}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const element = document.getElementsByName(name)[0];
                                    if (element) {
                                        element.focus();
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                {message}
                            </button>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
