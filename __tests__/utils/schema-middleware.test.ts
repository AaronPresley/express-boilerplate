import { APSchema, ExpressRequest, ExpressResponse, NextFunction } from '../../src/types';
import schemaMiddleware from '../../src/utils/schema-middleware';

describe('SchemaMiddleware', () => {
  let schema: APSchema;
  let req: ExpressRequest;
  let res: ExpressResponse;
  let next: NextFunction;

  let sendMock;

  beforeEach(() => {
    sendMock = jest.fn();

    schema = {
      allowedParams: ['param1'],
      schema: {
        id: '/TestSchema1',
        type: 'object',
        properties: {
          field1: {
            type: 'string',
          },
          field2: {
            type: 'number',
          },
        },
        required: ['field1'],
      },
    };

    (req = {
      body: {
        field1: 'some-string',
      },
      query: {},
    } as any) as ExpressRequest;

    (res = {
      status: jest.fn().mockReturnValue({
        send: sendMock,
      }),
      send: sendMock,
    } as any) as ExpressResponse;

    next = jest.fn();
  });

  it('should call the next with a valid schema', () => {
    schemaMiddleware(schema)(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.send).toHaveBeenCalledTimes(0);
  });

  describe('param validation', () => {
    it('should pass with valid params', () => {
      req.query = {
        param1: 'some-val',
      };

      schemaMiddleware(schema)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should send an error with invalid params', () => {
      req.query = {
        badParam: 'some-val',
      };

      schemaMiddleware(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith({
        errors: {
          fields: null,
          params: ['"badParam" is not an allowed parameter'],
        },
      });
    });
  });

  describe('body validation', () => {
    it('should pass with valid fields', () => {
      req.body = {
        field1: 'some-value',
      };

      schemaMiddleware(schema)(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('should send an error with invalid fields', () => {
      req.body = {
        wrongField: 'wrong-value',
      };

      schemaMiddleware(schema)(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledWith({
        errors: {
          fields: { field1: 'field1 is required' },
          params: null,
        },
      });
    });
  });
});
