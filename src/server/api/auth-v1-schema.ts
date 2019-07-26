import { Schema } from 'jsonschema';

const AuthSchemaV1: Schema = {
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
};

export default AuthSchemaV1;
