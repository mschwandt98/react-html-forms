import { StrictMode } from 'react';

import { createRoot } from 'react-dom/client';

import { createFormComponents } from '../src/createFormComponents';

type CustomFormData = {
    country: string;
    fruit: string;
    foo: string;
    bar: string;
    hobbies: string[];
    atc: boolean;
    remark?: boolean;
    password: string;
    passwordConfirm: string;
};

const { ErrorSummary, Fieldset, Form, Input, Select, SubmitButton, Textarea } = createFormComponents<CustomFormData>();

function App() {
    async function onSubmit(formData: CustomFormData) {
        console.log('Starting Validation/Upload...', formData);

        // Dummy Delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log('Done!');

        return {
            _form: 'Something unexpected happened...'
        };
    }

    async function onOtherSubmit(formData: FormData) {
        console.log('start other submit...', formData.entries());

        // Dummy Delay
        await new Promise((resolve) => setTimeout(resolve, 3000));

        console.log('Done!');
    }

    return (
        <Form
            action={onSubmit}
            initialValues={{
                foo: 'bar',
                bar: 'foo',
                hobbies: ['sport']
            }}
            validate={(values) => {
                if (values.password !== values.passwordConfirm) {
                    return { passwordConfirm: 'Passwords not matching' };
                }
            }}
        >
            <ErrorSummary />
            <Select name="country" required>
                <option value="">Choose...</option>
                <option value="de">Germany</option>
                <option value="at">Austria</option>
            </Select>
            <br />
            <br />
            <Textarea name="remark" minLength={100} />
            <Fieldset label="Hobbies" name="hobbies">
                <Input
                    label="Coding"
                    name="hobbies"
                    type="checkbox"
                    value="coding"
                    validate={(val) => {
                        return val.length === 0 ? 'Choose at lease one hobby.' : undefined;
                    }}
                />
                <Input label="Music" name="hobbies" type="checkbox" value="music" />
                <Input label="Sport" name="hobbies" type="checkbox" value="sport" />
            </Fieldset>
            <br />
            <br />
            <Input label="Accept Terms and Conditions" name="atc" type="checkbox" value="accepted" required />
            <br />
            <br />
            <Input label="Name" name="foo" required />
            <br />
            <br />
            <Input
                label="Passwort"
                name="password"
                type="password"
                required
                data-required-message="Why are you ignoring the password field? "
                validate={(value) => (value.trim() ? undefined : 'Nice try, but you really have to type something!')}
            />
            <br />
            <br />
            <Input name="passwordConfirm" type="password" />
            {/* <SubmitButton>
				{({ disabled, type }) => (
					<MuiButton variant="contained" disabled={disabled} type={type}>
						Form Submit
					</MuiButton>
				)}
			</SubmitButton> */}
            {/* TODO: Validierung hier auch laufen lassen? */}
            <SubmitButton>Submit</SubmitButton>
            <SubmitButton formAction={onOtherSubmit}>Custom Submit-Action</SubmitButton>
            <button type="reset">Reset form</button>
        </Form>
    );
}

const root = document.getElementById('root') ?? document.body;
createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
