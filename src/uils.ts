import type { HTMLFieldElement } from './models/HTMLFieldElement';

export function getFormData<T>(form: HTMLFormElement, formData: FormData): T {
    const data: any = {};

    const names = new Set<string>();
    const formElements: HTMLFieldElement[] = Array.from(form.querySelectorAll('[name]'));
    formElements.forEach((el) => {
        names.add(el.name);
    });

    names.forEach((name) => {
        const fields = form.querySelectorAll<HTMLFieldElement>(`[name="${name}"]`);
        const values = formData.getAll(name);

        const isMultiple = fields.length > 1 && fields[0].type === 'checkbox';

        if (isMultiple) {
            data[name] = values;
        } else if (fields.length === 1 && fields[0].type === 'checkbox') {
            data[name] = formData.has(name);
        } else {
            data[name] = values[0] ?? '';
        }
    });

    return data as T;
}

export const cn = (...classes: (string | undefined | boolean)[]) => classes.filter(Boolean).join(' ');
