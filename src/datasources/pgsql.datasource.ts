import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import {Sequelize} from 'sequelize';

const config = {
  name: 'pgsql',
  connector: 'postgresql',
  host: 'localhost',
  port: 5999,
  user: 'postgres',
  password: 'rest-rest',
  database: 'postgres',
};

export class SequelizeDS extends juggler.DataSource {
  sequelize?: Sequelize;
  async init() {
    console.log('init called');
    this.sequelize = new Sequelize({
      host: config.host,
      port: config.port,
      database: config.database,
      dialect: 'postgres',
      username: config.user,
      password: config.password,
      logging: console.log,
    });
    try {
      await this.sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  stop() {
    this.sequelize?.close?.().catch(console.log);
  }
}

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
