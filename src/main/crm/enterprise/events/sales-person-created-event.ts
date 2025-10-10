import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { SalesPerson } from "../entities/sales-person";

export class SalesPersonEvent implements DomainEvent {
  public ocurredAt: Date;
  private readonly salesPerson: SalesPerson;

  constructor(salesPerson: SalesPerson) {
    this.ocurredAt = new Date();
    this.salesPerson = salesPerson;
  }

  getAggregateID(): UniqueEntityID {
    return this.salesPerson.id;
  }
}
