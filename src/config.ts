export interface Config {
  dbAddress: string;
  dbName: string;
  secret: string;
};

export default ({
  dbAddress: 'mongodb://localhost:27017',
  dbName: 'appname-blog',
  secret: 'c24bf02b-8bec-4b25-9726-5f281f674253',
}) as Config;