import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activation } from './activation.entity';
import { ActivationsController } from './activations.controller';
import { ActivationsService } from './activations.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activation]),
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'activation-api',
            brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
          },
          producerOnlyMode: true,
        },
      },
    ]),
  ],
  controllers: [ActivationsController],
  providers: [ActivationsService],
})
export class ActivationsModule {}