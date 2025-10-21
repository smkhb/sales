import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { DomainEvent } from "@/core/events/domain-event";
import { SalesOpportunity } from "../entities/sales-opportunity";

export class SalesOpportunityCreatedEvent implements DomainEvent {
  public ocurredAt: Date;
  private readonly salesOpportunity: SalesOpportunity;

  constructor(salesOpportunity: SalesOpportunity) {
    this.ocurredAt = new Date();
    this.salesOpportunity = salesOpportunity;
  }

  getAggregateID(): UniqueEntityID {
    return this.salesOpportunity.id;
  }
}
