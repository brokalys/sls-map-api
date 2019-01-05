import mysql from './db';
import cache from './cache';

jest.mock('./db');

describe('cache', () => {
  describe('get', () => {
    test('retrieves existing record from cache', async () => {
      mysql.query.mockReturnValue([{ value: JSON.stringify('test') }]);

      const output = await cache.get('key');

      expect(output).toBe('test');
    });

    test('retrieves nothing from cache', async () => {
      mysql.query.mockReturnValue();

      const output = await cache.get('key');

      expect(output).toBeUndefined();
    });
  });

  describe('set', () => {
    test('writes to cache', () => {
      cache.set('key', { hello: 'world' });

      expect(mysql.query).toHaveBeenCalled();
    });
  });
});
