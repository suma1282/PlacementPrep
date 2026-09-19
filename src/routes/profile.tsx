import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { MetaBadge } from "@/components/prep/badges";
import { ActionButton, Field, inputClass, Panel, PanelHeader } from "@/components/prep/primitives";
import { usePrep } from "@/lib/prep-store";
import type { Profile } from "@/lib/prep-types";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — PlacementPrep" },
      {
        name: "description",
        content:
          "Your PlacementPrep profile: name, college, branch, graduation year, target role and skills, all editable.",
      },
      { property: "og:title", content: "Profile — PlacementPrep" },
      {
        property: "og:description",
        content: "College, branch, graduation year, target role and skills in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { profile, updateProfile, stats } = usePrep();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>(profile);
  const [skillsText, setSkillsText] = useState(profile.skills.join(", "));

  useEffect(() => {
    if (editing) return;
    setDraft(profile);
    setSkillsText(profile.skills.join(", "));
  }, [profile, editing]);

  const startEdit = () => {
    setDraft(profile);
    setSkillsText(profile.skills.join(", "));
    setEditing(true);
  };

  return (
    <>
      <Panel className="p-6">
        <PanelHeader
          title="Profile"
          action={
            editing ? undefined : (
              <ActionButton onClick={startEdit}>Edit profile</ActionButton>
            )
          }
        />

        {editing ? (
          <form
            className="mt-5 grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile({
                ...draft,
                skills: skillsText
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              });
              setEditing(false);
            }}
          >
            <Field label="Name">
              <input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="College">
              <input
                value={draft.college}
                onChange={(e) => setDraft({ ...draft, college: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Branch">
              <input
                value={draft.branch}
                onChange={(e) => setDraft({ ...draft, branch: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Graduation year">
              <input
                value={draft.graduationYear}
                onChange={(e) => setDraft({ ...draft, graduationYear: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Target role">
              <input
                value={draft.targetRole}
                onChange={(e) => setDraft({ ...draft, targetRole: e.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Skills (comma separated)">
              <input
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="mt-2 flex items-center gap-2 sm:col-span-2">
              <ActionButton type="submit">Save profile</ActionButton>
              <ActionButton variant="quiet" onClick={() => setEditing(false)}>
                Cancel
              </ActionButton>
            </div>
          </form>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ["Name", profile.name],
              ["College", profile.college],
              ["Branch", profile.branch],
              ["Graduation year", profile.graduationYear],
              ["Target role", profile.targetRole],
            ].map(([label, value]) => (
              <div key={label} className="frost-inset rounded-2xl p-4">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{label}</p>
                <p className="mt-1 text-sm font-semibold">{value}</p>
              </div>
            ))}
            <div className="frost-inset rounded-2xl p-4">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Skills</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <MetaBadge key={skill}>{skill}</MetaBadge>
                ))}
              </div>
            </div>
          </div>
        )}
      </Panel>

      <Panel delay={100}>
        <PanelHeader title="Preparation snapshot" />
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="frost-inset rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Overall</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{stats.overallPercent}%</p>
          </div>
          <div className="frost-inset rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Topics done</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{stats.topicsCompleted}</p>
          </div>
          <div className="frost-inset rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Tasks done</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{stats.tasksCompleted}</p>
          </div>
          <div className="frost-inset rounded-2xl p-4">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted">Streak</p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight">{stats.streak}</p>
          </div>
        </div>
      </Panel>
    </>
  );
}
