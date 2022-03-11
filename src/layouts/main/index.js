import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Image,
  Heading
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import NavLink from './nav-link';
import Footer from './footer';
import WalletData from './wallet-data';

const Links = [
  {
    name: 'Home',
    to: '/'
  },
  {
    name: 'Punks',
    to: '/punks'
  }
];

const MainLayout = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex minH='100vh' direction='column'>
      <Box
        mx='auto'
        maxW='7xl'
        width='100%'
        px={4}
      >
        <Flex
          minH='80px'
          py={{ base: 2 }}
          px={{ base: 4 }}
          alignItems='center'
          justifyContent='space-between'
        >
          <IconButton
            size='md'
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label='Open Menu'
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems='center'>
            <Flex alignItems='center'>
              <Heading size='xl' color='purple' mt={0.2} ml={1}>
                Andres_
              </Heading>
              <Heading size='xl' color='purple' mt={0.2} ml={1}>
                Punks
              </Heading>
            </Flex>
            <HStack
              as='nav'
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map(({ name, to }) => (
                <NavLink color='white' fontWeight='bold' fontSize='25' key={name} to={to}>
                  {name}
                </NavLink>
              ))}
            </HStack>
          </HStack>
          <WalletData />
        </Flex>

        {isOpen
          ? (
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as='nav' spacing={4}>
                {Links.map(({ name, to }) => (
                  <NavLink key={name} to={to}>
                    {name}
                  </NavLink>
                ))}
              </Stack>
            </Box>
            )
          : null}
      </Box>
      <Box mx='auto' flex={1} p={4} maxW='7xl' width='100%'>
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default MainLayout;
