import { useState } from 'react';
import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast
} from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import RequestAccess from '../../components/request-access';
import PunkCard from '../../components/punk-card';
import { useAndresPunkData } from '../../hooks/useAndresPunksData';
import { useParams } from 'react-router-dom';
import Loading from '../../components/loading';
import useAndresPunks from '../../hooks/useAndresPunks';

const Punk = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { loading, punk, update } = useAndresPunkData(tokenId);
  const toast = useToast();
  const andresPunks = useAndresPunks();
  const [transfering, setTransfering] = useState(false);
  const transfer = () => {
    setTransfering(true);
    const address = prompt('Enter the address to transfer to');
    const isAddress = library.utils.isAddress(address);
    if (!isAddress) {
      toast({
        title: 'Invalid address',
        description: 'Please enter a valid address',
        status: 'error'
      });
      setTransfering(false);
    } else {
      andresPunks.methods
        .safeTransferFrom(punk.owner, address, punk.tokenId)
        .send({ from: account })
        .on('error', () => {
          setTransfering(false);
        })
        .on('transactionHash', (txHash) => {
          toast({
            title: 'Transaction in progress',
            description: `Transfering: ${txHash}`,
            status: 'info'
          });
        })
        .on('receipt', () => {
          setTransfering(false);
          toast({
            title: 'Transaction Complete',
            description: 'The owner now is' + address,
            status: 'success'
          });
          update();
        });
    }
    console.log('transfer');
  };

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: 'column', md: 'row' }}
    >
      <Stack>
        <PunkCard
          mx={{
            base: 'auto',
            md: 0
          }}
          name={punk.name}
          image={punk.image}
        />
        <Button
          onClick={transfer}
          disabled={account !== punk.owner}
          colorScheme='green'
          isLoading={transfering}
        >
          {account !== punk.owner ? 'No eres el dueño' : 'Transferir'}
        </Button>
      </Stack>
      <Stack width='100%' spacing={5}>
        <Heading>{punk.name}</Heading>
        <Text fontSize='xl'>{punk.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme='green'>
            {punk.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme='green'>
            {punk.owner}
          </Tag>
        </Text>
        <Table size='sm' variant='simple'>
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(punk.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Punk;
