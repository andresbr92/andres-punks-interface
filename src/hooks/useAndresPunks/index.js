import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
const useAndresPunks = () => {
  const { active, library, chainId } = useWeb3React();
  const andresPunks = useMemo(() => new library.eth.Contract('<<ADDRESS>>', 'abi'), [active, library?.eth?.Contract, chainId]);
};
export default useAndresPunks;
