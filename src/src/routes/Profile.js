import { useQuery, gql } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Heading,
  VStack,
  Flex,
  Text,
  Input,
  Button,
} from '@chakra-ui/react';
import { useAccount, useContract, useSigner } from 'wagmi';
import userAbi from '../contracts/Users.json';

function Profile() {
  const { profileId } = useParams();

  const { data: signer } = useSigner();
  const contract = useContract({
    addressOrName: '0xBa80e4658c250c0E385c1D1C4E164cd6A5Dc9292',
    contractInterface: userAbi,
    signerOrProvider: signer,
  });

  const [userBioData, setUserBioData] = useState('');
  const [txnLoading, setTxnLoading] = useState(false)

  useEffect(() => {
    console.log(profileId);
    if (!contract) return;
    readUserData(contract);
  }, [profileId, contract]);

  const readUserData = async (contract) => {
    const data = await contract.userBio(profileId);
    console.log(data);
    setUserBioData(data);
  };

  const writeUserData = async (contract) => {
    setTxnLoading(true)
    const txn = await contract.updateBio(userBioData);
    const data = await txn.wait();

    console.log(data);
    setTxnLoading(false)
    alert('refresh after some time to see changes, subgraph changes will take a while to reflect')
  };

  const GET_USER = gql`
    query GetUser($userId: String) {
      users(subgraphError: allow, where: { id: $userId }) {
        id
        bio {
          key
          value
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { userId: profileId.toLowerCase() },
  });

  useEffect(() => {
    console.log('data', data);
  }, [data, loading, error]);

  if (loading) return <Heading>Loading</Heading>;
  if (error) return <Heading>Error</Heading>;

  return (
    <Flex direction='column' alignItems='center'>
      <Heading mt={4}>Profile</Heading>
      <Box my={2} />
      <VStack>
        {data.users[0].bio.map((bio) => (
          <Flex minW={'md'} justifyContent={'space-between'}>
            <Text>{bio.key}</Text>
            <Text>{bio.value}</Text>
          </Flex>
        ))}
      </VStack>

      <Heading mt={12}>Update Profile</Heading>
      <Box my={2} />
      <Flex maxW={'md'}>
        <Input
          value={userBioData}
          onChange={(e) => setUserBioData(e.target.value)}
        />
        <Button disabled={txnLoading} onClick={() => writeUserData(contract)}>Set</Button>
      </Flex>
    </Flex>
  );
}

export default Profile;
