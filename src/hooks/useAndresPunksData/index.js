import { useCallback, useEffect, useState } from 'react';
import useAndresPunks from '../useAndresPunks';

const getPunkData = async ({ andresPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType
  ] = await Promise.all([
    andresPunks.methods.tokenURI(tokenId).call(),
    andresPunks.methods.tokenDNA(tokenId).call(),
    andresPunks.methods.ownerOf(tokenId).call(),
    andresPunks.methods.getAccessoriesType(tokenId).call(),
    andresPunks.methods.getAccessoriesType(tokenId).call(),
    andresPunks.methods.getClotheColor(tokenId).call(),
    andresPunks.methods.getClotheType(tokenId).call(),
    andresPunks.methods.getEyeType(tokenId).call(),
    andresPunks.methods.getEyeBrowType(tokenId).call(),
    andresPunks.methods.getFacialHairColor(tokenId).call(),
    andresPunks.methods.getFacialHairType(tokenId).call(),
    andresPunks.methods.getHairColor(tokenId).call(),
    andresPunks.methods.getHatColor(tokenId).call(),
    andresPunks.methods.getGraphicType(tokenId).call(),
    andresPunks.methods.getMouthType(tokenId).call(),
    andresPunks.methods.getSkinColor(tokenId).call(),
    andresPunks.methods.getTopType(tokenId).call()
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType
    },
    tokenURI,
    dna,
    owner,
    ...metadata
  };
};
// Plural
const useAndresPunksData = () => {
  const [punks, setPunks] = useState([]);
  const [loading, setLoading] = useState(true);
  const andresPunks = useAndresPunks();

  const update = useCallback(async () => {
    if (andresPunks) {
      setLoading(true);

      const totalSupply = await andresPunks.methods.totalSupply().call();
      const tokenIds = new Array(Number(totalSupply)).fill().map((_, index) => index);

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, andresPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [andresPunks]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update
  };
};

// Singular
// const usePlatziPunkData = () => {

// }

export { useAndresPunksData };
