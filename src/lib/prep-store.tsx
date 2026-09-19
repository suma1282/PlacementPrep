import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";

import { mapProfileRow, useAuth } from "./auth";
import {
  bestStreak,
  currentStreak,
  initialResources,
  initialTasks,
  initialTopics,
  recentActivity,
  weeklyGoalTasks,
  weeklyMinutes,
} from "./prep-data";
import { CATEGORIES, type Category, type Profile, type Status, type Task, type Topic } from "./prep-types";

const emptyProfile: Profile = {
  name: "",
  college: "",
  branch: "",
  graduationYear: "",
  targetRole: "",
  skills: [],
};

export type TaskDraft = Omit<Task, "id">;

interface CategoryStat {
  category: Category;
  completed: number;
  total: number;
  percent: number;
}

interface PrepValue {
  topics: Topic[];
  tasks: Task[];
  resources: typeof initialResources;
  profile: Profile;
  addTask: (draft: TaskDraft) => void;
  updateTask: (id: string, draft: TaskDraft) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: Status) => void;
  toggleTaskComplete: (id: string) => void;
  setTopicStatus: (id: string, status: Status) => void;
  cycleTopicStatus: (id: string) => void;
  updateProfile: (profile: Profile) => void;
  stats: {
    overallPercent: number;
    tasksCompleted: number;
    tasksTotal: number;
    topicsCompleted: number;
    topicsTotal: number;
    topicsRemaining: number;
    streak: number;
    bestStreak: number;
    weeklyGoalTasks: number;
    weeklyDone: number;
    byCategory: CategoryStat[];
    todayTasks: Task[];
    nextTopic: Topic | undefined;
  };
  weeklyMinutes: typeof weeklyMinutes;
  recentActivity: typeof recentActivity;
}

const PrepContext = createContext<PrepValue | null>(null);

const nextStatus = (status: Status): Status =>
  status === "Not Started" ? "In Progress" : status === "In Progress" ? "Completed" : "Not Started";

export function PrepProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>(initialTopics);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [resources] = useState(initialResources);
  const [profile, setProfile] = useState<Profile>(emptyProfile);

  useEffect(() => {
    if (!user) {
      setProfile(emptyProfile);
      return;
    }

    let cancelled = false;
    void supabase
      .from("profiles")
      .select("full_name, college, branch, graduation_year, target_role, skills")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data) return;
        setProfile(mapProfileRow(data));
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const value = useMemo<PrepValue>(() => {
    const topicsCompleted = topics.filter((t) => t.status === "Completed").length;
    const tasksCompleted = tasks.filter((t) => t.status === "Completed").length;
    const overallPercent = topics.length
      ? Math.round(
          ((topicsCompleted + topics.filter((t) => t.status === "In Progress").length * 0.5) /
            topics.length) *
            100,
        )
      : 0;

    const byCategory: CategoryStat[] = CATEGORIES.map((category) => {
      const list = topics.filter((t) => t.category === category);
      const completed = list.filter((t) => t.status === "Completed").length;
      return {
        category,
        completed,
        total: list.length,
        percent: list.length ? Math.round((completed / list.length) * 100) : 0,
      };
    });

    return {
      topics,
      tasks,
      resources,
      profile,
      addTask: (draft) =>
        setTasks((prev) => [{ ...draft, id: `task-new-${Date.now()}` }, ...prev]),
      updateTask: (id, draft) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...draft, id } : t))),
      deleteTask: (id) => setTasks((prev) => prev.filter((t) => t.id !== id)),
      setTaskStatus: (id, status) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))),
      toggleTaskComplete: (id) =>
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id
              ? { ...t, status: t.status === "Completed" ? "Not Started" : "Completed" }
              : t,
          ),
        ),
      setTopicStatus: (id, status) =>
        setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t))),
      cycleTopicStatus: (id) =>
        setTopics((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: nextStatus(t.status) } : t)),
        ),
      updateProfile: (next) => {
        setProfile(next);
        if (!user) return;
        void supabase
          .from("profiles")
          .update({
            full_name: next.name,
            college: next.college,
            branch: next.branch,
            graduation_year: next.graduationYear,
            target_role: next.targetRole,
            skills: next.skills,
          })
          .eq("id", user.id);
      },
      stats: {
        overallPercent,
        tasksCompleted,
        tasksTotal: tasks.length,
        topicsCompleted,
        topicsTotal: topics.length,
        topicsRemaining: topics.length - topicsCompleted,
        streak: currentStreak,
        bestStreak,
        weeklyGoalTasks,
        weeklyDone: tasksCompleted,
        byCategory,
        todayTasks: tasks.filter((t) => t.today),
        nextTopic:
          topics.find((t) => t.status === "In Progress") ??
          topics.find((t) => t.status === "Not Started"),
      },
      weeklyMinutes,
      recentActivity,
    };
  }, [topics, tasks, resources, profile, user]);

  return <PrepContext.Provider value={value}>{children}</PrepContext.Provider>;
}

export function usePrep() {
  const ctx = useContext(PrepContext);
  if (!ctx) throw new Error("usePrep must be used inside PrepProvider");
  return ctx;
}
