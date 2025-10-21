import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface SalesOpportunityProps {
  creatorID: UniqueEntityID;
  clientID: UniqueEntityID;
  salesRepID: UniqueEntityID;
  title: string;
  description: string;
  value: string;
  status: salesOpportunityStatus;
  createdAt: Date;
  updatedAt?: Date | null;
}
