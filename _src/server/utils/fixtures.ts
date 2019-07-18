import { UserModel } from '../models';

/**
 * Resets all collections, used for testing
 */
export const removeAllCollections = async (env = process.env.NODE_ENV):Promise<void> => {
  const ALLOWED_ENVS = ['development', 'test'];
  if (!ALLOWED_ENVS.includes(env)) {
    throw new Error(`Can only reset collections on ${ALLOWED_ENVS.join(', ')}`);
  }

  else {
    const models = [ UserModel ];
    await Promise.all(models.map(m => m.deleteMany({})));
  }
}