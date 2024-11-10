import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';

import { t } from '@c/core/lib/trpc';

import { loginRegisterValidator } from '@apiv1/user/validators';

export default function Login() {
  const loginMutation = t.user.login.useMutation();

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value, formApi }) => {
      await loginMutation.mutateAsync(value);
      formApi.reset();
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: loginRegisterValidator,
    },
  });

  return (
    <div>
      <h1>Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div>
          <form.Field name="email">
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
                  type="email"
                />
                {field.state.meta.errors.length > 0 ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>
        <div>
          <form.Field name="password">
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
                  type="password"
                />
                {field.state.meta.errors.length > 0 ? (
                  <em role="alert">{field.state.meta.errors.join(', ')}</em>
                ) : null}
              </div>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
