export interface Note {
  id: number;
  title: string;
  content: string;
  category: Category;
  priority: Priority;
  tags: string[];
  aiClassified: boolean;
  confidence: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export type Category = "Work" | "Personal" | "Health" | "Finance" | "Learning" | "Creative";
export type Priority = "Low" | "Medium" | "High" | "Critical";

export interface PredictionResult {
  category: Category;
  confidence: number;
  probabilities: Record<string, number>;
  priority: Priority;
  tags: string[];
}

export interface DashboardStats {
  totalNotes: number;
  aiClassified: number;
  categoryDistribution: Record<string, number>;
  priorityDistribution: Record<string, number>;
  modelInfo: ModelInfo;
}

export interface ModelInfo {
  trained: boolean;
  architecture?: string;
  vocabularySize?: number;
  categories?: string[];
  trainingSamples?: number;
  lossCurve?: number[];
  bestValidationScore?: number | null;
  nIter?: number;
}

export const CATEGORIES: Category[] = ["Work", "Personal", "Health", "Finance", "Learning", "Creative"];
export const PRIORITIES: Priority[] = ["Low", "Medium", "High", "Critical"];

export const CATEGORY_COLORS: Record<Category, string> = {
  Work: "#f59e0b",
  Personal: "#ec4899",
  Health: "#10b981",
  Finance: "#06b6d4",
  Learning: "#8b5cf6",
  Creative: "#f43f5e",
};

export const CATEGORY_ICONS: Record<Category, string> = {
  Work: "work",
  Personal: "favorite",
  Health: "fitness_center",
  Finance: "account_balance",
  Learning: "school",
  Creative: "palette",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  Low: "#6b7280",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};