import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { MongoConfig } from '../../../../config/mongo.config';

@Injectable()
export class MongoService {
  private readonly logger = new Logger(MongoService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    const mongoConfig = this.configService.get<MongoConfig>('mongo');

    if (!mongoConfig?.dbName)
      throw new BadRequestException(
        'MONGODB_DB_NAME must be defined in configuration',
      );

    this.logger.log(`Connected to MongoDB database: ${mongoConfig.dbName}`);
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
