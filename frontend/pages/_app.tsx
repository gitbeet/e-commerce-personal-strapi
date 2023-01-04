import Layout from "../components/Layout";
import ModalProvider from "../context/ModalContext";
import ProductDataProvider from "../context/ProductDataContext";
import ShoppingCartProvider from "../context/ShoppingCartContext";
import "../styles/globals.css";
import { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { AuthProvider, useFetchUser } from "context/AuthContext";

export const client = new ApolloClient({
  uri: "http://localhost:1337/graphql",
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const { user, loading } = useFetchUser();
  return (
    <ApolloProvider client={client}>
      <AuthProvider value={{ user, loading }}>
        <ProductDataProvider>
          <ShoppingCartProvider>
            <ModalProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ModalProvider>
          </ShoppingCartProvider>
        </ProductDataProvider>
      </AuthProvider>
    </ApolloProvider>
  );
};

export default MyApp;
