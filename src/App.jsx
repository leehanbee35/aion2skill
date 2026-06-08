import { useState } from "react";
import {
  CLASS_SKILLS,
  CLASSES,
  TARGET_OPTIONS,
  TARGET_OPTIONS_30,
  SKILLS_WITH_30,
  DAEVANIAN_VALUES,
  DAEVANIAN_DEFAULT,
  EQUIPMENT_VALUES,
  EQUIPMENT_VALUES_LIMITED,
  ARCANA_CARD_VALUES,
  ARCANA_CARD_COUNT,
  ARCANA_CARD_NAMES,
  ARCANA_CARD_SKILLS,
} from "./data/skills";
import Select from "./components/Select";
import "./App.css";

const DIRECT_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

function createClassState(className) {
  return Object.fromEntries(
    CLASS_SKILLS[className].map((skill) => [
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

function loadAllState() {
  return Object.fromEntries(
    CLASSES.map((cls) => {
      try {
        const saved = localStorage.getItem(`aion2-skills-${cls}`);
        if (!saved) return [cls, createClassState(cls)];
        const parsed = JSON.parse(saved);
        const defaults = createClassState(cls);
        return [cls, Object.fromEntries(
          CLASS_SKILLS[cls].map((skill) => [skill, { ...defaults[skill], ...parsed[skill] }])
        )];
      } catch {
        return [cls, createClassState(cls)];
      }
    })
  );
}

function getTotal(s) {
  return s.direct + s.daevanian + s.equipment + s.arcana.reduce((a, b) => a + b, 0);
}

export default function App() {
  const [activeClass, setActiveClass] = useState(() => {
    const saved = localStorage.getItem("aion2-active-class");
    return CLASSES.includes(saved) ? saved : CLASSES[0];
  });
  const [allSkills, setAllSkills] = useState(loadAllState);

  const skills = allSkills[activeClass];

  function update(skill, field, value) {
    setAllSkills((prev) => {
      const next = {
        ...prev,
        [activeClass]: {
          ...prev[activeClass],
          [skill]: { ...prev[activeClass][skill], [field]: value }
        }
      };
      localStorage.setItem(`aion2-skills-${activeClass}`, JSON.stringify(next[activeClass]));
      return next;
    });
  }

  function updateArcana(skill, index, value) {
    setAllSkills((prev) => {
      const newArcana = [...prev[activeClass][skill].arcana];
      newArcana[index] = value;
      const next = {
        ...prev,
        [activeClass]: {
          ...prev[activeClass],
          [skill]: { ...prev[activeClass][skill], arcana: newArcana }
        }
      };
      localStorage.setItem(`aion2-skills-${activeClass}`, JSON.stringify(next[activeClass]));
      return next;
    });
  }

  const cardSkills = ARCANA_CARD_SKILLS[activeClass];
  const skillsWith30 = SKILLS_WITH_30[activeClass] || [];

  return (
    <div className="app">
      <header className="app-header">
        <h1>스킬 계산기</h1>
        <div className="tabs">
          {CLASSES.map((cls) => (
            <button
              key={cls}
              className={`tab ${activeClass === cls ? "tab--active" : ""}`}
              onClick={() => { setActiveClass(cls); localStorage.setItem("aion2-active-class", cls); }}
            >
              {cls}
            </button>
          ))}
        </div>
        <span className="header-credit">[시엘] 오리 레기온 제작</span>
      </header>

      <div className="table-scroll">
        <table className="skill-table">
          <thead>
            <tr>
              <th className="th-skill">스킬</th>
              <th className="th-status">상태</th>
              <th>목표 ⭐</th>
              <th className="group-start"><span className="th-inner">스킬포인트 <small>0~10</small></span></th>
              <th className="group-start"><span className="th-inner">데바니온 <small>0~4</small></span></th>
              <th className="group-start"><span className="th-inner">장비 <small>0~10</small></span></th>
              {ARCANA_CARD_NAMES.map((name, i) => (
                <th key={i} className={i === 0 ? "group-start" : ""}><span className="th-inner">{name} <small>0~4</small></span></th>
              ))}
              <th className="group-start col-summary">합계</th>
            </tr>
          </thead>
          <tbody>
            {CLASS_SKILLS[activeClass].map((skill) => {
              const s = skills[skill];
              const total = getTotal(s);
              const diff = total - s.target;
              const reached = diff >= 0;
              const inactive = s.target === 0;

              return (
                <tr key={skill} className={inactive ? "row-disabled" : reached ? "row-ok" : "row-lack"}>
                  <td className="td-skill" style={{fontFamily: "'Jua', sans-serif", fontSize: '15px', letterSpacing: '0.3px'}}>{skill}</td>

                  <td className="col-summary">
                    {s.target === 0 ? null : reached ? (
                      <span className="badge badge-ok">✓ 달성{diff > 0 ? ` +${diff}` : ""}</span>
                    ) : (
                      <span className="badge badge-lack">{diff} 부족</span>
                    )}
                  </td>

                  <td>
                    <Select
                      value={s.target}
                      options={skillsWith30.includes(skill) ? TARGET_OPTIONS_30 : TARGET_OPTIONS}
                      onChange={(v) => update(skill, "target", v)}
                    />
                  </td>

                  <td className="group-start">
                    <Select value={s.direct} options={DIRECT_OPTIONS} onChange={(v) => update(skill, "direct", v)} />
                  </td>

                  <td className="group-start">
                    <Select value={s.daevanian} options={DAEVANIAN_VALUES} onChange={(v) => update(skill, "daevanian", v)} />
                  </td>

                  <td className="group-start">
                    <Select value={s.equipment} options={skillsWith30.includes(skill) ? EQUIPMENT_VALUES : EQUIPMENT_VALUES_LIMITED} onChange={(v) => update(skill, "equipment", v)} />
                  </td>

                  {s.arcana.map((val, idx) => {
                    const cardName = ARCANA_CARD_NAMES[idx];
                    const allowed = cardSkills[cardName];
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
