import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { SalesPersonEvent } from "../events/sales-person-created-event";
import { SalesPersonRole } from "./enum/role";

export interface SalesPersonProps {
  name: string;
  email: string;
  password: string; // Hashed password
  phone: string;
  role: SalesPersonRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class SalesPerson extends AggregateRoot<SalesPersonProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  get role() {
    return this.props.role;
  }

  get isActive() {
    return this.props.isActive;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  public updateName(name: string) {
    this.props.name = name;
    this.touch();
  }

  public updateEmail(email: string) {
    this.props.email = email;
    this.touch();
  }

  public updatePasswordHash(passwordHash: string) {
    this.props.password = passwordHash;
    this.touch();
  }

  public updatePhone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  public updateRole(role: SalesPersonRole) {
    this.props.role = role;
    this.touch();
  }

  public activate() {
    this.props.isActive = true;
    this.touch();
  }

  public deactive() {
    this.props.isActive = false;
    this.touch();
  }

  static create(
    props: Optional<SalesPersonProps, "createdAt" | "role" | "isActive">,
    id?: UniqueEntityID
  ): SalesPerson {
    const salesPerson = new SalesPerson(
      {
        ...props,
        role: props.role ?? SalesPersonRole.salesPerson,
        isActive: props.isActive ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );

    const isNewSalesPerson = !id;

    if (isNewSalesPerson) {
      salesPerson.addDomainEvent(new SalesPersonEvent(salesPerson));
    }

    return salesPerson;
  }
}
