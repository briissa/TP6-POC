import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { createEvent, TOPICS } from '@poc/contracts';
import { Activation } from './activation.entity';
import { CreateActivationDto } from './dto/create-activation.dto';

@Injectable()
export class ActivationsService implements OnModuleInit {
  constructor(
    @InjectRepository(Activation) private readonly repo: Repository<Activation>,
    @Inject('KAFKA_CLIENT') private readonly kafka: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async create(dto: CreateActivationDto) {
    const id = `act-${randomUUID().slice(0, 8)}`;

    const event = createEvent({
      eventType: 'ActivationRequested',
      correlationId: id,
      customerId: dto.customerId,
      source: 'activation-api',
      payload: {
        planId: dto.planId,
        channel: dto.channel ?? 'web',
        simulateFailure: dto.simulateFailure ?? 'none',
      },
    });

    // 1) Guardar la activación en PENDING
    await this.repo.save(
      this.repo.create({
        id,
        customerId: dto.customerId,
        planId: dto.planId,
        status: 'PENDING',
        simulateFailure: dto.simulateFailure ?? 'none',
        steps: {},
        history: [{ eventType: event.eventType, at: event.occurredAt }],
      }),
    );

    // 2) Publicar el evento. La clave es customerId (RNF-02)
    await lastValueFrom(
      this.kafka.emit(TOPICS.ACTIVATION_REQUESTED, {
        key: dto.customerId,
        value: event,
      }),
    );

    return { activationId: id, status: 'PENDING' };
  }

  async findOne(id: string) {
    const activation = await this.repo.findOneBy({ id });
    if (!activation) {
      throw new NotFoundException(`Activación ${id} no encontrada`);
    }
    return activation;
  }
}