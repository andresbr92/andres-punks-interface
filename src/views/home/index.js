import { useWeb3React } from '@web3-react/core';
import { useCallback, useEffect, useState } from 'react';
import useAndresPunks from '../../hooks/useAndresPunks';
const Home = () => {
  const { active } = useWeb3React();

  const [maxSupply, setMaxSupply] = useState();

  const andresPunks = useAndresPunks();

  const getMaxSupply = useCallback(async () => {
    if (andresPunks) {
      const result = await andresPunks.methods.maxSupply().call();
      setMaxSupply(result);
    }
  }, [andresPunks]);

  useEffect(() => {
    getMaxSupply();
  }, [getMaxSupply]);
  if (!active) return 'Conecta tu wallet...';
  return (
    <>
      <p>maxSupply is {maxSupply} </p>
    </>
  );
};

export default Home;
