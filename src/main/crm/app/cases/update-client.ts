import { Either, left, right } from "@/core/either";
import { Client } from "../../enterprise/entities/client";
import { ClientsRepo } from "../repos/clients-repo";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { ClientAlreadyExistsError } from "@/core/errors/errors/client-already-exists-error";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface UpdateClientUseCaseRequest {
  clientID: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  salesRepID: string;
}

type UpdateClientUseCaseResponse = Either<
  ResourceNotFoundError | ClientAlreadyExistsError,
  { client: Client }
>;

export class UpdateClientUseCase {
  constructor(private clientsRepo: ClientsRepo) {}

  async execute({
    clientID,
    name,
    email,
    phone,
    segment,
    salesRepID,
  }: UpdateClientUseCaseRequest): Promise<UpdateClientUseCaseResponse> {
    const client = await this.clientsRepo.findByID(clientID);

    if (!client) {
      return left(new ResourceNotFoundError());
    }

    const clientWithSameEmail = await this.clientsRepo.findByEmail(email);

    if (clientWithSameEmail && !client.id.equals(clientWithSameEmail.id)) {
      return left(new ClientAlreadyExistsError(email));
    }

    client.updateName(name);
    client.updateEmail(email);
    client.updatePhone(phone);
    client.updateSegment(segment);
    client.updateSalesRepID(new UniqueEntityID(salesRepID));

    await this.clientsRepo.save(client);

    return right({ client });
  }
}
