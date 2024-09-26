import classeRepository from '../repository/classeRepository.js';

export const createClasse = async (classeData) => {
  return await classeRepository.creer(classeData);
};

export default {
  createClasse,
};
