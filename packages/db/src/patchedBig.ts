import Big from 'big.js';
import pg from 'pg';

Big.prototype.toPostgres = function () {
  return this.toString();
};

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return Big(value);
});
