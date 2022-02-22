import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import AndresPunksArtifact from '../../config/web3/artifacts/AndresPunks';
const { address, abi } = AndresPunksArtifact;
const useAndresPunks = () => {
  const { active, library, chainId } = useWeb3React();
  const andresPunks = useMemo(() => {
    if (active) {
      return new library.eth.Contract(abi, address[chainId]);
    }
  }, [active, library?.eth?.Contract, chainId]);
  return andresPunks;
};
export default useAndresPunks;
