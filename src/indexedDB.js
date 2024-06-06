import { initDB } from 'react-indexed-db-hook';

const DBConfig = {
  name: 'COMMON_CODE',
  version: 1,
  objectStoresMeta: [
    {
      store: 'users',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
        { name: 'email', keypath: 'email', options: { unique: true } }
      ]
    }
  ]
};

export const initDatabase = () => initDB(DBConfig);