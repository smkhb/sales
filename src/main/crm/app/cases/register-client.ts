import { Either, left, right } from "@/core/either";
import { ClientsRepo } from "../repos/clients-repo";
import { ClientAlreadyExistsError } from "@/core/errors/errors/client-already-exists-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client } from "../../enterprise/entities/client";
import { DomainEvents } from "@/core/events/domain-events";

interface RegisterClientUseCaseRequest {
  name: string;
  email: string;
  phone: string;
  segment: string;
  salesRepID: string;
}

type RegisterClientUseCaseResponse = Either<
  ClientAlreadyExistsError,
  { client: Client }
>;

export class RegisterClientUseCase {
  constructor(private clientsRepo: ClientsRepo) {}

  async execute({
    name,
    email,
    phone,
    segment,
    salesRepID,
  }: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
    const clientExist = await this.clientsRepo.findByEmail(email);

    if (clientExist) {
      return left(new ClientAlreadyExistsError(email));
    }

    const client = Client.create({
      name,
      email,
      phone,
      segment,
      salesRepID: new UniqueEntityID(salesRepID),
    });

    await this.clientsRepo.create(client);

    DomainEvents.dispatchEventsForAggregate(client.id);

    return right({ client });
  }
}
