import { Either, left, right } from "@/core/either";
import { Salesperson } from "../../enterprise/entities/salesperson";
import { DomainEvents } from "@/core/events/domain-events";
import { SalespersonsRepo } from "../repos/salespersons-repo";
import { HashGenerator } from "../cryptography/hash-generator";
import { SalespersonAlreadyExistsError } from "./errors/salesperson-already-exists-error";

interface RegisterSalespersonUseCaseRequest {
  name: string;
  email: string;
  password: string; // Plain text password
  phone: string;
}

type RegisterSalespersonUseCaseResponse = Either<
  SalespersonAlreadyExistsError,
  { salesperson: Salesperson }
>;

export class RegisterSalespersonUseCase {
  constructor(
    private salespersonsRepo: SalespersonsRepo,
    private hashGenerator: HashGenerator
  ) {}

  async execute({
    name,
    email,
    password,
    phone,
  }: RegisterSalespersonUseCaseRequest): Promise<RegisterSalespersonUseCaseResponse> {
    const salespersonExist = await this.salespersonsRepo.findByEmail(email);

    if (salespersonExist) {
      return left(new SalespersonAlreadyExistsError(email));
    }

    const passwordHash = await this.hashGenerator.hash(password);

    const salesperson = Salesperson.create({
      name,
      email,
      passwordHash,
      phone,
    });

    await this.salespersonsRepo.create(salesperson);

    DomainEvents.dispatchEventsForAggregate(salesperson.id);

    return right({ salesperson });
  }
}
