import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Profile from './src/routes/Profile';
import Property from './src/routes/Property';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Properties from './src/routes/Properties';

const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/alwayshungrie/rental-safe-subgraph',
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    }
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ApolloProvider client={client}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route index element={<Properties />} />
              <Route path="/profile/:profileId" element={<Profile />} />
              <Route path="/property/:propertyId" element={<Property />} />
            </Route>
          </Routes>
        </HashRouter>
      </ApolloProvider>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
