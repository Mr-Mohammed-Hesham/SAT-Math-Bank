import React from 'react';
import { QuestionVisualData } from '../types';

interface QuestionVisualProps {
  visual?: QuestionVisualData;
  questionId: string;
}

export const QuestionVisual: React.FC<QuestionVisualProps> = ({ visual, questionId }) => {
  if (!visual) return null;

  // Module 1 Question 1: Linear graph through (-1, 1), (0, 3), (1, 5)
  if (questionId === 'M1-Q1') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-md mx-auto">
        <div className="text-xs font-semibold text-slate-400 mb-2 text-center" dir="ltr">
          Graph: y = 2x + 3
        </div>
        <svg viewBox="-80 -80 160 160" className="w-full max-w-[260px] mx-auto overflow-visible select-none">
          {/* Grid lines */}
          {[-60, -40, -20, 20, 40, 60].map((v) => (
            <React.Fragment key={v}>
              <line x1={v} y1="-70" x2={v} y2="70" stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="-70" y1={v} x2="70" y2={v} stroke="#334155" strokeWidth="0.8" strokeDasharray="2 2" />
            </React.Fragment>
          ))}
          {/* Axes */}
          <line x1="-75" y1="0" x2="75" y2="0" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="0" y1="-75" x2="0" y2="75" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="72" y="-4" fill="#94a3b8" fontSize="8" textAnchor="end">x</text>
          <text x="5" y="-68" fill="#94a3b8" fontSize="8">y</text>
          {/* Scale numbers */}
          <text x="20" y="10" fill="#64748b" fontSize="6" textAnchor="middle">2</text>
          <text x="40" y="10" fill="#64748b" fontSize="6" textAnchor="middle">4</text>
          <text x="-20" y="10" fill="#64748b" fontSize="6" textAnchor="middle">-2</text>
          <text x="-8" y="-28" fill="#64748b" fontSize="6">3</text>
          {/* Linear Line y = 2x + 3 -> scaled (scale: 10px per unit) */}
          {/* When x = -4, y = -5 (-40, 50). When x = 2.5, y = 8 (25, -80) */}
          <line x1="-40" y1="50" x2="25" y2="-80" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Highlight Points */}
          <circle cx="-10" cy="-10" r="3.5" fill="#f43f5e" />
          <text x="-14" y="-12" fill="#f43f5e" fontSize="7" textAnchor="end">(-1, 1)</text>

          <circle cx="0" cy="-30" r="3.5" fill="#f43f5e" />
          <text x="5" y="-32" fill="#f43f5e" fontSize="7">(0, 3)</text>

          <circle cx="10" cy="-50" r="3.5" fill="#f43f5e" />
          <text x="14" y="-52" fill="#f43f5e" fontSize="7">(1, 5)</text>
        </svg>
      </div>
    );
  }

  // Module 1 Question 2: Scatterplot fur seal body length
  if (questionId === 'M1-Q2') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-md mx-auto">
        <div className="text-xs font-semibold text-slate-400 mb-2 text-center" dir="ltr">
          Body Length (cm) vs. Age (years)
        </div>
        <svg viewBox="0 0 280 200" className="w-full max-w-[280px] mx-auto select-none">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5, 6].map((age) => (
            <line
              key={age}
              x1={40 + age * 35}
              y1="20"
              x2={40 + age * 35}
              y2="160"
              stroke="#334155"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
          ))}
          {[20, 40, 60, 80, 100, 120, 140].map((len) => (
            <React.Fragment key={len}>
              <line
                x1="40"
                y1={160 - (len / 140) * 140}
                x2="260"
                y2={160 - (len / 140) * 140}
                stroke="#334155"
                strokeWidth="0.8"
                strokeDasharray="2 2"
              />
              <text x="34" y={164 - (len / 140) * 140} fill="#64748b" fontSize="7" textAnchor="end">
                {len}
              </text>
            </React.Fragment>
          ))}
          {/* Axes */}
          <line x1="40" y1="160" x2="260" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="40" y1="20" x2="40" y2="160" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Axis labels */}
          <text x="150" y="190" fill="#94a3b8" fontSize="9" textAnchor="middle">Age (years)</text>
          <text x="12" y="90" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90 12,90)">Body length (cm)</text>

          {/* Age tick labels */}
          {[1, 2, 3, 4, 5, 6].map((age) => (
            <text key={age} x={40 + age * 35} y="172" fill="#64748b" fontSize="8" textAnchor="middle">
              {age}
            </text>
          ))}

          {/* Data Points */}
          <circle cx={40 + 1 * 35} cy={160 - (70 / 140) * 140} r="3" fill="#38bdf8" />
          <circle cx={40 + 2 * 35} cy={160 - (88 / 140) * 140} r="3" fill="#38bdf8" />
          <circle cx={40 + 3 * 35} cy={160 - (100 / 140) * 140} r="4" fill="#f43f5e" />
          <circle cx={40 + 4 * 35} cy={160 - (112 / 140) * 140} r="3" fill="#38bdf8" />
          <circle cx={40 + 5 * 35} cy={160 - (125 / 140) * 140} r="3" fill="#38bdf8" />

          {/* Line of best fit */}
          <line x1="60" y1="105" x2="245" y2="25" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 2" />

          {/* Prediction highlight at x = 3 */}
          <line x1={40 + 3 * 35} y1="160" x2={40 + 3 * 35} y2="60" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
          <line x1="40" y1="60" x2={40 + 3 * 35} y2="60" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" />
          <text x={40 + 3 * 35 + 8} y="55" fill="#f43f5e" fontSize="9" fontWeight="bold">y = 100 cm</text>
        </svg>
      </div>
    );
  }

  // Module 1 Question 5: Obtuse triangle perimeter 27
  if (questionId === 'M1-Q5') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-md mx-auto text-center">
        <svg viewBox="0 0 260 120" className="w-full max-w-[260px] mx-auto select-none">
          <polygon points="30,90 180,90 240,25" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2" />
          <text x="105" y="105" fill="#94a3b8" fontSize="11" fontWeight="bold">9 m</text>
          <text x="220" y="65" fill="#94a3b8" fontSize="11" fontWeight="bold">5 m</text>
          <text x="120" y="45" fill="#f43f5e" fontSize="12" fontWeight="bold">? (13 m)</text>
          <text x="130" y="20" fill="#a855f7" fontSize="10" textAnchor="middle">Perimeter = 27 m</text>
        </svg>
      </div>
    );
  }

  // Module 1 Question 14: Similar triangles DEF and RST
  if (questionId === 'M1-Q14') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-lg mx-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-300 mb-1">Triangle DEF</div>
            <svg viewBox="0 0 150 100" className="w-full max-w-[150px] mx-auto">
              <polygon points="20,80 130,80 90,20" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2" />
              <text x="12" y="85" fill="#38bdf8" fontSize="9">D (47°)</text>
              <text x="115" y="85" fill="#eab308" fontSize="9">E (97°)</text>
              <text x="90" y="15" fill="#94a3b8" fontSize="8" textAnchor="middle">F (36°)</text>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold text-slate-300 mb-1">Triangle RST</div>
            <svg viewBox="0 0 150 100" className="w-full max-w-[150px] mx-auto">
              <polygon points="15,85 140,85 95,15" fill="rgba(244, 63, 94, 0.1)" stroke="#f43f5e" strokeWidth="2" />
              <text x="8" y="90" fill="#38bdf8" fontSize="9">R (47°)</text>
              <text x="125" y="90" fill="#eab308" fontSize="9">S (97°)</text>
              <text x="95" y="10" fill="#94a3b8" fontSize="8" textAnchor="middle">T (36°)</text>
            </svg>
          </div>
        </div>
        <p className="text-xs text-center text-emerald-400 mt-2 font-medium">
          Angle-Angle (AA) Similarity Rule: 47° and 97° match in both!
        </p>
      </div>
    );
  }

  // Module 1 Question 19: Circle arc length
  if (questionId === 'M1-Q19') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-xs mx-auto text-center">
        <svg viewBox="0 0 160 160" className="w-full max-w-[160px] mx-auto select-none">
          <circle cx="80" cy="80" r="60" fill="none" stroke="#475569" strokeWidth="1.5" />
          <circle cx="80" cy="80" r="3" fill="#94a3b8" />
          <text x="75" y="92" fill="#94a3b8" fontSize="9">Q</text>
          {/* Radius to A at 0 deg (80+60, 80) = (140, 80) */}
          <line x1="80" y1="80" x2="140" y2="80" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Radius to B at -60 deg (80 + 60*cos(-60), 80 + 60*sin(-60)) = (110, 28) */}
          <line x1="80" y1="80" x2="110" y2="28" stroke="#94a3b8" strokeWidth="1.5" />
          {/* Arc highlight */}
          <path d="M 140 80 A 60 60 0 0 0 110 28" fill="none" stroke="#f43f5e" strokeWidth="3" />
          <circle cx="140" cy="80" r="3.5" fill="#f43f5e" />
          <text x="145" y="84" fill="#f43f5e" fontSize="9" fontWeight="bold">A</text>
          <circle cx="110" cy="28" r="3.5" fill="#f43f5e" />
          <text x="114" y="24" fill="#f43f5e" fontSize="9" fontWeight="bold">B</text>
          <text x="96" y="70" fill="#eab308" fontSize="9">60°</text>
          <text x="135" y="48" fill="#f43f5e" fontSize="9" fontWeight="bold">Arc = 4"</text>
        </svg>
      </div>
    );
  }

  // Module 1 Question 22: Right Triangle
  if (questionId === 'M1-Q22') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-sm mx-auto text-center">
        <svg viewBox="0 0 200 120" className="w-full max-w-[200px] mx-auto select-none">
          <polygon points="30,95 170,95 170,25" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2" />
          {/* Right angle marker at B (170, 95) */}
          <rect x="158" y="83" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
          <text x="18" y="100" fill="#38bdf8" fontSize="10" fontWeight="bold">C (30°)</text>
          <text x="175" y="105" fill="#94a3b8" fontSize="10">B</text>
          <text x="175" y="25" fill="#f43f5e" fontSize="10" fontWeight="bold">A (60°)</text>
          <text x="90" y="50" fill="#a855f7" fontSize="10">Hypotenuse = 124</text>
        </svg>
      </div>
    );
  }

  // Module 2 Question 2: Revenue vs Price Parabola
  if (questionId === 'M2-Q2') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-md mx-auto">
        <div className="text-xs font-semibold text-slate-400 mb-2 text-center" dir="ltr">
          Revenue (dollars) vs. Price (dollars)
        </div>
        <svg viewBox="0 0 260 160" className="w-full max-w-[260px] mx-auto select-none">
          <line x1="30" y1="130" x2="240" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="30" y1="20" x2="30" y2="130" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="135" y="150" fill="#94a3b8" fontSize="9" textAnchor="middle">Price ($)</text>
          <text x="12" y="75" fill="#94a3b8" fontSize="8" textAnchor="middle" transform="rotate(-90 12,75)">Revenue ($)</text>
          {/* Parabola */}
          <path d="M 30 130 Q 100 20 170 130" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
          {/* Vertex point */}
          <circle cx="100" cy="75" r="4" fill="#f43f5e" />
          <text x="108" y="72" fill="#f43f5e" fontSize="9" fontWeight="bold">Vertex (Max Revenue)</text>
        </svg>
      </div>
    );
  }

  // Module 2 Question 9: Parallel line triangle STU / SWV
  if (questionId === 'M2-Q9') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-md mx-auto text-center">
        <svg viewBox="0 0 280 140" className="w-full max-w-[280px] mx-auto select-none">
          {/* Big triangle SWV */}
          <polygon points="50,20 20,120 260,120" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="2" />
          {/* Parallel segment TU */}
          <line x1="32" y1="80" x2="176" y2="80" stroke="#eab308" strokeWidth="2" />
          {/* Labels */}
          <text x="50" y="15" fill="#94a3b8" fontSize="9" textAnchor="middle">S</text>
          <text x="18" y="78" fill="#eab308" fontSize="9" fontWeight="bold">T</text>
          <text x="180" y="78" fill="#eab308" fontSize="9" fontWeight="bold">U</text>
          <text x="10" y="130" fill="#94a3b8" fontSize="9">W</text>
          <text x="265" y="125" fill="#94a3b8" fontSize="9">V (26°)</text>

          {/* Angles */}
          <text x="40" y="70" fill="#f43f5e" fontSize="8">74°</text>
          <text x="145" y="98" fill="#f43f5e" fontSize="8" fontWeight="bold">p = 154°</text>
          <text x="25" y="112" fill="#38bdf8" fontSize="8">r = 74°</text>
        </svg>
      </div>
    );
  }

  // Module 2 Question 11: Inequality y > -8
  if (questionId === 'M2-Q11') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-xs mx-auto text-center">
        <div className="text-xs font-semibold text-slate-400 mb-2" dir="ltr">
          Graph of ry &lt; 128 (y &gt; -8)
        </div>
        <svg viewBox="-50 -50 100 100" className="w-full max-w-[180px] mx-auto select-none">
          {/* Shaded region y > -8 */}
          <rect x="-45" y="-45" width="90" height="65" fill="rgba(56, 189, 248, 0.2)" />
          {/* Axes */}
          <line x1="-45" y1="0" x2="45" y2="0" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="-45" x2="0" y2="45" stroke="#94a3b8" strokeWidth="1" />
          {/* Boundary line at y = -8 (y = 20 scaled) */}
          <line x1="-45" y1="20" x2="45" y2="20" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3" />
          <text x="4" y="26" fill="#f43f5e" fontSize="7" fontWeight="bold">y = -8</text>
          <text x="-35" y="-10" fill="#38bdf8" fontSize="8">Shaded Region</text>
        </svg>
      </div>
    );
  }

  // Module 2 Question 15: Standard form line 5x - 3y = 15
  if (questionId === 'M2-Q15') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-xs mx-auto text-center">
        <div className="text-xs font-semibold text-slate-400 mb-2" dir="ltr">
          x-intercept: (3, 0) | y-intercept: (0, -5)
        </div>
        <svg viewBox="-40 -40 80 80" className="w-full max-w-[180px] mx-auto select-none">
          <line x1="-35" y1="0" x2="35" y2="0" stroke="#94a3b8" strokeWidth="1" />
          <line x1="0" y1="-35" x2="0" y2="35" stroke="#94a3b8" strokeWidth="1" />
          {/* Line passing through (15, 0) and (0, 25) */}
          <line x1="-15" y1="-25" x2="30" y2="25" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="15" cy="0" r="3" fill="#f43f5e" />
          <text x="18" y="-4" fill="#f43f5e" fontSize="6">(3, 0)</text>
          <circle cx="0" cy="25" r="3" fill="#f43f5e" />
          <text x="4" y="28" fill="#f43f5e" fontSize="6">(0, -5)</text>
        </svg>
      </div>
    );
  }

  // Module 2 Question 4: Circle Area
  if (questionId === 'M2-Q4') {
    return (
      <div className="my-4 p-4 rounded-xl bg-slate-950/70 border border-slate-700/60 max-w-xs mx-auto text-center">
        <svg viewBox="0 0 140 140" className="w-full max-w-[140px] mx-auto select-none">
          <circle cx="70" cy="70" r="50" fill="rgba(56, 189, 248, 0.1)" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="70" cy="70" r="3" fill="#94a3b8" />
          <line x1="70" y1="70" x2="120" y2="70" stroke="#f43f5e" strokeWidth="2" />
          <text x="95" y="64" fill="#f43f5e" fontSize="9" fontWeight="bold">r = 19 m</text>
          <text x="70" y="95" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">Area = 361π</text>
        </svg>
      </div>
    );
  }

  // General Table Visual
  if (visual.type === 'table' && visual.data) {
    return (
      <div className="my-4 overflow-x-auto max-w-xs mx-auto">
        <table className="w-full text-center border-collapse text-sm rounded-lg overflow-hidden border border-slate-700">
          <thead>
            <tr className="bg-slate-800 text-slate-200">
              {visual.data.headers.map((h: string, i: number) => (
                <th key={i} className="py-2 px-3 border border-slate-700 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visual.data.rows.map((row: string[], ri: number) => (
              <tr key={ri} className="bg-slate-900/80 hover:bg-slate-800/60">
                {row.map((cell: string, ci: number) => (
                  <td key={ci} className="py-1.5 px-3 border border-slate-800 text-slate-300 font-mono">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
};
