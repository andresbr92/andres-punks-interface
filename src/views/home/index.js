import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAndresPunks from '../../hooks/useAndresPunks';
import useTruncatedAddress from '../../hooks/useTruncatedAddress';
const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const { active, account } = useWeb3React();
  const andresPunks = useAndresPunks();
  const toast = useToast();
  const truncatedAddress = useTruncatedAddress(account);

  const getAndresPunksData = useCallback(async () => {
    if (active) {
      const totalSupply = await andresPunks.methods.totalSupply().call();
      const dnaPreview = await andresPunks.methods
        .deterministicPseudoDNA(totalSupply, account)
        .call();
      const image = await andresPunks.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [andresPunks, account]);

  useEffect(() => {
    getAndresPunksData();
  }, [getAndresPunksData]);

  const mint = () => {
    setIsMinting(true);
    andresPunks.methods
      .mint()
      .send({
        from: account
      })
      .on('transactionHash', (txHash) => {
        toast({
          title: 'Minting',
          description: `Minting your AndresPunks... Transaction:${txHash}`,
          status: 'info'
        });
      })
      .on('receipt', () => {
        setIsMinting(false);
        toast({
          title: 'Transaction Complete',
          description: 'Your AndresPunks have been minted!',
          status: 'success'
        });
      })
      .on('error', (error) => {
        setIsMinting(false);
        toast({
          title: 'Transaction Failed',
          description: `Your AndresPunks could not be minted. Reason: ${error.message}`,
          status: 'error'
        });
      });
  };
  return (
    <>
      <Stack
        align='center'
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column-reverse', md: 'row' }}
      >
        <Stack flex={1} spacing={{ base: 5, md: 10 }}>
          <Heading
            lineHeight={1.1}
            fontWeight={600}
            fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
          >
            <Text
              as='span'
              style={{
                color: '#FFCD00'
              }}
            >
              Andres Punks
            </Text>
            <br />
            <Text as='span' color='blue.400'>
              BlockChain DApp running on Rynkeby testnet
            </Text>
          </Heading>
          <Text color='gray.500'>
            Andres Punks is a collection of random Avatars whose metadata is stored on-chain. They have unique characteristics and there are only 10,000 in existence
          </Text>
          <Text color='green.500'>

            Each Andres Punk is generated sequentially based on your address, use the preview to find out what your Andres Punk would be if you mint your NFT right now.
          </Text>
          <Stack
            spacing={{ base: 4, sm: 6 }}
            direction={{ base: 'column', sm: 'row' }}
          >
            <Button
              rounded='full'
              size='lg'
              fontWeight='normal'
              px={6}
              colorScheme='green'
              bg='green.400'
              _hover={{ bg: 'green.500' }}
              disabled={!andresPunks}
              onClick={mint}
              isLoading={isMinting}
            >
              Get Punk
            </Button>
            <Link to='/punks'>
              <Button rounded='full' size='lg' fontWeight='normal' px={6}>
                Gallery
              </Button>
            </Link>
          </Stack>
        </Stack>
        <Flex
          flex={1}
          direction='column'
          justify='center'
          align='center'
          position='relative'
          // w='full'
          className='gradient-bg-services'
          border='3px solid grey'
          borderRadius='5px'
          maxWidth='35%'
        >
          <Image src={active ? imageSrc : 'https://avataaars.io/'} />
          {active
            ? (
              <>
                <Flex mt={2}>
                  <Badge>
                    Next ID:
                    <Badge ml={1} colorScheme='green'>
                      1
                    </Badge>
                  </Badge>
                  <Badge ml={2}>
                    Address:
                    <Badge ml={1} colorScheme='green'>
                      {truncatedAddress}
                    </Badge>
                  </Badge>
                </Flex>
                <Button
                  onClick={getAndresPunksData}
                  mt={4}
                  size='xs'
                  colorScheme='green'
                >
                  Update
                </Button>
              </>
              )
            : (
              <Badge mt={2}>Wallet disconnected</Badge>
              )}
        </Flex>
      </Stack>
    </>
  );
};

export default Home;
