import React from 'react'
import { AppProps } from 'next/app'

const CrowdCoin = ({
  Component,
  pageProps: { session, ...pageProps }
}: AppProps) => {
  return <Component {...pageProps} />
}

export default CrowdCoin
