import { Store } from "@tanstack/react-store";

export type ReviewState = {
  selectedAccountId: string;
  reportMode: "draft" | "approved" | "customer-ready";
};

export const reviewStore = new Store<ReviewState>({
  selectedAccountId: "acme-foods",
  reportMode: "draft",
});
