import { Either, left, right } from "@/core/either";
import { SalespersonsRepo } from "../repos/salespersons-repo";
import { HashComparer } from "../cryptography/hash-comparer";
import { Encrypter } from "../cryptography/encrypter";
import { WrongCredentialsError } from "@/core/errors/errors/wrong-credentials-error";
import { SalespersonDeactiveError } from "@/core/errors/errors/salesperson-deactive-error";

interface AuthenticateSalespersonUseCaseRequest {
  email: string;
  password: string; // Plain text password
}

type AuthenticateSalespersonUseCaseResponse = Either<
  WrongCredentialsError | SalespersonDeactiveError,
  { accessToken: string }
>;

export class AuthenticateSalespersonUseCase {
  constructor(
    private salespersonsRepo: SalespersonsRepo,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateSalespersonUseCaseRequest): Promise<AuthenticateSalespersonUseCaseResponse> {
    const salesperson = await this.salespersonsRepo.findByEmail(email);

    if (!salesperson) {
      return left(new WrongCredentialsError());
    }

    const doesPasswordMatch = await this.hashComparer.compare(
      password,
      salesperson.passwordHash
    );

    if (!doesPasswordMatch) {
      return left(new WrongCredentialsError());
    }

    if (!salesperson.isActive) {
      return left(new SalespersonDeactiveError());
    }

    const accessToken = await this.encrypter.encrypt({ // TODO: Change to JWT
      sub: salesperson.id.toString(),
    });

    return right({ accessToken });
  }
}
