import { DomainEvents } from "@/core/events/domain-events";
import { RegisterSalespersonUseCase } from "./register-salesperson";
import { FakeHasher } from "tests/encryptography/fake-hasher";
import { InMemoSalespersonsRepo } from "tests/repos/in-memo-salespersons-repo";
import { Salesperson } from "../../enterprise/entities/salesperson";
import { SalespersonAlreadyExistsError } from "./errors/salesperson-already-exists-error";

let salespersonsRepo: InMemoSalespersonsRepo;
let fakeHasher: FakeHasher;
let sut: RegisterSalespersonUseCase;

describe("Register Salesperson", () => {
  beforeEach(() => {
    salespersonsRepo = new InMemoSalespersonsRepo();
    fakeHasher = new FakeHasher();
    sut = new RegisterSalespersonUseCase(salespersonsRepo, fakeHasher);
    DomainEvents.clearHandlers();
  });

  it("should be able to register a salesperson ", async () => {
    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(salespersonsRepo.items[0]).toEqual(
      expect.objectContaining({
        name: "John Doe",
        email: "johndoe@example.com",
      })
    );
    expect(salespersonsRepo.items).toHaveLength(1);
  });

  it("should not be able to register a new salesperson with an existing email", async () => {
    const salesperson = Salesperson.create({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      passwordHash: "123456-hashed",
    });

    await salespersonsRepo.create(salesperson);

    const result = await sut.execute({
      name: "John Doe",
      email: "johndoe@example.com",
      phone: "11999999999",
      password: "123456",
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(SalespersonAlreadyExistsError);
    expect(salespersonsRepo.items).toHaveLength(1);
  });
});
