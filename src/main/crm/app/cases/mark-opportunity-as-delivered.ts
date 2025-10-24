import { Either, left, Left, right } from "@/core/either";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { SalespersonNotFoundError } from "./errors/salesperson-not-found-error";
import { SalesOpportunity } from "../../enterprise/entities/sales-opportunity";
import { SalespersonsRepo } from "../repos/salespersons-repo";
import { SalespersonRole } from "../../enterprise/entities/enum/salespersonRole";
import { SalesOpportunitiesRepo } from "../repos/salesOpportunities-repo";
import { SalesOpportunityNotFoundError } from "./errors/sales-opportunity-not-found-error";

interface MarkOpportunityAsDeliveredUseCaseRequest {
  executorID: string;
  salesOpportunityID: string;
  photoURL: string;
}

type MarkOpportunityAsDeliveredUseCaseResponse = Either<
  SalespersonNotFoundError | NotAllowedError | SalesOpportunityNotFoundError,
  { salesOpportunity: SalesOpportunity }
>;

export class MarkOpportunityAsDeliveredUseCase {
  constructor(
    private salespersonsRepo: SalespersonsRepo,
    private salesOpportunitiesRepo: SalesOpportunitiesRepo
  ) {}

  async execute({
    executorID,
    salesOpportunityID,
    photoURL,
  }: MarkOpportunityAsDeliveredUseCaseRequest): Promise<MarkOpportunityAsDeliveredUseCaseResponse> {
    const executor = await this.salespersonsRepo.findByID(executorID);

    if (!executor) {
      return new Left(new SalespersonNotFoundError());
    }

    const salesOpportunity = await this.salesOpportunitiesRepo.findByID(
      salesOpportunityID
    );

    if (!salesOpportunity) {
      return left(new SalesOpportunityNotFoundError());
    }

    if (
      executor.role !== SalespersonRole.manager &&
      executor.id.toString() !== salesOpportunity.salesRepID.toString()
    ) {
      return left(new NotAllowedError());
    }

    const result = salesOpportunity.markAsDelivered(photoURL);

    if (result.isLeft()) {
      return left(result.value);
    }

    this.salesOpportunitiesRepo.save(salesOpportunity);

    return right({ salesOpportunity });
  }
}
