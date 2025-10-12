import { DomainEvents } from "@/core/events/domain-events";
import { RegisterSalespersonUseCase } from "./register-salesperson";
import { FakeHasher } from "tests/encryptography/fake-hasher";
import { InMemoSalespersonsRepo } from "tests/repos/in-memo-salespersons-repo";
import { SalespersonAlreadyExistsError } from "./errors/salesperson-already-exists-error";
import { makeSalesperson } from "tests/factories/make-salesperson";

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
    const salesperson = makeSalesperson({
      email: "johndoe@example.com",
      passwordHash: await fakeHasher.hash("123456"),
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
