export interface Transaction {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

export interface FinancialSummary {
  "Total Income: ": number;
  " total Expense ": number;
  "balance ": number;
}
