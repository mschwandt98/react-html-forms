# react-html-forms

**Type-safe, native HTML forms for React 19.**

react-html-forms brings the simplicity of native HTML back to your React apps without sacrificing first-class typing, validation, and modern UX.


## ✨ Features
- 🪶 Ultra-Lightweight: Only ~5 KB (gzipped). Minimal footprint for maximum performance.
- 🔌 Native-First: Based on the native HTML5 Constraint Validation API. No heavy validation engine required.
- 🎨 CSS Modules: Clean, encapsulated styling without “style leakage” into the rest of your project.
- ♿ Accessible by Default: Automatic handling of aria-invalid, aria-describedby, and label bindings.
- 🛠️ Developer Experience: Full TypeScript support and an intuitive factory function for creating type-safe form components.
- 📦 Zero Dependencies: No unnecessary packages in node_modules—only React as a peer dependency.


## 🛠 Installation
```bash
npm install react-html-forms
```


## 🚀 Quick Start
```tsx
import { createFormComponents } from 'react-html-forms';

interface UserData {
  username: string;
  email: string;
}

const { Form, Input, ErrorSummary, SubmitButton } = createFormComponents<UserData>();

export default function MyForm() {
    const handleAction = async (data: UserData) => {
        // your server action logic
        console.log(data);
    };

    return (
        <Form
            action={handleAction}
            validate={(values) => {
                const errors = {};
                if (values.username === "admin") {
                    errors.username = "The username is not allowed."
                }
                return errors;
            }}
        >
            <ErrorSummary />

            <Input name="username" label="Username" required />
            <Input name="email" label="Email address" type="email" required />

            <SubmitButton>Save</SubmitButton>
        </Form>
    );
}
```


## 🔍 Features in Detail
### 1. The Factory (`createFormComponents`)
Create type-safe components for your specific data model. This way, you don't have to add the generic `<T>` to every single input component.

```ts
interface UserProfile {
  name: string;
  age: number;
}

const { Form, Input, SubmitButton, ErrorSummary } = createFormComponents<UserProfile>();
```


### 2. Synchronous & Asynchronous Validation
You can validate errors synchronously directly in the client (both globally on the form and directly on the component) or use the return values of your asynchronous server action.

```ts
<Form
    action={async (data) => {
        const result = await saveToDatabase(data);
        if (result.error) {
            return { _form: "The Server is overloaded." }; // Global error
        }
    }}
    validate={(values) => {
        const errors: ValidationErrors<UserProfile> = {};
        if (values.name === "admin") {
            errors.name = "The username is not allowed."
        };
        return errors;
    }}
>
    {/* ... */}
    <Input
        name="name"
        required
        minLength={3}
    />
    <Input
        name="age"
        type="number"
        required
        min={0}
        max={110}
        validate={(value, allValues) => {
            /* custom validation */
        }}
    />
    {/* ... */}
</Form>
```


### 3. Global Error Handling (`_form`)
Sometimes an error isn't associated with a specific field (e.g., "Login failed"). In that case, use the special `_form` key.

```tsx
<Form
    action={(data) => {
        try {
            /* data processing throws errors */
        } catch (e) {
            return {
                _form: e.message || 'Unknown error occured'
            }
        }
    })}
>
    {/* ... */}
</Form>
```


### 4. ErrorSummary (A11y)
A central list of all errors at the top of the form.
- Prominently displays the global `_form` error.
- Provides clickable buttons for field errors that use `focus()` and `scrollIntoView()` to navigate directly to the problem.


### 5. Native reset support
A standard `<button type="reset">` not only resets the HTML fields, but also automatically clears your library's internal error state.


### 6. Easy Component Library Integration
Thanks to the `useFieldUtils` hooks, you can integrate any third-party library (such as Material UI or Headless UI):

