import Layout from "../components/Layout";
import AuthProvider from "../context/AuthContext";
import ModalProvider from "../context/ModalContext";
import ProductDataProvider from "../context/ProductDataContext";
import ShoppingCartProvider from "../context/ShoppingCartContext";
import "../styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProps } from "next/app";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:1337/graphql",
  cache: new InMemoryCache(),
});

export const queryClient = new QueryClient();

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
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
      </QueryClientProvider>
    </ApolloProvider>
  );
};

export default MyApp;
