import { DomainEvents } from "@/core/events/domain-events";
import { FakeHasher } from "tests/encryptography/fake-hasher";
import { InMemoSalespersonsRepo } from "tests/repos/in-memo-salespersons-repo";
import { FakeEncrypter } from "tests/encryptography/fake-encrypter";
import { AuthenticateSalespersonUseCase } from "./authenticate-salesperson";
import { makeSalesperson } from "tests/factories/make-salesperson";

let salespersonsRepo: InMemoSalespersonsRepo;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AuthenticateSalespersonUseCase;

describe("Authenticate Salesperson", () => {
  beforeEach(() => {
    salespersonsRepo = new InMemoSalespersonsRepo();
    fakeHasher = new FakeHasher();
    fakeEncrypter = new FakeEncrypter();
    sut = new AuthenticateSalespersonUseCase(
      salespersonsRepo,
      fakeHasher,
      fakeEncrypter
    );
    DomainEvents.clearHandlers();
  });

  it("should be able to authenticate a salesperson ", async () => {
    const salesperson = makeSalesperson({
      email: "johndoe@example.com",
      passwordHash: await fakeHasher.hash("123456"),
    });

    salespersonsRepo.items.push(salesperson);

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toHaveProperty("accessToken");
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });
  });
});
