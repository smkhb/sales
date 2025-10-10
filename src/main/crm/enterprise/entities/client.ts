import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ClientStatus as Status } from "./enum/status";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";
import { ClientCreatedEvent } from "../events/client-created-event";

export interface ClientProps {
  name: string;
  email: string;
  phone: string;
  segment: string;
  status: Status;
  salesRepID: UniqueEntityID;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class Client extends AggregateRoot<ClientProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get phone() {
    return this.props.phone;
  }

  get segment() {
    return this.props.segment;
  }

  get status() {
    return this.props.status;
  }

  get salesRepID() {
    return this.props.salesRepID;
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

  public updatePhone(phone: string) {
    this.props.phone = phone;
    this.touch();
  }

  public active() {
    this.props.status = Status.active;
    this.touch();
  }

  public inactive() {
    this.props.status = Status.inactive;
    this.touch();
  }

  public updateSegment(segment: string) {
    this.props.segment = segment;
    this.touch();
  }

  public updateSalesRepID(salesRepID: UniqueEntityID) {
    this.props.salesRepID = salesRepID;
    this.touch();
  }

  static create(
    props: Optional<ClientProps, "status" | "createdAt">,
    id?: UniqueEntityID
  ): Client {
    const client = new Client(
      {
        ...props,
        status: props.status ?? Status.lead,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    const isNewClient = !id; // If no id is provided, it's a new client

    if (isNewClient) {
      client.addDomainEvent(new ClientCreatedEvent(client));
    }

    return client;
  }
}
