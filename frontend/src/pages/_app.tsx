import { ReactNode, useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import '../styles/globals.css';
import { SignInDialogProvider } from '@/contexts/signin.context';
import { UserProfileProvider } from '@/contexts/userProfile.context';
import { UserType } from '@/types/user.type';
import { getUserProfile } from '@/services/auth.service';

function DefaultLayout({ children }: { children: ReactNode }) {
  return children || null;
}

type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  layout?: React.ComponentType;
};

type NextWebAppProps = AppProps & { Component: NextPageWithLayout };

function NextWebApp({ Component, pageProps }: NextWebAppProps) {
  const [profile, setProfile] = useState<UserType | null>(null);

  useEffect(() => {
    (async () => {
      const data = await getUserProfile();
      setProfile(data);
    })();
  }, []);

  const Layout = Component.layout ?? DefaultLayout;

  return (
    <UserProfileProvider value={{ profile }}>
      <SignInDialogProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SignInDialogProvider>
    </UserProfileProvider>
  );
}

export default NextWebApp;
