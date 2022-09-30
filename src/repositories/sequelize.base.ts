import {
  AnyObject,
  DefaultCrudRepository,
  Entity,
  FilterExcludingWhere,
} from '@loopback/repository';
import {ModelDefinition as JugglerModelDefinition} from 'loopback-datasource-juggler';
import {BuildOptions, Identifier, Model} from 'sequelize';
import {SequelizeDS} from '../datasources';

type ModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): Model;
};

class SequelizeBase<
  T extends Entity,
  ID,
  Relations extends object = {},
> extends DefaultCrudRepository<T, ID, Relations> {
  sequelizeModel: ModelStatic;
  dataSource: SequelizeDS;
  constructor(
    entityClass: typeof Entity & {
      prototype: T;
    },
    dataSource: SequelizeDS,
  ) {
    super(entityClass, dataSource);
    console.log(
      'Juggler entity definition',
      this.dataSource.definitions[entityClass.name].toJSON(),
    );

    this.sequelizeModel = this.getSequelizeModel();
  }

  async findById(
    id: ID,
    filter?: FilterExcludingWhere<T> | undefined,
    options?: AnyObject | undefined,
  ): Promise<T & Relations> {
    const data = await this.sequelizeModel.findByPk(
      id as unknown as Identifier,
    );
    if (!data) {
      throw Error('Entity not found');
    }
    return data.toJSON();
  }

  /* findOne(filter?: JugglerFilter<T> | undefined, options?: AnyObject | undefined): Promise<(T & Relations) | null> {
    return this.sequelizeModel.findOne({
    }) as unknown as Promise<T & Relations>;
  }
  private getSequelizeFindOptions(filter?: JugglerFilter){
  } */

  private getSequelizeModel() {
    if (!this.dataSource.sequelize) {
      throw Error(
        `The datasource "${this.dataSource.name}" doesn't have sequelize instance bound to it.`,
      );
    }
    console.log('Modelname', this.entityClass.modelName);

    if (this.dataSource.sequelize.models[this.entityClass.modelName]) {
      console.log('target sequelize returned.');
      return this.dataSource.sequelize.models[this.entityClass.modelName];
    }

    const definition = this.dataSource.definitions[this.entityClass.modelName];

    this.dataSource.sequelize.define(
      this.entityClass.modelName,
      this.getSequelizeModelAttributes(definition),
      {
        createdAt: false,
        updatedAt: false,
        tableName: this.entityClass.modelName.toLowerCase(),
      },
    );
    return this.dataSource.sequelize.models[this.entityClass.modelName];
  }
  private getSequelizeModelAttributes(definition: JugglerModelDefinition) {
    const defObject = definition.toJSON();
    /**
     * Sample defObject
     {
          name: 'User',
          properties: {
            name: { type: 'String' },
            email: { type: 'String', required: true },
            id: {
              type: 'Number',
              id: true,
              generated: true,
              useDefaultIdType: false,
              updateOnly: true
            },
            age: { type: 'Number' }
          },
          settings: { strict: true, strictDelete: false, forceId: 'auto' }
        }
     */
    for (const propName in defObject.properties) {
      if (defObject.properties[propName].id === true) {
        defObject.properties[propName].primaryKey = true;
        delete defObject.properties[propName].id;
      }
    }
    return defObject.properties;
  }
}

export default SequelizeBase;
