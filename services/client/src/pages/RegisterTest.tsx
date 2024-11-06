import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';

import { t } from '@c/core/utils/trpc';

import { loginRegisterValidator } from '@apiv1/user/validators';

export default function RegisterTest() {
  const registerMutation = t.user.register.useMutation();

  const { Field, handleSubmit, Subscribe } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value, formApi }) => {
      registerMutation.mutate(value);
      formApi.reset();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: loginRegisterValidator,
    },
  });

  return (
    <div>
      <h1>Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void handleSubmit();
        }}
      >
        <div>
          <Field name="email">
            {(field) => (
              <div>
                <label htmlFor={field.name}>Email:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                />
                {field.state.meta.errors.length > 0 ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </Field>
        </div>
        <div>
          <Field name="password">
            {(field) => (
              <div>
                <label htmlFor={field.name}>Password:</label>
                <input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                  }}
                />
                {field.state.meta.errors.length > 0 ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </Field>
        </div>
        <Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        </Subscribe>
      </form>
    </div>
  );
}
