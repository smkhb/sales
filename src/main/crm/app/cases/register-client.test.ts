import { InMemoClientsRepo } from "tests/repos/in-memo-clients-repo";
import { RegisterClientUseCase } from "./register-client";
import { Client } from "../../enterprise/entities/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ClientAlreadyExistsError } from "@/core/errors/errors/client-already-exists-error";
import { DomainEvents } from "@/core/events/domain-events";

let clientsRepo: InMemoClientsRepo;
let sut: RegisterClientUseCase;

describe("Register Client", () => {
  beforeEach(() => {
    clientsRepo = new InMemoClientsRepo();
    sut = new RegisterClientUseCase(clientsRepo);
    DomainEvents.clearHandlers();
  });

  it("should be able to register a new client", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: "sales-rep-id",
    });

    expect(result.isRight()).toBe(true);
    expect(clientsRepo.items[0]).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    );
    expect(clientsRepo.items).toHaveLength(1);
  });

  it("should not be able to register a new client with an existing email", async () => {
    const client = Client.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: new UniqueEntityID("sales-rep-id"),
    });

    await clientsRepo.create(client);

    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      segment: "SMB",
      salesRepID: "sales-rep-id",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError);
    expect(clientsRepo.items).toHaveLength(1);
  });
});
