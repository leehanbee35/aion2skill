import { useState } from "react";
import {
  CLASS_SKILLS,
  TARGET_OPTIONS,
  DAEVANIAN_VALUES,
  DAEVANIAN_DEFAULT,
  EQUIPMENT_VALUES,
  ARCANA_CARD_VALUES,
  ARCANA_CARD_COUNT,
  ARCANA_CARD_NAMES,
  ARCANA_CARD_SKILLS,
} from "./data/skills";
import Select from "./components/Select";
import "./App.css";

const CLASS = "호법성";
const SKILLS = CLASS_SKILLS[CLASS];
const STORAGE_KEY = "aion2-skills-호법성";

function createInitialState() {
  return Object.fromEntries(
    SKILLS.map((skill) => [
      skill,
      {
        target: 0,
        direct: 5,
        daevanian: DAEVANIAN_DEFAULT,
        equipment: 0,
        arcana: Array(ARCANA_CARD_COUNT).fill(0),
      },
    ])
  );
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return createInitialState();
    const parsed = JSON.parse(saved);
    const defaults = createInitialState();
    return Object.fromEntries(
      SKILLS.map((skill) => [skill, { ...defaults[skill], ...parsed[skill] }])
    );
  } catch {
    return createInitialState();
  }
}

function getTotal(s) {
  return s.direct + s.daevanian + s.equipment + s.arcana.reduce((a, b) => a + b, 0);
}

const DIRECT_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

export default function App() {
  const [skills, setSkills] = useState(loadState);

  function update(skill, field, value) {
    setSkills((prev) => {
      const next = { ...prev, [skill]: { ...prev[skill], [field]: value } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  function updateArcana(skill, index, value) {
    setSkills((prev) => {
      const newArcana = [...prev[skill].arcana];
      newArcana[index] = value;
      const next = { ...prev, [skill]: { ...prev[skill], arcana: newArcana } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>스킬 최적화</h1>
        <span className="class-badge">{CLASS}</span>
      </header>

      <div className="table-scroll">
        <table className="skill-table">
          <thead>
            <tr>
              <th className="th-skill">스킬</th>
              <th>목표 ⭐</th>
              <th className="group-start"><span className="th-inner">스킬포인트 <small>0~10</small></span></th>
              <th className="group-start"><span className="th-inner">데바니온 <small>0~4</small></span></th>
              <th className="group-start"><span className="th-inner">장비 <small>0~10</small></span></th>
              {ARCANA_CARD_NAMES.map((name, i) => (
                <th key={i} className={i === 0 ? "group-start" : ""}><span className="th-inner">{name} <small>0~4</small></span></th>
              ))}
              <th className="group-start col-summary">합계</th>
              <th className="col-summary">상태</th>
            </tr>
          </thead>
          <tbody>
            {SKILLS.map((skill) => {
              const s = skills[skill];
              const total = getTotal(s);
              const diff = total - s.target;
              const reached = diff >= 0;
              const inactive = s.target === 0;

              return (
                <tr key={skill} className={inactive ? "row-disabled" : reached ? "row-ok" : "row-lack"}>
                  <td className="td-skill">{skill}</td>

                  <td>
                    <Select value={s.target} options={TARGET_OPTIONS} onChange={(v) => update(skill, "target", v)} />
                  </td>

                  <td className="group-start">
                    <Select value={s.direct} options={DIRECT_OPTIONS} onChange={(v) => update(skill, "direct", v)} />
                  </td>

                  <td className="group-start">
                    <Select value={s.daevanian} options={DAEVANIAN_VALUES} onChange={(v) => update(skill, "daevanian", v)} />
                  </td>

                  <td className="group-start">
                    <Select value={s.equipment} options={EQUIPMENT_VALUES} onChange={(v) => update(skill, "equipment", v)} />
                  </td>

                  {s.arcana.map((val, idx) => {
                    const cardName = ARCANA_CARD_NAMES[idx];
                    const allowed = ARCANA_CARD_SKILLS[cardName];
                    const canUse = allowed === null || allowed.includes(skill);
                    return (
                      <td key={idx} className={idx === 0 ? "group-start" : ""}>
                        {canUse && (
                          <Select value={val} options={ARCANA_CARD_VALUES} onChange={(v) => updateArcana(skill, idx, v)} />
                        )}
                      </td>
                    );
                  })}

                  <td className={`group-start col-summary total-val ${inactive ? "" : reached ? "total-ok" : "total-lack"}`}>
                    <strong>{total}</strong>
                  </td>

                  <td className="col-summary">
                    {s.target === 0 ? null : reached ? (
                      <span className="badge badge-ok">✓ 달성{diff > 0 ? ` +${diff}` : ""}</span>
                    ) : (
                      <span className="badge badge-lack">{diff} 부족</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
