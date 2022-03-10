import { useWeb3React } from '@web3-react/core';
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
const useAndresPunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const andresPunks = useAndresPunks();

  const update = useCallback(async () => {
    if (andresPunks) {
      setLoading(true);
      let tokenIds;
      if (!library.utils.isAddress(owner)) {
        const totalSupply = await andresPunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await andresPunks.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            andresPunks.methods.tokenOfOwnerByIndex(owner, index).call()
          );

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, andresPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [andresPunks, owner, library?.utils]);

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
const useAndresPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const andresPunks = useAndresPunks();

  const update = useCallback(async () => {
    if (andresPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, andresPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [andresPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update
  };
};

export { useAndresPunksData, useAndresPunkData };
