import { UseCaseError } from "../use-case-error";

export class SalespersonAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Salesperson with ${identifier} already exists`);
  }
}
