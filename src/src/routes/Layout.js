import { Outlet } from 'react-router-dom';
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Link,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

function Layout() {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  return (
    <div className="App">
      {isConnected ? (
        <Container maxW={'full'} p={0}>
          <Flex alignItems={'center'} py={2} px={4} boxShadow="xl">
            <Button as={ReactRouterLink} to={'/'} minW={0} mr={4} p={2}>
              <Heading>H</Heading>
            </Button>

            <Text>
              Connected to{' '}
              <Link textDecoration={'underline'} as={ReactRouterLink} to={`/profile/${address}`}>
                {address}
              </Link>
            </Text>
            <Spacer />
            <Button onClick={() => disconnect()}>Logout</Button>
          </Flex>
          <Outlet />
        </Container>
      ) : (
        <Container maxW={'full'} p={0}>
          <Flex alignItems={'center'} py={2} px={4} boxShadow="xl">
            <Button minW={0} mr={4} p={2}>
              <Heading>H</Heading>
            </Button>
            <Spacer />
            <Button onClick={() => connect()}>Connect Wallet</Button>
          </Flex>
          <Outlet />
        </Container>
      )}
    </div>
  );
}

export default Layout;
