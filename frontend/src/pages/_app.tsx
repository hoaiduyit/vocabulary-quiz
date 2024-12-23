import { ReactNode } from 'react';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import '../styles/globals.css';
import { SignInDialogProvider } from '@/contexts/signin.context';

function DefaultLayout({ children }: { children: ReactNode }) {
  return children || null;
}

type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  layout?: React.ComponentType;
};

type NextWebAppProps = AppProps & { Component: NextPageWithLayout };

function NextWebApp({ Component, pageProps }: NextWebAppProps) {
  const Layout = Component.layout ?? DefaultLayout;

  return (
    <SignInDialogProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SignInDialogProvider>
  );
}

export default NextWebApp;
