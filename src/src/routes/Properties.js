import { Heading, Flex, Box, VStack, Text, Button, Input } from '@chakra-ui/react';
import { useQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useAccount, useContract, useSigner } from 'wagmi';
import proprtyRegAbi from '../contracts/PropertyRegistry.json';

function Properties() {
  const GET_PROPERTIES = gql`
    query GetProperties {
      properties(subgraphError: allow) {
        id
        owner
        rent
        security
      }
    }
  `;

  const [userX, setUserX] = useState(0)
  const [userY, setUserY] = useState(0)
  const [txnLoading, setTxnLoading] = useState(false)

  const { data, loading, error } = useQuery(GET_PROPERTIES);

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: "0x23a433BdE93bbC2DEA081646Ecdb6FbcecE43a4c",
    contractInterface: proprtyRegAbi,
    signerOrProvider: signer,
  });

  const registerProperty = async(contract) => {
    setTxnLoading(true)
    const txn = await contract.deploy(userX, userY);
    const data = await txn.wait();

    console.log(data);
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  if (loading) return <Heading>Loading</Heading>;
  if (error) return <Heading>Error</Heading>;

  return (
    <Flex direction="column" alignItems="center">
      <Heading mt={4}>Register Your Property</Heading>
      <Box my={2} />
      <Flex maxW={'2xl'}>
        <Input
          type={'number'}
          value={userX}
          onChange={(e) => setUserX(parseInt(e.target.value))}
        />
        <Input
          type={'number'}
          value={userY}
          onChange={(e) => setUserY(parseInt(e.target.value))}
        />
        <Button mx={4} disabled={txnLoading} onClick={() => registerProperty(contract)}>
          Register
        </Button>
      </Flex>

      <Heading mt={12}>Properties</Heading>

      <Box my={2} />
      <VStack>
        {data.properties.map((p) => (
          <Button
            as={ReactRouterLink}
            to={`/property/${p.id}`}
            m={4}
            p={2}
            maxW={'md'}
            h={'auto'}
            justifyContent={'space-between'}
            flexDirection={'column'}
          >
            <Text>{p.id}</Text>
            <Text fontSize={'xs'}>Owner: {p.owner}</Text>
          </Button>
        ))}
      </VStack>
    </Flex>
  );
}

export default Properties;
