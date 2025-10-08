import { InMemoClientsRepo } from "tests/repos/in-memo-clients-repo";
import { UpdateClientUseCase } from "./update-client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Client } from "../../enterprise/entities/client";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error";
import { ClientAlreadyExistsError } from "@/core/errors/errors/client-already-exists-error";
import { DomainEvents } from "@/core/events/domain-events";

let clientsRepo: InMemoClientsRepo;
let sut: UpdateClientUseCase;

describe("Update Client", () => {
  beforeEach(() => {
    clientsRepo = new InMemoClientsRepo();
    sut = new UpdateClientUseCase(clientsRepo);
    DomainEvents.clearHandlers();
  });

  it("should be able to update a client", async () => {
    const client = Client.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: new UniqueEntityID("sales-rep-id"),
    });

    await clientsRepo.create(client);

    const result = await sut.execute({
      clientID: client.id.toString(),
      name: "John Smith",
      email: "johndoe@example.com",
      phone: "11988888888",
      segment: "Enterprise",
      salesRepID: "new-sales-rep-id",
    });

    expect(result.isRight()).toBe(true);
    expect(clientsRepo.items[0]).toEqual(
      expect.objectContaining({
        name: "John Smith",
        email: "johndoe@example.com",
      })
    );
  });

  it("should not be able to update a non existing client", async () => {
    const client = Client.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: new UniqueEntityID("sales-rep-id"),
    });

    await clientsRepo.create(client);

    const result = await sut.execute({
      clientID: "non-existing-client-id",
      name: "John Smith",
      email: "johndoe@example.com",
      phone: "11988888888",
      segment: "Enterprise",
      salesRepID: "new-sales-rep-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to update a client email to an already registered client", async () => {
    const client = Client.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: new UniqueEntityID("sales-rep-id"),
    });

    const client2 = Client.create({
      name: "John Doe",
      email: "johndoe2@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: new UniqueEntityID("sales-rep-id"),
    });

    await clientsRepo.create(client);
    await clientsRepo.create(client2);

    const result = await sut.execute({
      clientID: client2.id.toString(),
      name: "John Smith",
      email: "johndoe@example.com",
      phone: "11988888888",
      segment: "Enterprise",
      salesRepID: "new-sales-rep-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError);
  });
});
