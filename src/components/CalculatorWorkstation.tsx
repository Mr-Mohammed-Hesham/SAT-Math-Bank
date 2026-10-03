import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  Calculator,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2,
  Plus,
  ZoomIn,
  ZoomOut,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Cpu,
  Activity,
} from 'lucide-react';

interface PlotFunction {
  id: string;
  expr: string;
  color: string;
  visible: boolean;
  label?: string;
}

const COLOR_PALETTE = ['#38bdf8', '#f43f5e', '#10b981', '#fbbf24', '#a855f7', '#06b6d4'];

interface CalculatorWorkstationProps {
  onBackToHome: () => void;
}

export const CalculatorWorkstation: React.FC<CalculatorWorkstationProps> = ({ onBackToHome }) => {
  const { language, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'graph' | 'scientific' | 'official' | 'cheatsheet'>('graph');

  // Graphing state
  const [functions, setFunctions] = useState<PlotFunction[]>([
    { id: '1', expr: '2*x + 3', color: '#38bdf8', visible: true, label: 'y = 2x + 3' },
    { id: '2', expr: '-(x - 4)^2 + 8', color: '#f43f5e', visible: true, label: 'y = -(x - 4)² + 8' },
  ]);
  const [newExpr, setNewExpr] = useState('');
  const [origin, setOrigin] = useState<{ x: number; y: number }>({ x: 350, y: 250 });
  const [scale, setScale] = useState<number>(35);
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

      if (/[^0-9+\-*/().MathsqrtsincostanabsPIE\s]/.test(parsed)) return null;
      // eslint-disable-next-line no-new-func
      const result = new Function(`return (${parsed})`)();
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) return result;
      return null;
    } catch {
      return null;
    }
  }, []);

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const ox = origin.x;
    const oy = origin.y;

    // Subgrid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    const step = scale;

    ctx.beginPath();
    for (let x = ox % step; x < width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = oy % step; y < height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Main Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, oy);
    ctx.lineTo(width, oy);
    ctx.moveTo(ox, 0);
    ctx.lineTo(ox, height);
    ctx.stroke();

    // Axis Labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px Cairo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let x = ox + step; x < width; x += step) {
      const val = Math.round((x - ox) / scale);
      if (val !== 0) ctx.fillText(val.toString(), x, oy + 4);
    }
    for (let x = ox - step; x > 0; x -= step) {
      const val = Math.round((x - ox) / scale);
      if (val !== 0) ctx.fillText(val.toString(), x, oy + 4);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = oy + step; y < height; y += step) {
      const val = Math.round((oy - y) / scale);
      if (val !== 0) ctx.fillText(val.toString(), ox - 4, y);
    }
    for (let y = oy - step; y > 0; y -= step) {
      const val = Math.round((oy - y) / scale);
      if (val !== 0) ctx.fillText(val.toString(), ox - 4, y);
    }

    // Plot Functions
    functions.forEach((fn) => {
      if (!fn.visible) return;
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      let isFirst = true;
      for (let px = 0; px <= width; px += 2) {
        const mathX = (px - ox) / scale;
        const mathY = evaluateMath(fn.expr, mathX);
        if (mathY !== null && isFinite(mathY)) {
          const py = oy - mathY * scale;
          if (py >= -100 && py <= height + 100) {
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

    // Hover Coordinate Indicator
    if (hoverCoord) {
      const hpx = ox + hoverCoord.mathX * scale;
      const hpy = oy - hoverCoord.mathY * scale;

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(hpx, hpy, 4, 0, Math.PI * 2);
      ctx.fill();

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

  useEffect(() => {
    if (activeTab === 'graph') drawGraph();
  }, [drawGraph, activeTab]);

  useEffect(() => {
    if (activeTab !== 'graph') return;
    const initCanvas = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const parent = canvasRef.current.parentElement;
        const w = parent.clientWidth || 700;
        const h = parent.clientHeight || 500;
        canvasRef.current.width = w;
        canvasRef.current.height = h;
        setOrigin({ x: w / 2, y: h / 2 });
      }
    };
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [activeTab]);

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

  const satPresets = [
    { label: 'دالة خطية: y = 2x + 3', expr: '2*x + 3' },
    { label: 'قطع مكافئ (Parabola): y = -(x-3)^2 + 9', expr: '-(x-3)^2 + 9' },
    { label: 'جذور دالة تربيعية: y = x^2 - 4x - 5', expr: 'x^2 - 4*x - 5' },
    { label: 'دالة أسية: y = 2 * (1.5)^x', expr: '2 * (1.5)^x' },
    { label: 'دالة مقلوب: y = 1 / x', expr: '1 / x' },
    { label: 'دالة جذرية: y = sqrt(x + 4)', expr: 'sqrt(x + 4)' },
  ];

  const handleAddFunction = (exprToAdd?: string) => {
    const toAdd = exprToAdd || newExpr;
    if (!toAdd.trim()) return;
    const newId = Date.now().toString();
    const color = COLOR_PALETTE[functions.length % COLOR_PALETTE.length];
    setFunctions((prev) => [
      ...prev,
      { id: newId, expr: toAdd.trim(), color, visible: true, label: `y = ${toAdd.trim()}` },
    ]);
    if (!exprToAdd) setNewExpr('');
  };

  const evaluateScientific = (input: string) => {
    try {
      let parsed = input
        .replace(/\^/g, '**')
        .replace(/sqrt/gi, 'Math.sqrt')
        .replace(/sin/gi, 'Math.sin')
        .replace(/cos/gi, 'Math.cos')
        .replace(/tan/gi, 'Math.tan')
        .replace(/pi/gi, 'Math.PI')
        .replace(/e/gi, 'Math.E');

      // eslint-disable-next-line no-new-func
      const res = new Function(`return (${parsed})`)();
      if (typeof res === 'number') {
        const rounded = Number(res.toFixed(5)).toString();
        setCalcResult(rounded);
        setCalcHistory((prev) => [{ expr: input, res: rounded }, ...prev.slice(0, 9)]);
      }
    } catch {
      setCalcResult('Error');
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

  const BackIcon = isRTL ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 active:scale-95"
          >
            <BackIcon className="w-4 h-4 text-amber-400" />
            <span>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {language === 'ar' ? 'الآلة الحاسبة ورسام Desmos المتطور' : 'Desmos Graphing & Scientific Suite'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-700/60 font-mono">
                Official Digital SAT Tool
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'ar'
                ? 'محطة العمل الكاملة لرسم المنحنيات، حل الأنظمة الخطية، والحسابات العلمية المتقدمة'
                : 'Interactive workspace for plotting functions, solving systems, and scientific calculations'}
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'graph' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'الرسام التفاعلي' : 'Interactive Grapher'}
          </button>
          <button
            onClick={() => setActiveTab('scientific')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'scientific' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'الآلة العلمية' : 'Scientific Pad'}
          </button>
          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'cheatsheet' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'حيل وأسرار ديسموس' : 'SAT Desmos Tricks'}
          </button>
          <button
            onClick={() => setActiveTab('official')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'official' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'ar' ? 'ديسموس الرسمي' : 'Official Desmos'}
          </button>
        </div>
      </div>

      {/* Main Workstation View Area */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
        {/* TAB 1: GRAPHING WORKBENCH */}
        {activeTab === 'graph' && (
          <div className="flex-1 flex flex-col md:flex-row min-h-[580px]">
            {/* Sidebar with Functions List & Controls */}
            <div className="w-full md:w-80 bg-slate-950/80 border-b md:border-b-0 md:border-l border-slate-800 p-4 flex flex-col gap-4 overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'الدوال والمعادلات (y = f(x)):' : 'Plot Expressions:'}</span>
                </span>
              </div>

              {/* Add function input */}
              <div className="flex gap-1.5" dir="ltr">
                <input
                  type="text"
                  value={newExpr}
                  onChange={(e) => setNewExpr(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddFunction()}
                  placeholder="e.g. -x^2 + 6*x"
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => handleAddFunction()}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-600/20"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'إضافة' : 'Add'}</span>
                </button>
              </div>

              {/* Active Functions list */}
              <div className="space-y-2 flex-1">
                {functions.map((fn) => (
                  <div
                    key={fn.id}
                    className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: fn.color }} />
                      <span className="text-xs font-mono text-slate-200 truncate" dir="ltr">
                        {fn.label || fn.expr}
                      </span>
                    </div>
                    <button
                      onClick={() => setFunctions((prev) => prev.filter((f) => f.id !== fn.id))}
                      className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* SAT Presets */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{language === 'ar' ? 'نماذج جاهزة من السات:' : 'SAT Quick Presets:'}</span>
                </span>
                <div className="space-y-1">
                  {satPresets.map((preset, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleAddFunction(preset.expr)}
                      className="w-full text-start p-1.5 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 font-mono transition-colors block truncate"
                    >
                      + {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Canvas Interactive Plot Area */}
            <div className="flex-1 relative flex flex-col bg-slate-950">
              {/* Zoom & Reset Floating Buttons */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 backdrop-blur-md shadow-lg">
                <button
                  onClick={() => setScale((prev) => Math.min(250, prev * 1.25))}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setScale((prev) => Math.max(10, prev * 0.8))}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const canvas = canvasRef.current;
                    if (canvas) setOrigin({ x: canvas.width / 2, y: canvas.height / 2 });
                    setScale(35);
                  }}
                  className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
                  title="Reset Origin"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 relative w-full h-full min-h-[480px]">
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={() => setIsDragging(false)}
                  onMouseLeave={() => setIsDragging(false)}
                  className="w-full h-full cursor-crosshair block"
                />
              </div>

              {/* Status info bar */}
              <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {language === 'ar'
                      ? 'حرك الماوس على المنحنيات لقراءة الإحداثيات (x, y)'
                      : 'Hover over curve to inspect coordinates'}
                  </span>
                </span>
                <span className="font-mono text-slate-500">
                  Scale: {Math.round(scale)} px/unit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCIENTIFIC PAD */}
        {activeTab === 'scientific' && (
          <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1 max-w-lg mx-auto w-full space-y-4">
              {/* Display Screen */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2" dir="ltr">
                <div className="text-right text-xs text-slate-400 min-h-[20px] font-mono">
                  {calcInput || '0'}
                </div>
                <div className="text-right text-3xl font-black text-amber-400 font-mono">
                  {calcResult !== null ? `= ${calcResult}` : calcInput ? '...' : '0'}
                </div>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-2">
                {['C', '(', ')', 'BACK', 'sin', 'cos', 'tan', 'sqrt', '7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '+', '='].map(
                  (key) => (
                    <button
                      key={key}
                      onClick={() => handleKeypadPress(key)}
                      className={`p-3.5 rounded-xl font-mono text-sm font-bold transition-all active:scale-95 ${
                        key === '='
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30'
                          : key === 'C'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                          : ['sin', 'cos', 'tan', 'sqrt'].includes(key)
                          ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-800/60'
                          : ['+', '-', '*', '/'].includes(key)
                          ? 'bg-slate-800 text-amber-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-100'
                      }`}
                    >
                      {key}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* History Panel */}
            <div className="w-full md:w-80 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{language === 'ar' ? 'سجل العمليات الحسابية:' : 'Calculation History:'}</span>
              </h4>
              <div className="space-y-2">
                {calcHistory.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCalcInput(item.expr);
                      setCalcResult(item.res);
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950 hover:bg-amber-950/20 border border-slate-800 text-start font-mono text-xs transition-colors block"
                    dir="ltr"
                  >
                    <div className="text-slate-400 truncate">{item.expr}</div>
                    <div className="text-amber-400 font-bold text-sm mt-0.5">= {item.res}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SAT DESMOS CHEAT SHEET */}
        {activeTab === 'cheatsheet' && (
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 text-xs font-bold font-mono">
                  Trick 1: Linear Systems
                </span>
                <h4 className="text-sm font-bold text-white">حل أنظمة المعادلات بدون أي خطوات جبرية</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اكتب المعادلة الأولى في سطر مثل <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-300">2x + 3y = 12</code> والمعادلة الثانية في السطر التالي. انقر فورياً على نقطة تقاطع المستقيمين للحصول على إحداثيات (x, y).
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-bold font-mono">
                  Trick 2: Parabolas & Vertex
                </span>
                <h4 className="text-sm font-bold text-white">إيجاد القيمة العظمى أو الصغرى (Vertex) فوراً</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اكتب الدالة التربيعية <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">y = -2x^2 + 8x - 3</code> وانقر على رأس القطع المكافئ لمعرفة أقصى ارتفاع وقيم x المقابلة بدون إكمال المربع.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg bg-sky-950 text-sky-300 text-xs font-bold font-mono">
                  Trick 3: Roots & Solutions
                </span>
                <h4 className="text-sm font-bold text-white">إيجاد عدد الحلول والجذور الحقيقية</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  عدد نقاط تقاطع الرسم مع محور x (x-intercepts) هو بالضبط عدد الجذور الحقيقية للمعادلة. إذا لم يقطع المحور فإن المميز سالباً ولا توجد حلول حقيقية.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950 text-purple-300 text-xs font-bold font-mono">
                  Trick 4: Circle Equations
                </span>
                <h4 className="text-sm font-bold text-white">الدوائر ونصف القطر (Radius & Center)</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  اكتب معادلة الدائرة مباشرة كما هي بالامتحان: <code className="bg-slate-800 px-1 py-0.5 rounded text-purple-300">(x-3)^2 + (y+2)^2 = 25</code> وستظهر الدائرة بمركزها الدقيق ونصف قطرها (5 وحدات).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL DESMOS WEB */}
        {activeTab === 'official' && (
          <div className="flex-1 relative bg-slate-950 flex flex-col min-h-[600px]">
            <iframe
              src="https://www.desmos.com/calculator"
              title="Official Desmos Calculator"
              className="w-full flex-1 border-0"
              allow="clipboard-write"
            />
          </div>
        )}
      </div>
    </div>
  );
};
