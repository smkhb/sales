import { Client } from "../../enterprise/entities/client";

export abstract class ClientsRepo {
  abstract create(client: Client): Promise<void>;
  abstract save(client: Client): Promise<void>;
  abstract delete(client: Client): Promise<void>;

  abstract findByID(ID: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract findBySalesRepID(salesRepID: string): Promise<Client[]>;
}
