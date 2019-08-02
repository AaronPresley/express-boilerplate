import { APSchema } from '../../types';

const AuthSchemaV1: APSchema = {
  schema: {
    id: '/AuthSchemaV1',
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    required: ['email', 'password'],
  },
};

export default AuthSchemaV1;
