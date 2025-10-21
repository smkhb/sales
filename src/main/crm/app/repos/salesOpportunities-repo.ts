import { SalesOpportunity } from "../../enterprise/entities/salesOpportunity";

export abstract class SalesOpportunitiesRepo {
  abstract create(salesopportunity: SalesOpportunity): Promise<void>;
  abstract save(salesopportunity: SalesOpportunity): Promise<void>;
  abstract delete(salesopportunity: SalesOpportunity): Promise<void>;

  abstract findByID(id: string): Promise<SalesOpportunity | null>;
  abstract findMany(page: number): Promise<SalesOpportunity[]>;
}
