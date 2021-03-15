import { IncomingMessage } from 'http';
import Cookies from 'js-cookie';
import Cookie from 'cookie';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextApiRequest,
} from 'next';
import { createContext, useContext } from 'react';
import http from '../../http';
import { Features, Nullable, User } from '../../types';

const FAILED_AUTH_CHECK = {
  authenticated: false,
  user: null,
  redirect: {
    destination: '/login',
    permanent: false,
  },
};

export const UserContext = createContext<
  Nullable<{ user: User; setUser: (user: User) => void }>
>(null);

export function useUser() {
  const ctx = useContext(UserContext);
  return ctx?.user ?? null;
}

export function useRefreshUser() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    return null;
  }

  return async function refreshUser() {
    const { data } = await http('api/user');
    if (!data) {
      return; // todo
    }
    Cookies.set('user', encodeURIComponent(JSON.stringify(data.user)), {
      path: '/',
      expires: 7,
    });
    ctx.setUser(data.user);
  };
}

export const FeatureContext = createContext<Nullable<Features>>(null);

export function useFeatures(): Features {
  return (
    useContext(FeatureContext) ?? {
      hasProfilePhotoFeatures: false,
      hasApiFeatures: false,
      hasAccountDeletionFeatures: false,
      canUpdateProfileInformation: false,
      updatePasswords: false,
      canManageTwoFactorAuthentication: false,
    }
  );
}

export function parseUserCookie(req?: NextApiRequest | IncomingMessage) {
  const cookie = req ? req.headers.cookie : document.cookie;
  const { user } = Cookie.parse(cookie || '');
  try {
    return JSON.parse(decodeURIComponent(user));
  } catch {
    return null;
  }
}

export function parseFeatureCookie(req?: NextApiRequest | IncomingMessage) {
  const cookie = req ? req.headers.cookie : document.cookie;
  const { features } = Cookie.parse(cookie || '');
  try {
    return JSON.parse(decodeURIComponent(features));
  } catch {
    return null;
  }
}

export function authStatus(req?: NextApiRequest | IncomingMessage) {
  if (req && !(req as NextApiRequest).userPresent) {
    return FAILED_AUTH_CHECK;
  }
  const user = parseUserCookie(req);
  if (!user) {
    return FAILED_AUTH_CHECK;
  }
  return {
    authenticated: true,
    user,
    redirect: { destination: '/', permanent: false },
  };
}

export function redirectIfAuthenticated(
  getServerSideProps?: GetServerSideProps,
) {
  return function (ctx: GetServerSidePropsContext) {
    const { authenticated, redirect } = authStatus(ctx.req);
    if (authenticated) {
      return { redirect };
    }
    return getServerSideProps ? getServerSideProps(ctx) : { props: {} };
  };
}

export function redirectIfGuest(getServerSideProps?: GetServerSideProps) {
  return function (ctx: GetServerSidePropsContext) {
    const { authenticated, redirect } = authStatus(ctx.req);
    if (!authenticated) {
      return { redirect };
    }
    return getServerSideProps ? getServerSideProps(ctx) : { props: {} };
  };
}
