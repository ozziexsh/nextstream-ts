import { GetServerSideProps } from 'next';
import cookie from 'cookie';
import http from '../http';
import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    window.location.href = '/login';
  }, []);

  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const { response } = await http('logout', { method: 'post', req });
  res.setHeader('set-cookie', [
    // @ts-ignore
    ...response.headers.raw()['set-cookie'],
    cookie.serialize('user', '', { expires: new Date() }),
    cookie.serialize('features', '', { expires: new Date() }),
  ]);
  return {
    props: {},
  };
};
