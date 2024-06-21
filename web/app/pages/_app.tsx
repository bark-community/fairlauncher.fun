import React from 'react';
import { AppProps } from 'next/app';
import UiLayout from '@/components/ui/ui-layout';
import '@/styles/globals.css';

const links = [
  { label: 'Twitter', path: 'https://twitter.com/bark_protocol' },
  { label: 'Discord', path: 'https://discord.gg/H9en8eHzn2' },
  { label: 'Telegram', path: 'https://t.me/bark_protocol' },
  { label: 'Instagram', path: 'https://instagram.com/bark.protocol' },
  { label: 'GitHub', path: 'https://github.com/bark-community/barkbot-telegram' },
  { label: 'Medium', path: 'https://medium.com/@barkprotocol' },
];

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UiLayout links={links}>
      <Component {...pageProps} />
    </UiLayout>
  );
}

export default MyApp;
