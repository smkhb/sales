import { DomainEvents } from "@/core/events/domain-events";
import { ClientsRepo } from "@/main/crm/app/repos/clients-repo";
import { Client } from "@/main/crm/enterprise/entities/client";

export class InMemoryClientsRepo implements ClientsRepo {
  public items: Client[] = [];

  async create(client: Client) {
    this.items.push(client);

    DomainEvents.dispatchEventsForAggregate(client.ID);
  }

  async save(client: Client) {
    const clientIndex = this.items.findIndex((item) =>
      item.ID.equals(client.ID)
    );

    this.items[clientIndex] = client;

    DomainEvents.dispatchEventsForAggregate(client.ID);
  }

  async delete(client: Client) {
    const clientIndex = this.items.findIndex((item) =>
      item.ID.equals(client.ID)
    );

    this.items.splice(clientIndex, 1);
  }

  async findByID(ID: string) {
    const client = this.items.find((item) => item.ID.toString() === ID);

    if (!client) {
      return null;
    }

    return client;
  }

  async findByEmail(email: string) {
    const client = this.items.find((item) => item.email === email);

    if (!client) {
      return null;
    }

    return client;
  }

  async findBySalesRepID(salesRepID: string) {
    const clients = this.items.filter(
      (item) => item.salesRepID.toString() === salesRepID
    );

    return clients;
  }
}
