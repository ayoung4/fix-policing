import { AppProps } from 'next/app'

const Wrapper = ({ Component, pageProps }: AppProps) => {
  return <Component {...pageProps} />
}

export default Wrapper;
