import { EventHandler } from "@/core/events/event-handler";
import { DomainEvents } from "@/core/events/domain-events";
import { SalesOpportunityCreatedEvent } from "@/main/crm/enterprise/events/salesOpportunity-created-event";

export class OnSalesOpportunityCreated implements EventHandler {
  constructor() {
    this.setupSubscriptions();
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.SalesOpportunityCreatedNotification.bind(this),
      SalesOpportunityCreatedEvent.name
    );
  }

  private async SalesOpportunityCreatedNotification({
    salesOpportunity,
  }: SalesOpportunityCreatedEvent) {
    console.log(
      `
      ===============================================
      🚀 Nova Oportunidade Criada!
      ID: ${salesOpportunity.id.toString()}
      Título: ${salesOpportunity.title}
      Cliente: ${salesOpportunity.clientID.toString()}
      ===============================================
      `
    );
  }
}
