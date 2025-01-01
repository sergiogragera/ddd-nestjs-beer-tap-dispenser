import { DispenserRepository } from '../../domain/persistence/dispenser.repository';
import { Dispenser } from '../../domain/models/dispenser';
import { DispenserMikroRepository } from '../../infra/persistence/dispenser-mikro.repository';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import { FindDispenserUseCase } from './find-dispenser.use-case';
import { DispenserNotFoundException } from '../../domain/exceptions/dispenser-not-found.exception';

describe('FindDispenserUseCase', () => {
  let useCase: FindDispenserUseCase;
  let repository: DispenserRepository;

  beforeEach(() => {
    repository = new DispenserMikroRepository(null);
    useCase = new FindDispenserUseCase(repository);
  });

  it('should throw DispenserNotFoundException when not found', async () => {
    const id = DispenserId.create();

    jest.spyOn(repository, 'findById').mockResolvedValue(undefined);

    expect(useCase.execute(id)).rejects.toThrow(DispenserNotFoundException);
  });

  it('should return dispenser', async () => {
    const id = DispenserId.create();
    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    jest.spyOn(repository, 'findById').mockResolvedValue(dispenser);

    const response = await useCase.execute(id);

    expect(repository.findById).toHaveBeenCalledWith(id);
    expect(response).toEqual(dispenser.toPrimitives());
  });
});