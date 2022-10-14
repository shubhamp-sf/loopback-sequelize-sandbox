import {inject} from '@loopback/core';
import {PgsqlDataSource} from '../datasources';
import {User, UserRelations} from '../models';
import {SequelizeRepository} from './sequelize.repository.base';

export class UserRepository extends SequelizeRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.pgsql') dataSource: PgsqlDataSource) {
    super(User, dataSource);
  }
}
