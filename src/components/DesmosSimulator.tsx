import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Calculator,
  Layers,
  CheckCircle2,
  Move,
} from 'lucide-react';

interface DesmosSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PlotFunction {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
  label?: string;
}

const COLOR_PALETTE = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#06b6d4'];

export const DesmosSimulator: React.FC<DesmosSimulatorProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'graph' | 'scientific' | 'official'>('graph');
  
  // Graphing State
  const [functions, setFunctions] = useState<PlotFunction[]>([
    { id: '1', expr: '2*x + 3', color: '#38bdf8', visible: true, label: 'y = 2x + 3' },
    { id: '2', expr: '-(x - 4)^2 + 8', color: '#f43f5e', visible: true, label: 'y = -(x - 4)² + 8' },
  ]);
  const [newExpr, setNewExpr] = useState('');
  
  // Canvas coordinate space
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 300, y: 250 });
  const [scale, setScale] = useState<number>(35); // pixels per math unit
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ mathX: number; mathY: number } | null>(null);

  // Scientific calculator state
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState<string | null>(null);
  const [calcHistory, setCalcHistory] = useState<{ expr: string; res: string }[]>([
    { expr: '(186.32 / (2.528 * 170)) * 100', res: '43.354' },
    { expr: '-4 + 2 * sqrt(11)', res: '2.6332' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Safe expression evaluator for graphing y = f(x)
  const evaluateMath = useCallback((exprStr: string, xVal: number): number | null => {
    try {
      let parsed = exprStr
        .replace(/(\d)x/gi, '$1*x')
        .replace(/x/gi, `(${xVal})`)
        .replace(/\^/g, '**')
        .replace(/sqrt/gi, 'Math.sqrt')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/abs/gi, 'Math.abs')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E');

      // sanitize characters
      if (/[^0-9+\-*/().MathsqrtsincostanabsPIE\s]/.test(parsed)) {
        return null;
      }

      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${parsed})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return result;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Draw Cartesian Grid & Plotted Functions
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#090d16'; // Deep slate background
    ctx.fillRect(0, 0, width, height);

    const ox = origin.x;
    const oy = origin.y;

    // Draw Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b'; // subtle grid
    ctx.fillStyle = '#64748b'; // label color
    ctx.font = '10px Cairo, monospace';

    // Step size based on scale
    let unitStep = 1;
    if (scale < 15) unitStep = 5;
    if (scale < 6) unitStep = 10;
    if (scale > 80) unitStep = 0.5;

    const stepPixels = unitStep * scale;

    // Vertical grid lines (X axis ticks)
    const startX = (ox % stepPixels) - stepPixels;
    for (let x = startX; x < width + stepPixels; x += stepPixels) {
      ctx.beginPath();
      ctx.strokeStyle = Math.abs(x - ox) < 1 ? '#475569' : '#1e293b';
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      const mathX = Math.round(((x - ox) / scale) * 10) / 10;
      if (Math.abs(mathX) > 0.001) {
        ctx.fillText(mathX.toString(), x - 6, Math.min(Math.max(oy + 14, 15), height - 5));
      }
    }

    // Horizontal grid lines (Y axis ticks)
    const startY = (oy % stepPixels) - stepPixels;
    for (let y = startY; y < height + stepPixels; y += stepPixels) {
      ctx.beginPath();
      ctx.strokeStyle = Math.abs(y - oy) < 1 ? '#475569' : '#1e293b';
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      const mathY = Math.round(((oy - y) / scale) * 10) / 10;
      if (Math.abs(mathY) > 0.001) {
        ctx.fillText(mathY.toString(), Math.min(Math.max(ox + 5, 5), width - 25), y + 4);
      }
    }

    // Main Axes (X & Y)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#94a3b8'; // clear bold axes

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(width, oy);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, height);
    ctx.stroke();

    // Origin 0 indicator
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('0', ox + 4, oy + 12);

    // Plot each active function
    functions.forEach((fn) => {
      if (!fn.visible || !fn.expr.trim()) return;

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = fn.color;
      ctx.beginPath();

      let isFirst = true;

      for (let px = 0; px <= width; px += 2) {
        const mathX = (px - ox) / scale;
        const mathY = evaluateMath(fn.expr, mathX);

        if (mathY !== null) {
          const py = oy - mathY * scale;

          // Prevent rendering glitches when y approaches infinity
          if (py >= -500 && py <= height + 500) {
            if (isFirst) {
              ctx.moveTo(px, py);
              isFirst = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            isFirst = true;
          }
        } else {
          isFirst = true;
        }
      }
      ctx.stroke();
    });

    // Draw hover coordinate indicator
    if (hoverCoord) {
      const hpx = ox + hoverCoord.mathX * scale;
      const hpy = oy - hoverCoord.mathY * scale;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hpx, hpy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Tooltip box
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      const text = `(${hoverCoord.mathX.toFixed(2)}, ${hoverCoord.mathY.toFixed(2)})`;
      const textWidth = ctx.measureText(text).width + 12;
      ctx.fillRect(hpx + 8, hpy - 22, textWidth, 20);
      ctx.strokeRect(hpx + 8, hpy - 22, textWidth, 20);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 11px Cairo, monospace';
      ctx.fillText(text, hpx + 14, hpy - 8);
    }
  }, [origin, scale, functions, hoverCoord, evaluateMath]);

  // Redraw when graph parameters change
  useEffect(() => {
    if (isOpen && activeTab === 'graph') {
      drawGraph();
    }
  }, [drawGraph, isOpen, activeTab]);

  // Handle Resize of Canvas & initialization without loop
  useEffect(() => {
    if (!isOpen || activeTab !== 'graph') return;

    const initCanvas = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const w = parent.clientWidth || 600;
        const h = parent.clientHeight || 450;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        setOrigin({ x: w / 2, y: h / 2 });
      }
    };

    // Initial timeout to ensure modal layout is rendered in DOM
    const timer = setTimeout(initCanvas, 50);
    window.addEventListener('resize', initCanvas);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initCanvas);
    };
  }, [isOpen, activeTab]);

  // Mouse drag to pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const mathX = (mouseX - origin.x) / scale;
    const mathY = (origin.y - mouseY) / scale;
    setHoverCoord({ mathX, mathY });

    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setOrigin((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setScale((prev) => Math.max(5, Math.min(250, prev * zoomFactor)));
  };

  // Preset SAT math functions
  const satPresets = [
    { label: 'دالة خطية: y = 2x + 3', expr: '2*x + 3' },
    { label: 'قطع مكافئ (Parabola): y = -(x-3)^2 + 9', expr: '-(x-3)^2 + 9' },
    { label: 'جذور دالة تربيعية: y = x^2 - 4x - 5', expr: 'x^2 - 4*x - 5' },
    { label: 'دالة أسية: y = 2 * (1.5)^x', expr: '2 * (1.5)^x' },
    { label: 'دالة مقلوب: y = 1 / x', expr: '1 / x' },
    { label: 'دالة جذرية: y = sqrt(x + 4)', expr: 'sqrt(x + 4)' },
    { label: 'دالة القيمة المطلقة: y = abs(x - 2) - 3', expr: 'abs(x - 2) - 3' },
  ];

  const handleAddFunction = (exprToAdd?: string) => {
    const toAdd = exprToAdd || newExpr;
    if (!toAdd.trim()) return;
    const newId = Date.now().toString();
    const color = COLOR_PALETTE[functions.length % COLOR_PALETTE.length];
    setFunctions((prev) => [
      ...prev,
      {
        id: newId,
        expr: toAdd.trim(),
        color,
        visible: true,
        label: `y = ${toAdd.trim()}`,
      },
    ]);
    setNewExpr('');
  };

  const handleRemoveFunction = (id: string) => {
    setFunctions((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggleFunction = (id: string) => {
    setFunctions((prev) =>
      prev.map((f) => (f.id === id ? { ...f, visible: !f.visible } : f))
    );
  };

  // Scientific Calculator Calculation
  const evaluateScientific = (exprStr: string) => {
    try {
      const clean = exprStr
        .replace(/\^/g, '**')
        .replace(/sqrt/gi, 'Math.sqrt')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/abs/gi, 'Math.abs')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E');

      // eslint-disable-next-line no-new-func
      const fn = new Function(`return (${clean})`);
      const res = fn();
      const rounded = Number.isInteger(res) ? res.toString() : Number(res).toFixed(4).replace(/\.?0+$/, '');
      setCalcResult(rounded);
      setCalcHistory((prev) => [{ expr: exprStr, res: rounded }, ...prev.slice(0, 5)]);
    } catch {
      setCalcResult('Error (خطأ في الصيغة)');
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult(null);
    } else if (val === '=') {
      evaluateScientific(calcInput);
    } else if (val === 'BACK') {
      setCalcInput((prev) => prev.slice(0, -1));
    } else {
      setCalcInput((prev) => prev + val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/90 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-emerald-600/30">
              fx
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  حاسبة ورسام ديسموس الرقمي (Desmos Grapher & Calculator)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50">
                  DSAT Approved
                </span>
              </div>
              <p className="text-xs text-slate-400">
                رسم بياني تفاعلي حي، حل المعادلات وأنظمة التقاطع، وإجراء العمليات الحسابية
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'graph'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الرسام البياني (Grapher)
            </button>
            <button
              onClick={() => setActiveTab('scientific')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'scientific'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              الآلة العلمية (Scientific)
            </button>
            <button
              onClick={() => setActiveTab('official')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'official'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ديسموس الكامل (Full Desmos)
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Interactive Grapher */}
        {activeTab === 'graph' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Functions List */}
            <div className="w-full md:w-80 bg-slate-950/70 border-b md:border-b-0 md:border-l border-slate-800 p-4 flex flex-col gap-3.5 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  قائمة الدوال والمعادلات (y = f(x)):
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {functions.filter((f) => f.visible).length} active
                </span>
              </div>

              {/* Input for new function */}
              <div className="flex gap-1.5" dir="ltr">
                <input
                  type="text"
                  value={newExpr}
                  onChange={(e) => setNewExpr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFunction()}
                  placeholder="e.g. -x^2 + 6*x"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => handleAddFunction()}
                  className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-indigo-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة</span>
                </button>
              </div>

              {/* Function Items List */}
              <div className="space-y-2 flex-1">
                {functions.map((fn) => (
                  <div
                    key={fn.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => handleToggleFunction(fn.id)}
                      className="w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center shrink-0"
                      style={{
                        borderColor: fn.color,
                        backgroundColor: fn.visible ? fn.color : 'transparent',
                      }}
                      title={fn.visible ? 'إخفاء الدالة' : 'إظهار الدالة'}
                    />
                    <div className="flex-1 font-mono text-xs text-slate-200 truncate" dir="ltr">
                      <span className="text-slate-400">y = </span>
                      <strong style={{ color: fn.color }}>{fn.expr}</strong>
                    </div>
                    <button
                      onClick={() => handleRemoveFunction(fn.id)}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="حذف المعادلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* SAT Presets */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  نماذج دوال ومسائل السات الشائعة:
                </label>
                <div className="flex flex-col gap-1">
                  {satPresets.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAddFunction(p.expr)}
                      className="text-right px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-indigo-950/60 border border-slate-800 text-[11px] text-slate-300 transition-colors flex items-center justify-between"
                    >
                      <span className="font-mono text-indigo-300" dir="ltr">{p.expr}</span>
                      <span className="text-[10px] text-slate-400 mr-2">{p.label.split(':')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Interactive Canvas Area */}
            <div className="flex-1 relative bg-slate-950 flex flex-col">
              {/* Canvas viewport */}
              <div className="flex-1 relative cursor-crosshair overflow-hidden">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onWheel={handleWheel}
                  className="w-full h-full block"
                />

                {/* Floating On-Canvas Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md shadow-xl z-10">
                  <button
                    onClick={() => setScale((prev) => Math.min(250, prev * 1.25))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="تكبير (Zoom In)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setScale((prev) => Math.max(5, prev * 0.8))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="تصغير (Zoom Out)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (canvasRef.current) {
                        setOrigin({
                          x: canvasRef.current.width / 2,
                          y: canvasRef.current.height / 2,
                        });
                        setScale(35);
                      }
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                    title="إعادة ضبط المركز (Reset View)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Hint Bar at bottom of canvas */}
                <div className="absolute bottom-3 left-4 right-4 bg-slate-900/80 border border-slate-800/80 px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center justify-between text-[11px] text-slate-400 pointer-events-none">
                  <div className="flex items-center gap-2">
                    <Move className="w-3.5 h-3.5 text-indigo-400" />
                    <span>انقر واسحب لتحريك المستوى الإحداثي | استخدم عجلة الفأرة للتكبير والتصغير</span>
                  </div>
                  {hoverCoord && (
                    <div className="font-mono text-indigo-300 font-bold" dir="ltr">
                      X: {hoverCoord.mathX.toFixed(2)} | Y: {hoverCoord.mathY.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Scientific Keypad Calculator */}
        {activeTab === 'scientific' && (
          <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
            <div className="flex-1 space-y-4">
              {/* Display Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-right text-xs text-slate-400 font-mono">الصيغة الحسابية:</div>
                <input
                  type="text"
                  value={calcInput}
                  onChange={(e) => setCalcInput(e.target.value)}
                  placeholder="0"
                  className="w-full text-2xl sm:text-3xl font-mono font-bold bg-transparent text-white focus:outline-none text-left"
                  dir="ltr"
                />
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-xs text-slate-500">النتيجة:</span>
                  <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400" dir="ltr">
                    {calcResult !== null ? `= ${calcResult}` : '—'}
                  </span>
                </div>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-5 gap-2" dir="ltr">
                {['sin(', 'cos(', 'tan(', 'sqrt(', 'abs('].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs font-semibold transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['pi', '^2', '^', '(', ')'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k === '^2' ? '^2' : k)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs font-semibold transition-colors"
                  >
                    {k}
                  </button>
                ))}
                {['7', '8', '9', '/', 'C'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className={`p-3 rounded-xl font-mono text-sm font-bold transition-colors ${
                      k === 'C'
                        ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200'
                        : isNaN(Number(k))
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
                    }`}
                  >
                    {k}
                  </button>
                ))}
                {['4', '5', '6', '*', 'BACK'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className={`p-3 rounded-xl font-mono text-sm font-bold transition-colors ${
                      k === 'BACK'
                        ? 'bg-amber-900/60 hover:bg-amber-800 text-amber-200 text-xs'
                        : isNaN(Number(k))
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
                    }`}
                  >
                    {k === 'BACK' ? 'DEL' : k}
                  </button>
                ))}
                {['1', '2', '3', '-', '='].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className={`p-3 rounded-xl font-mono text-sm font-bold transition-colors ${
                      k === '='
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white row-span-2'
                        : isNaN(Number(k))
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
                    }`}
                  >
                    {k}
                  </button>
                ))}
                {['0', '.', '+', '%'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k === '%' ? '/100' : k)}
                    className={`p-3 rounded-xl font-mono text-sm font-bold transition-colors ${
                      isNaN(Number(k)) && k !== '.'
                        ? 'bg-slate-800 text-indigo-300'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>

            {/* Calculations History & Shortcuts */}
            <div className="w-full md:w-80 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  سجل العمليات الحسابية:
                </h4>
                <div className="space-y-2">
                  {calcHistory.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCalcInput(item.expr);
                        setCalcResult(item.res);
                      }}
                      className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/40 border border-slate-800/80 text-left transition-colors font-mono text-xs block"
                      dir="ltr"
                    >
                      <div className="text-slate-400 truncate">{item.expr}</div>
                      <div className="text-emerald-400 font-bold text-sm mt-0.5">= {item.res}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Official Desmos Interactive Web Grapher */}
        {activeTab === 'official' && (
          <div className="flex-1 relative bg-slate-950 flex flex-col">
            <iframe
              src="https://www.desmos.com/calculator"
              title="Official Desmos Calculator"
              className="w-full flex-1 border-0"
              allow="clipboard-write"
            />
          </div>
        )}

        {/* Modal Footer with Signature */}
        <div className="px-6 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Digital SAT Math Preparation Engine &bull; إشراف <strong>Mr. Mohammed Hesham</strong></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