```tsx
<Input
    name="name"
    validate={(val) => {
        return val === "admin" ? "The username is not allowed." : undefined;
    }}
>
    {({ disabled, name, onChange, error, inputProps }) => (
        <MuiTextField
            disabled={disabled}
            error={!!error}
            helperText={error}
            name={name}
            onChange={onChange}
            required={inputProps.required}
        />
    )}
</Input>
```

Or use the built-in components as wrappers with a `children` render function for your own field component:

```tsx
import { TextField } from '@mui/material';
import { useForm } from 'react-html-forms';

function MyCustomInput({ name, label }: { name: keyof MyData; label: string }) {
    const { error } = useFieldUtils(name);

    return (
        <TextField
            name={name} // important for FormData!
            label={label}
            error={!!error}
            helperText={error}
            fullWidth
        />
    );
}
```


## 💬 Custom Validation Messages
By default, the library uses the browser's validation messages. However, you can easily replace these with your own messages by adding data attributes to your components. This works seamlessly with native HTML5 validation attributes such as required, min, max, or pattern.

Simply add the appropriate attribute to override the message for this error type:
| Attribute | Validation-Trigger |
| --------- | ------------------ |
| `data-required-message` | `required` |
| `data-type-message` | `type="email"`, `type="url"`, etc. |
| `data-maxlength-message` | `maxLength` |
| `data-max-message` | `max` |
| `data-minlength-message` | `minLength` |
| `data-min-message` | `min` |
| `data-pattern-message` | `pattern` (Regex) |

Example:
```tsx
<Input
    name="email"
    type="email"
    required
    label="Email address"
    data-required-message="We need your email address so we can reply to you."
    data-type-message="That doesn't look like a real email."
/>

<Input
    name="password"
    type="password"
    minLength={8}
    label="Password"
    data-minlength-message="Your password must be at least 8 characters long."
/>
```

## 🎨 Styles
To use the default styles, import the CSS file into your main file (e.g., `main.tsx`)

```tsx
import 'react-html-forms/dist/index.css';
```

The minimalist default design can be customized using the following CSS variables:
```css
--rhf-primary: #0066ff;
--rhf-error: #d32f2f;
--rhf-border: #ccc;
--rhf-radius: 4px;
```


## 📖 Complete example
```tsx
import { createFormComponents } from 'react-html-forms';

const { Form, Input, Select, Textarea, ErrorSummary, SubmitButton } = createFormComponents<MyData>();

export default function RegistrationForm() {
    return (
        <Form action={myServerAction}>
            <ErrorSummary />

            <Input name="email" type="email" label="Email address" />

            <Select name="role" label="Your role">
                <option value="dev">Developer</option>
                <option value="admin">Admin</option>
            </Select>

            <Textarea name="bio" label="Biography" />

            <div className="actions">
                <SubmitButton>Register</SubmitButton>
                <button type="reset">Cancel</button>
            </div>
        </Form>
    );
}
```


## 🔗 API Übersicht
| Component / Hook | Description |
| ----------------- | ----------- |
| `Form` | Form container with context provider and action handling. |
| `Input` / `Select` / `Textarea` | Standard input fields with automatic error notification and deactivation during submission, as well as the ability to integrate third-party libraries. |
| `ErrorSummary` | Accessible list of all current errors. |
| `SubmitButton` | Submit button that automatically deactivates during submission. |
| `useForm` | Hook for accessing the entire form state. |
| `useFieldUtils` | Hook for a single form field. Encapsulates access to the global form context (`useForm`) so that a field component only needs to know its own name in order to: <ul><li>**Handle errors** (`error`, `setError`)</li><li>**Control validation** (`addValidator`, `removeValidator`)</li><li>**Retrieve the default value** (`initialValue`)</li></ul> |
| `createFormComponents` | A library for creating type-safe form components. |


## 🗺️ Roadmap
- Support for Arrays and nested Objects
- Dirty-State & "Unsaved Changes" Warning
- Debounced "Live" Validation
