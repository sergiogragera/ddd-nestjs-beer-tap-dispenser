import { Inject, Injectable, Logger } from '@nestjs/common';
import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { DispenserPrimitives } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';
import { DispenserStatus } from '../../domain/enums/dispenser-status.enum';
import { EventPublisher } from '@nestjs/cqrs';

@Injectable()
export class UpdateStatusDispenserUseCase {
  private readonly logger = new Logger(UpdateStatusDispenserUseCase.name);

  constructor(
    @Inject('DispenserRepository')
    private readonly dispenserRepository: DispenserRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(
    id: DispenserId,
    status: DispenserStatus,
    updatedAt: Date,
  ): Promise<DispenserPrimitives> {
    this.logger.log(
      `update ${status} status request for dispenser with id ${id.value} received`,
    );
    const dispenser = await this.dispenserRepository.findById(id);
    if (!dispenser) {
      throw new DispenserNotFoundException(id);
    }

    this.publisher.mergeObjectContext(dispenser);
    if (status === DispenserStatus.OPEN) {
      dispenser.open(updatedAt);
    } else {
      dispenser.close(updatedAt);
    }
    const updatedDispenser = await this.dispenserRepository.update(dispenser);

    return updatedDispenser.toPrimitives();
  }
}
