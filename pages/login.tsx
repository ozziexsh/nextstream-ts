import { useState } from 'react';
import JetAuthenticationCard from '../jet/components/authentication-card';
import JetButton from '../jet/components/button';
import JetCheckbox from '../jet/components/checkbox';
import JetGuestLayout from '../jet/layouts/guest-layout';
import JetInput from '../jet/components/input';
import JetLabel from '../jet/components/label';
import http from '../http';
import JetInputError from '../jet/components/input-error';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import JetTwoFactorChallenge from '../jet/domains/auth/two-factor-challenge';
import { handleFormErrors } from '../jet/helpers/form';
import { redirectIfAuthenticated } from '../jet/helpers/auth';

interface Form {
  email: string;
  password: string;
  remember: boolean;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
  } = useForm<Form>();
  const [show2fa, setShow2fa] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(values: Form) {
    setLoading(true);
    const { ok, data, errors: submitErrors } = await http('login', {
      method: 'post',
      body: JSON.stringify(values),
    });
    setLoading(false);
    if (!ok) {
      return void handleFormErrors({ setError, errors: submitErrors });
    }
    clearErrors();
    if (data.two_factor === true) {
      return void setShow2fa(true);
    }
    window.location.href = '/';
  }

  return (
    <JetGuestLayout pageTitle={'Login'}>
      <JetAuthenticationCard>
        {!show2fa ? (
          <form onSubmit={handleSubmit(submit)}>
            <div>
              <JetLabel htmlFor="email">Email</JetLabel>
              <JetInput
                id="email"
                className="block mt-1 w-full"
                type="email"
                name="email"
                required
                autoFocus
                ref={register}
              />
              <JetInputError>{errors?.email?.message}</JetInputError>
            </div>

            <div className="mt-4">
              <JetLabel htmlFor="password">Password</JetLabel>
              <JetInput
                id="password"
                className="block mt-1 w-full"
                type="password"
                name="password"
                required
                autoComplete="current-password"
                ref={register}
              />
              <JetInputError>{errors?.password?.message}</JetInputError>
            </div>

            <div className="block mt-4">
              <label htmlFor="remember" className="flex items-center">
                <JetCheckbox id="remember" name="remember" ref={register} />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
            </div>

            <div className="flex items-center justify-end mt-4">
              <Link href="/forgot-password">
                <a className="underline text-sm text-gray-600 hover:text-gray-900">
                  Forgot your password?
                </a>
              </Link>
              <JetButton className="ml-4" disabled={loading}>
                Login
              </JetButton>
            </div>
          </form>
        ) : (
          <JetTwoFactorChallenge />
        )}
      </JetAuthenticationCard>
    </JetGuestLayout>
  );
}

export const getServerSideProps = redirectIfAuthenticated();
