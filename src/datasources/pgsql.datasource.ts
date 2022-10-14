import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {SequelizeDS} from './sequelize/sequelize.datasource.base';
import {DatasourceConfig} from './sequelize/types';

const config: DatasourceConfig = {
  name: 'pgsql',
  connector: 'postgresql',
  host: 'localhost',
  port: 5999,
  username: 'postgres',
  password: 'rest-rest',
  database: 'postgres',
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PgsqlDataSource extends SequelizeDS implements LifeCycleObserver {
  static dataSourceName = 'pgsql';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.pgsql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
