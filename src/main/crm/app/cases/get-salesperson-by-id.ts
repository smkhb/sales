import { Either, left, right } from "@/core/either";
import { Salesperson } from "../../enterprise/entities/salesperson";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { SalespersonRole } from "../../enterprise/entities/enum/role";

import { SalespersonNotFoundError } from "./errors/salesperson-not-found-error";
import { SalespersonsRepo } from "../repos/salespersons-repo";

interface GetSalespersonByIDUseCaseRequest {
  executorRole: SalespersonRole;
  salespersonID: string;
}

type GetSalespersonByIDUseCaseResponse = Either<
  SalespersonNotFoundError | NotAllowedError,
  { salesperson: Salesperson }
>;

export class GetSalespersonByIDUseCase {
  constructor(private salespersonsRepo: SalespersonsRepo) {}

  async execute({
    executorRole,
    salespersonID,
  }: GetSalespersonByIDUseCaseRequest): Promise<GetSalespersonByIDUseCaseResponse> {
    if (executorRole !== SalespersonRole.manager) {
      return left(new NotAllowedError());
    }

    const salesperson = await this.salespersonsRepo.findByID(salespersonID);

    if (!salesperson) {
      return left(new SalespersonNotFoundError());
    }

    return right({ salesperson });
  }
}
