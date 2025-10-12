import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SalesPersonRole } from "@/main/crm/enterprise/entities/enum/role";
import {
  Salesperson,
  SalespersonProps,
} from "@/main/crm/enterprise/entities/salesperson";
import { faker } from "@faker-js/faker";

export function makeSalesperson(
  override: Partial<SalespersonProps> = {},
  id?: UniqueEntityID
) {
  const salesperson = Salesperson.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      passwordHash: faker.internet.password(),
      
      role: SalesPersonRole.salesPerson,
      isActive: true,
      
      ...override,
    },
    id
  );
  return salesperson;
}
