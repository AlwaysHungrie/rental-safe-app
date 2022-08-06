import logo from './logo.svg';
import './App.css';

import { WagmiConfig, createClient, configureChains, chain } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import Layout from './src/routes/Layout';

const { chains, provider, webSocketProvider } = configureChains(
  [chain.rinkeby],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

function App() {
  return (
    <WagmiConfig client={client}>
      <Layout />
    </WagmiConfig>
  );
}

export default App;
