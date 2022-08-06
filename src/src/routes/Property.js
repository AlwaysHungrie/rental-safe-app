import {
  Box,
  Flex,
  Heading,
  VStack,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAccount, useContract, useSigner } from 'wagmi';
import proprtyAbi from '../contracts/Property.json';
import SetRentForm from '../SetRentForm';
import { useQuery, gql } from '@apollo/client';
import InterestedRentersForm from '../InterestedRentersForm';
import { Link as ReactRouterLink } from 'react-router-dom';
import SetInterestedForm from '../SetInterestedForm';

function Property() {
  const { propertyId } = useParams();

  useEffect(() => console.log(propertyId), [propertyId]);

  const [inputVal, setInputVal] = useState('');

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: propertyId,
    contractInterface: proprtyAbi,
    signerOrProvider: signer,
  });

  const renderSetRentForm = () => {
    return <SetRentForm contract={contract} />;
  };

  const GET_PROPERTY = gql`
    query GetProperty($propertyId: String) {
      properties(subgraphError: allow, where: { id: $propertyId }) {
        id
        owner
        x
        y
        rent
        security
        currentTenant {
          id
        }
        approvedTenant {
          id
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_PROPERTY, {
    variables: { propertyId: propertyId.toLowerCase() },
  });

  const GET_INTERESTED = gql`
    query GetInterested($propertyId: String) {
      interestedTenants(
        first: 999
        where: { property: $propertyId, time_gte: 1 }
      ) {
        id
        user {
          id
        }
        time
      }
    }
  `;

  const { data: iData, loading: iLoading, error: iError } = useQuery(GET_INTERESTED, {
    variables: { propertyId: propertyId.toLowerCase() },
  });

  useEffect(() => {
    console.log('data', data);
  }, [data, loading, error]);

  if (loading) return <Heading>Loading</Heading>;
  if (error) return <Heading>Error</Heading>;


  const handleAccept = async() => {
    const txn = await contract.acceptAgreement({
      value: parseInt(data?.properties[0]?.rent)*parseInt(data?.properties[0]?.security)
    })
    const d = await txn.wait()

    console.log(d)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  const payRent = async() => {
    const txn = await contract.payRent({
      value: parseInt(data.properties[0]?.rent)
    })
    const d = await txn.wait()

    console.log(d)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  const claimRent = async() => {
    const txn = await contract.claimRentFromSecurity({
      value: parseInt(data?.properties[0]?.rent)
    })
    const d = await txn.wait()

    console.log(d)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };


  return (
    // <>
    //   <input onChange={(e) => setInputVal(e.target.value)} />
    //   <button onClick={() => setPropertyContractIfValid()}> Set Property Contract </button>

    //   <h3>{contract.address}</h3>
    //   {contract.address !== '0x0000000000000000000000000000000000000000' && renderSetRentForm()}
    // </>

    <Flex direction="column" alignItems="center">
      <Heading mt={4}>Property</Heading>
      <Box my={2} />
      <VStack>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Coordinates</Text>
          <Text>
            ({data?.properties[0]?.x},{data?.properties[0]?.y})
          </Text>
        </Flex>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Owner</Text>
          <Text>{data?.properties[0]?.owner}</Text>
        </Flex>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Rent</Text>
          <Text>{data?.properties[0]?.rent}</Text>
        </Flex>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Security Deposit</Text>
          <Text>{data?.properties[0]?.security}</Text>
        </Flex>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Approved Tenant</Text>
          <Text>{data?.properties[0]?.approvedTenant?.id}</Text>
        </Flex>
        <Flex minW={'md'} justifyContent={'space-between'}>
          <Text>Current Tenant</Text>
          <Text>{data?.properties[0]?.currentTenat?.id}</Text>
        </Flex>
      </VStack>

      <Heading mt={12}>Update Rent (Owner Only)</Heading>
      <Box my={2} />
      <Flex maxW={'md'}>{renderSetRentForm()}</Flex>

      <Heading mt={12}>Interested Renters</Heading>
      <Box my={2} />
      <Flex maxW={'md'}>{<InterestedRentersForm contract={contract} />}</Flex>
      <Box my={2} />
      <VStack>
        {iData?.interestedTenants?.map((p) => (
          <Button
            as={ReactRouterLink}
            to={`/profile/${p.user.id}`}
            m={4}
            p={2}
            maxW={'md'}
            h={'auto'}
            justifyContent={'space-between'}
            flexDirection={'column'}
          >
            <Text>{p.user.id} - {p.time}</Text>
          </Button>
        ))}
      </VStack>

      <Heading mt={12}>Accept Interested Renter (Owner Only)</Heading>
      <Box my={2} />
      <Flex maxW={'md'}>{<SetInterestedForm contract={contract} />}</Flex>

      <Heading mt={12}>Accept Agreement</Heading>
      <Box my={2} />
      <Button onClick={() => handleAccept()}>Accept</Button>

      <Heading mt={12}>Pay Rent</Heading>
      <Box my={2} />
      <Button onClick={() => payRent()}>Pay</Button>

      <Heading mt={12}>Claim Rent</Heading>
      <Box my={2} />
      <Button onClick={() => claimRent()}>Claim</Button>
    </Flex>
  );
}

export default Property;
