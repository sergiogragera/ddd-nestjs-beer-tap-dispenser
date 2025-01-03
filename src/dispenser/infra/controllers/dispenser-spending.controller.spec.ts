import { Dispenser } from '../../domain/models/dispenser';
import { DispenserId } from '../../domain/models/value-objects/dispenser-id.value-object';
import mock from 'jest-mock-extended/lib/Mock';
import { FindDispenserSpendingsUseCase } from '../../application/use-cases/find-dispenser-spendings.use-case';
import { DispenserSpendingController } from './dispenser-spending.controller';
import { DispenserUsage } from '../../domain/models/dispenser-usage';
import { DispenserUsageId } from '../../domain/models/value-objects/dispenser-usage-id.value-object';

describe('DispenserSpendingController', () => {
  const useCase = mock<FindDispenserSpendingsUseCase>();
  let controller: DispenserSpendingController;

  beforeEach(() => {
    controller = new DispenserSpendingController(useCase);
  });

  it('should update dispenser status', async () => {
    const id = DispenserId.create();

    const dispenser = Dispenser.fromPrimitives({
      id: id.value,
      flowVolume: '0.00001',
      openedAt: '1/1/2025, 10:59:35 AM',
    });

    const dispenserUsage = DispenserUsage.fromPrimitives({
      id: DispenserUsageId.create().value,
      dispenserId: dispenser.id.value,
      flowVolume: dispenser.flowVolume.value,
      totalSpent: '100',
      openedAt: '2/1/2025, 10:59:35 AM',
      closedAt: '2/1/2025, 11:00:35 AM',
    });

    jest
      .spyOn(useCase, 'execute')
      .mockResolvedValue([dispenserUsage.toPrimitives()]);

    const response = await controller.findAll(id.value);

    expect(useCase.execute).toHaveBeenCalledWith(id);
    expect(response).toEqual([dispenserUsage.toPrimitives()]);
  });
});
