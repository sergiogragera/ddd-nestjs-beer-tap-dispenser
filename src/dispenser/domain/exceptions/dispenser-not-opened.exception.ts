import { DispenserId } from '../models/value-objects/dispenser-id.value-object';

export class DispenserNotOpenedException extends Error {
  constructor(id: DispenserId) {
    super(`dispenser with id ${id.value} is not opened`);
  }
}