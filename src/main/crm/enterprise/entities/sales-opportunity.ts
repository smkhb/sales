import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { SalesOpportunityStatus as OpportunityStatus } from "./enum/salesOpportunityStatus";
import { AggregateRoot } from "@/core/entities/aggregate-root";
import { Optional } from "@/core/types/optional";
import { SalesOpportunityCreatedEvent } from "../events/salesOpportunity-created-event";

export interface SalesOpportunityProps {
  creatorID: UniqueEntityID;
  clientID: UniqueEntityID;
  salesRepID: UniqueEntityID;
  title: string;
  description: string;
  value: number;
  status: OpportunityStatus;
  deliveryPhotoURL?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}

export class SalesOpportunity extends AggregateRoot<SalesOpportunityProps> {
  get creatorID() {
    return this.props.creatorID;
  }

  get clientID() {
    return this.props.clientID;
  }

  get salesRepID() {
    return this.props.salesRepID;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get value() {
    return this.props.value;
  }

  get status() {
    return this.props.status;
  }

  get deliveryPhotoURL() {
    return this.props.deliveryPhotoURL;
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

  public updateTitle(title: string) {
    this.props.title = title;
    this.touch();
  }

  public updateDescription(description: string) {
    this.props.description = description;
    this.touch();
  }

  public updateValue(value: number) {
    this.props.value = value;
    this.touch();
  }

  public updateStatus(status: OpportunityStatus) {
    this.props.status = status;
    this.touch();
  }

  public markAsDelivered(photoURL: string) {
    if (!photoURL) {
      throw new Error("Photo URL is required to mark as delivered.");
    }
    if (this.props.status !== OpportunityStatus.won) {
      throw new Error("Only won opportunities can be marked as delivered.");
    }
    this.props.status = OpportunityStatus.delivered;
    this.props.deliveryPhotoURL = photoURL;
    this.touch();
  }

  static create(
    props: Optional<
      SalesOpportunityProps,
      "creatorID" | "status" | "createdAt"
    >,
    id?: UniqueEntityID
  ) {
    const salesOpportunity = new SalesOpportunity(
      {
        ...props,
        creatorID: props.creatorID ?? props.salesRepID,
        status: props.status ?? OpportunityStatus.open,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
    const isNewSalesOpportunity = !id;

    if (isNewSalesOpportunity) {
      salesOpportunity.addDomainEvent(
        new SalesOpportunityCreatedEvent(salesOpportunity)
      );
    }

    return salesOpportunity;
  }
}
