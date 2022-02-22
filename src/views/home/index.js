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
const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const { active, account } = useWeb3React();
  const andresPunks = useAndresPunks();
  const toast = useToast();

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
              position='relative'
              _after={{
                content: "''",
                width: 'full',
                height: '30%',
                position: 'absolute',
                bottom: 1,
                left: 0,
                bg: 'green.400',
                zIndex: -1
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
            Andres Punks es una colección de Avatares randomizados cuya metadata
            es almacenada on-chain. Poseen características únicas y sólo hay
            10000 en existencia.
          </Text>
          <Text color='green.500'>
            Cada Andres Punk se genera de forma secuencial basado en tu address,
            usa el previsualizador para averiguar cuál sería tu Andres Punk si
            minteas en este momento
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
              Obtén tu punk
            </Button>
            <Link to='/punks'>
              <Button rounded='full' size='lg' fontWeight='normal' px={6}>
                Galería
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
          w='full'
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
                      0x0000...0000
                    </Badge>
                  </Badge>
                </Flex>
                <Button
                  onClick={getAndresPunksData}
                  mt={4}
                  size='xs'
                  colorScheme='green'
                >
                  Actualizar
                </Button>
              </>
              )
            : (
              <Badge mt={2}>Wallet desconectado</Badge>
              )}
        </Flex>
      </Stack>
    </>
  );
};

export default Home;
