import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ApolloProvider } from "@apollo/client";
import { client } from "./utils/apollo.ts";
import { QueryClient, QueryClientProvider } from "react-query";
import { DataProvider } from "./context/DataContext.tsx";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={client}>
        <AuthProvider>
        <DataProvider>
          <App />
        </DataProvider>
        </AuthProvider>
      </ApolloProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
