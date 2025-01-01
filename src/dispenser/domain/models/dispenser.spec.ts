import { DispenserAlreadyOpenedException } from '../exceptions/dispenser-already-opened.exception';
import { DispenserClosedAfterOpenException } from '../exceptions/dispenser-closed-after-open.exception';
import { DispenserNotOpenedException } from '../exceptions/dispenser-not-opened.exception';
import { DispenserOpenedAfterCloseException } from '../exceptions/dispenser-opened-after-close.exception';
import { Dispenser, DispenserPrimitives } from './dispenser';
import { DispenserFlowVolume } from './value-objects/dispenser-flow-volume.value-object';

describe('Dispenser', () => {
  it('create valid opened from primitives', () => {
    const dispenserPrimitives: DispenserPrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
    };

    const dispenser = Dispenser.fromPrimitives(dispenserPrimitives);
    expect(dispenser.toPrimitives()).toEqual({
      ...dispenserPrimitives,
      closedAt: undefined,
    });
  });

  it('create valid closed from primitives', () => {
    const dispenserPrimitives: DispenserPrimitives = {
      id: '317ba3b4-a7b0-478b-83f6-9b99daa762b8',
      flowVolume: '0.0001',
      openedAt: '1/1/2025, 10:59:35 AM',
      closedAt: '1/1/2025, 11:01:22 AM',
    };

    const dispenser = Dispenser.fromPrimitives(dispenserPrimitives);
    expect(dispenser.toPrimitives()).toEqual(dispenserPrimitives);
  });

  it('create valid dispenser', () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );
    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: undefined,
      closedAt: undefined,
    });
  });

  it('throw error when open already opened dispenser', () => {
    const now = new Date();

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(() => dispenser.open()).toThrow(DispenserAlreadyOpenedException);
  });

  it('throw error when open before close date dispenser', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(aMinuteAgo);
    dispenser.close(now);

    expect(() => dispenser.open(aMinuteAgo)).toThrow(
      DispenserClosedAfterOpenException,
    );
  });

  it('open dispenser', () => {
    const now = new Date();

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: now.toLocaleString(),
      closedAt: undefined,
    });
  });

  it('throw error when close not opened dispenser', () => {
    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    expect(() => dispenser.close()).toThrow(DispenserNotOpenedException);
  });

  it('throw error when close before open date', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(now);

    expect(() => dispenser.close(aMinuteAgo)).toThrow(
      DispenserOpenedAfterCloseException,
    );
  });

  it('close dispenser', () => {
    const now = new Date();
    const aMinuteAgo = new Date(now.getTime() - 60000);

    const dispenser = Dispenser.create(
      DispenserFlowVolume.fromString('0.0001'),
    );

    dispenser.open(aMinuteAgo);
    dispenser.close(now);

    expect(dispenser.toPrimitives()).toEqual({
      id: expect.any(String),
      flowVolume: '0.0001',
      openedAt: aMinuteAgo.toLocaleString(),
      closedAt: now.toLocaleString(),
    });
  });
});
