export const CATEGORIES = ["Aptitude", "DSA", "SQL", "React", "Backend", "Projects"] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ["Not Started", "In Progress", "Completed"] as const;
export type Status = (typeof STATUSES)[number];

export const PRIORITIES = ["High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const RESOURCE_TYPES = ["YouTube", "Documentation", "Practice", "Notes", "Course"] as const;
export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface Topic {
  id: string;
  name: string;
  category: Category;
  priority: Priority;
  hours: number;
  status: Status;
}

export interface Task {
  id: string;
  title: string;
  category: Category;
  topic: string;
  priority: Priority;
  minutes: number;
  dueDate: string;
  status: Status;
  today?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  category: Category;
  type: ResourceType;
  description: string;
  url: string;
  difficulty: Difficulty;
}

export interface Profile {
  name: string;
  college: string;
  branch: string;
  graduationYear: string;
  targetRole: string;
  skills: string[];
}

export const CATEGORY_TOKEN: Record<Category, string> = {
  Aptitude: "aptitude",
  DSA: "dsa",
  SQL: "sql",
  React: "react",
  Backend: "backend",
  Projects: "projects",
};
