export type DatasourceConfig = {
  /**
   * Name for datasource.
   */
  name: string;
  /**
   * Database connector to use.  For any supported connector, can be any of:
   *
   * - The connector module from `require(connectorName)`.
   * - The full name of the connector module, such as 'loopback-connector-oracle'.
   * - The short name of the connector module, such as 'oracle'.
   * - A local module under `./connectors/` folder.
   */
  connector: string;
  /**
   * Database server host name.
   */
  host: string;
  /**
   * Database server port number.
   */
  port: string | number;
  /**
   * Database user name.
   */
  username: string;
  /**
   * Database password.
   */
  password: string;
  /**
   * Name of the database to use.
   */
  database: string;
  /**
   * Display debugging information.
   *
   * Default is `false`.
   */
  debug?: boolean;
};
