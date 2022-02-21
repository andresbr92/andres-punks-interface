import Web3 from 'web3';
import { InjectedConnector } from 'web3-react/dist/connectors';
const connector = new InjectedConnector({
  supportedNetworks: [
    4 // Rinkeby
  ]
});
const getLibrary = (provider) => {
  return Web3(provider);
};
export { connector, getLibrary };
