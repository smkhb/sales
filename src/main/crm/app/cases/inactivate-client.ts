import { Either, left, right } from "@/core/either";
import { Client } from "../../enterprise/entities/client";
import { ClientsRepo } from "../repos/clients-repo";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { DomainEvents } from "@/core/events/domain-events";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error";
import { SalespersonsRepo } from "../repos/salespersons-repo";
import { SalespersonRole } from "../../enterprise/entities/enum/role";
import { ClientNotFoundError } from "./errors/client-not-found-error";

interface InactivateClientUseCaseRequest {
  executorID: string;
  clientID: string;
}

type InactivateClientUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | ClientNotFoundError,
  { client: Client }
>;

export class InactivateClientUseCase {
  constructor(
    private salespersonsRepo: SalespersonsRepo,
    private clientsRepo: ClientsRepo
  ) {}

  async execute({
    executorID,
    clientID,
  }: InactivateClientUseCaseRequest): Promise<InactivateClientUseCaseResponse> {
    const executor = await this.salespersonsRepo.findByID(executorID);

    if (!executor) {
      return left(new ResourceNotFoundError());
    }

    const client = await this.clientsRepo.findByID(clientID);

    if (!client) {
      return left(new ClientNotFoundError());
    }

    if (
      executor.role !== SalespersonRole.manager &&
      executor.id.toString() !== client.salesRepID.toString()
    ) {
      return left(new NotAllowedError());
    }

    client.inactive();

    await this.clientsRepo.save(client);

    DomainEvents.dispatchEventsForAggregate(client.id);

    return right({ client: client });
  }
}
