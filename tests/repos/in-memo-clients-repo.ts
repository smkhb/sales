import { ClientsRepo } from "@/main/crm/app/repos/clients-repo";
import { Client } from "@/main/crm/enterprise/entities/client";

export class InMemoClientsRepo implements ClientsRepo {
  public items: Client[] = [];

  async create(client: Client) {
    this.items.push(client);
  }

  async save(client: Client) {
    const clientIndex = this.items.findIndex((item) =>
      item.id.equals(client.id)
    );

    if (clientIndex < 0) {
      throw new Error("Client not found"); // TODO: create a specific error
    }

    this.items[clientIndex] = client;
  }

  async delete(client: Client) {
    const clientIndex = this.items.findIndex((item) =>
      item.id.equals(client.id)
    );

    this.items.splice(clientIndex, 1);
  }

  async findByID(id: string) {
    const client = this.items.find((item) => item.id.toString() === id);

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

  async findBySalesRepID(salesRepid: string) {
    const clients = this.items.filter(
      (item) => item.salesRepID.toString() === salesRepid
    );

    return clients;
  }
}
