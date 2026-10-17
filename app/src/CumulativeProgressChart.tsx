import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { Attempt, independent } from './engine';
import core from './data/core.json';

interface Props {
  attempts: Attempt[];
  lang?: 'en' | 'ar';
}

interface DataPoint {
  index: number; // 1-based attempt sequence
  attemptId: string;
  contentId: string;
  bankId: string;
  timestamp: Date;
  timeStr: string;
  result: 'correct' | 'incorrect' | 'pending';
  isIndependent: boolean;
  isAssisted: boolean;
  support: string;
  hints: number;
  reveal: boolean;
  attemptNumber: number;
  cumulativeDistinctQuestions: number;
  totalQuestionsTarget: number;
  cumulativeAttempts: number;
  cumulativeIndependentCorrect: number;
  cumulativeEvaluated: number;
  cumulativeAccuracy: number; // 0 - 100%
  rollingAccuracy5: number;   // 5-point moving average
}

// Generate realistic simulated attempts for teacher preview or demonstration
function generateDemoAttempts(): Attempt[] {
  const simulated: Attempt[] = [];
  const banks = ['V1', 'V2', 'R1', 'R2', 'G1', 'G2', 'L1', 'L2', 'W1', 'N1', 'S1'];
  const now = Date.now();
  const baseTime = now - 7 * 24 * 60 * 60 * 1000; // 7 days ago

  // 60 simulated attempts progressing through various banks with increasing accuracy
  let cumTime = baseTime;
  for (let i = 0; i < 60; i++) {
    const bank = banks[Math.floor((i / 60) * banks.length)];
    const qNum = (i % 30) + 1;
    const contentId = `${bank}-${String(qNum).padStart(2, '0')}`;
    cumTime += Math.floor(15 * 60 * 1000 + Math.random() * 45 * 60 * 1000); // 15-60 min intervals
    
    // Skill growth: starts around 65% independent, grows to 88%
    const skillLevel = 0.65 + (i / 60) * 0.25;
    const isSuccess = Math.random() < skillLevel;
    const isAssisted = !isSuccess && Math.random() < 0.35;

    simulated.push({
      id: `demo-${i + 1}`,
      uid: 'demo-learner',
      session: `session-${Math.floor(i / 10)}`,
      contentId,
      version: 'source-2026-10-15',
      mode: 'source-bank',
      dataset: 'source330',
      support: isAssisted ? 'supported' : 'independent',
      response: isSuccess ? 'Selected correct answer' : 'Alternative option',
      firstResponse: isSuccess ? 'Selected correct answer' : 'Alternative option',
      firstAttemptCorrect: isSuccess,
      attemptNumber: 1,
      result: isSuccess ? 'correct' : 'incorrect',
      hints: isAssisted ? 1 : 0,
      reveal: isAssisted,
      transcript: false,
      replays: 0,
      review: 'none',
      durationMs: 12000 + Math.floor(Math.random() * 18000),
      timestamp: new Date(cumTime).toISOString(),
    });
  }
  return simulated;
}

export function CumulativeProgressChart({ attempts: rawAttempts, lang = 'en' }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // User controls
  const [selectedBank, setSelectedBank] = useState<string>('ALL');
  const [xAxisMode, setXAxisMode] = useState<'timeline' | 'sequence'>('sequence');
  const [showDemo, setShowDemo] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [showTargetLines, setShowTargetLines] = useState<boolean>(true);

  // Active attempts pool (real or demo preview)
  const activeAttempts = useMemo(() => {
    if (showDemo) {
      return generateDemoAttempts();
    }
    return rawAttempts.filter((a) => a.dataset === 'source330' || a.contentId.includes('-'));
  }, [rawAttempts, showDemo]);

  // Filtered by bank
  const filteredAttempts = useMemo(() => {
    if (selectedBank === 'ALL') return activeAttempts;
    return activeAttempts.filter((a) => a.contentId.startsWith(selectedBank + '-'));
  }, [activeAttempts, selectedBank]);

  // Total questions in target context (330 for ALL, 30 for single bank)
  const totalQuestionsTarget = selectedBank === 'ALL' ? 330 : 30;

  // Process attempt series chronologically into cumulative data points
  const chartData = useMemo<DataPoint[]>(() => {
    if (!filteredAttempts.length) return [];

    // Sort strictly chronologically
    const sorted = [...filteredAttempts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const seenQuestions = new Set<string>();
    let cumulativeEvaluated = 0;
    let cumulativeIndependentCorrect = 0;
    const history: DataPoint[] = [];

    sorted.forEach((att, idx) => {
      seenQuestions.add(att.contentId);
      const isInd = independent(att);
      const isObjective = att.result !== 'pending' && att.support !== 'skipped';
      
      if (isObjective) {
        cumulativeEvaluated++;
        if (isInd) {
          cumulativeIndependentCorrect++;
        }
      }

      const cumulativeAccuracy = cumulativeEvaluated > 0
        ? Math.round((cumulativeIndependentCorrect / cumulativeEvaluated) * 1000) / 10
        : 0;

      // 5-point rolling window accuracy
      const recentSlice = sorted.slice(Math.max(0, idx - 4), idx + 1);
      const recentEvaluated = recentSlice.filter(
        (a) => a.result !== 'pending' && a.support !== 'skipped'
      );
      const recentInd = recentEvaluated.filter((a) => independent(a)).length;
      const rollingAccuracy5 = recentEvaluated.length > 0
        ? Math.round((recentInd / recentEvaluated.length) * 1000) / 10
        : cumulativeAccuracy;

      const bankId = att.contentId.split('-')[0] || 'V1';
      const dateObj = new Date(att.timestamp);

      history.push({
        index: idx + 1,
        attemptId: att.id,
        contentId: att.contentId,
        bankId,
        timestamp: dateObj,
        timeStr: isNaN(dateObj.getTime())
          ? `Attempt #${idx + 1}`
          : dateObj.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
        result: att.result,
        isIndependent: isInd,
        isAssisted: att.hints > 0 || att.reveal || att.transcript || att.support === 'supported',
        support: att.support,
        hints: att.hints,
        reveal: att.reveal,
        attemptNumber: att.attemptNumber,
        cumulativeDistinctQuestions: seenQuestions.size,
        totalQuestionsTarget,
        cumulativeAttempts: idx + 1,
        cumulativeIndependentCorrect,
        cumulativeEvaluated,
        cumulativeAccuracy,
        rollingAccuracy5,
      });
    });

    return history;
  }, [filteredAttempts, totalQuestionsTarget]);

  // Overall summary metrics
  const latestPoint = chartData[chartData.length - 1] || null;
  const distinctCovered = latestPoint ? latestPoint.cumulativeDistinctQuestions : 0;
  const percentCovered = Math.min(100, Math.round((distinctCovered / totalQuestionsTarget) * 1000) / 10);
  const currentAccuracy = latestPoint ? latestPoint.cumulativeAccuracy : 0;

  // D3 Rendering Hook
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 860;
    const height = 440;
    const margin = { top: 40, right: 65, bottom: 55, left: 65 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define SVG Canvas with responsive viewBox
    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('style', 'max-width: 100%; height: auto; display: block;');

    // Defs for gradients, dropshadow, and clip path
    const defs = svg.append('defs');

    // Nile Teal Area Gradient
    const nileGrad = defs
      .append('linearGradient')
      .attr('id', 'nile-area-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    nileGrad.append('stop').attr('offset', '0%').attr('stop-color', '#007a83').attr('stop-opacity', 0.4);
    nileGrad.append('stop').attr('offset', '100%').attr('stop-color', '#007a83').attr('stop-opacity', 0.03);

    // Accuracy Line Gradient
    const accGrad = defs
      .append('linearGradient')
      .attr('id', 'accuracy-line-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');
    accGrad.append('stop').attr('offset', '0%').attr('stop-color', '#b45309');
    accGrad.append('stop').attr('offset', '100%').attr('stop-color', '#d97706');

    // Filter for glowing points
    const filter = defs.append('filter').attr('id', 'glow-filter').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // If no data points exist, render elegant Egyptian placeholder
    if (!chartData.length) {
      g.append('rect')
        .attr('width', innerWidth)
        .attr('height', innerHeight)
        .attr('fill', '#fff9ec')
        .attr('rx', 8)
        .attr('stroke', '#ab843e44')
        .attr('stroke-dasharray', '4 4');

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2 - 20)
        .attr('text-anchor', 'middle')
        .attr('fill', '#553e18')
        .attr('font-size', '18px')
        .attr('font-weight', '600')
        .text('No practice attempts logged in this filter yet');

      g.append('text')
        .attr('x', innerWidth / 2)
        .attr('y', innerHeight / 2 + 12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#766020')
        .attr('font-size', '14px')
        .text('Complete questions in Challenge Arena or switch to "Demo / Preview Trail" above');

      return;
    }

    // X Scale: sequence or timeline
    let xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
    if (xAxisMode === 'timeline') {
      const dates = chartData.map((d) => d.timestamp.getTime());
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      // Buffer if single date or narrow range
      if (minDate.getTime() === maxDate.getTime()) {
        minDate.setHours(minDate.getHours() - 1);
        maxDate.setHours(maxDate.getHours() + 1);
      }
      xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, innerWidth]);
    } else {
      const maxIdx = Math.max(chartData.length, 5);
      xScale = d3.scaleLinear().domain([1, maxIdx]).range([0, innerWidth]);
    }

    // Left Y Scale: Cumulative Questions (0 to totalQuestionsTarget, e.g. 330)
    const yScaleQuestions = d3.scaleLinear().domain([0, totalQuestionsTarget]).nice().range([innerHeight, 0]);

    // Right Y Scale: Independent Accuracy (0% to 100%)
    const yScaleAccuracy = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // X Coordinates helper
    const getX = (d: DataPoint) => {
      if (xAxisMode === 'timeline') {
        return (xScale as d3.ScaleTime<number, number>)(d.timestamp);
      }
      return (xScale as d3.ScaleLinear<number, number>)(d.index);
    };

    // Horizontal Grid Lines (based on left scale)
    const yQuestionsTicks = yScaleQuestions.ticks(6);
    g.append('g')
      .attr('class', 'grid-lines')
      .selectAll('line')
      .data(yQuestionsTicks)
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', innerWidth)
      .attr('y1', (d) => yScaleQuestions(d))
      .attr('y2', (d) => yScaleQuestions(d))
      .attr('stroke', '#ab843e22')
      .attr('stroke-width', 1);

    // Target Ceiling Line (330 Questions)
    if (showTargetLines) {
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScaleQuestions(totalQuestionsTarget))
        .attr('y2', yScaleQuestions(totalQuestionsTarget))
        .attr('stroke', '#007a83')
        .attr('stroke-dasharray', '5 4')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);

      g.append('text')
        .attr('x', 6)
        .attr('y', yScaleQuestions(totalQuestionsTarget) - 6)
        .attr('fill', '#006e77')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(`Target: ${totalQuestionsTarget} ${selectedBank === 'ALL' ? 'Total Source Questions' : 'Bank Questions'}`);

      // 80% Mastery Standard Line (right axis)
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yScaleAccuracy(80))
        .attr('y2', yScaleAccuracy(80))
        .attr('stroke', '#d97706')
        .attr('stroke-dasharray', '3 3')
        .attr('stroke-width', 1.2)
        .attr('opacity', 0.65);

      g.append('text')
        .attr('x', innerWidth - 6)
        .attr('y', yScaleAccuracy(80) - 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#b45309')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text('80% Independent Mastery Standard');
    }

    // Area generator for cumulative questions
    const questionsArea = d3
      .area<DataPoint>()
      .x(getX)
      .y0(innerHeight)
      .y1((d) => yScaleQuestions(d.cumulativeDistinctQuestions))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'url(#nile-area-grad)')
      .attr('d', questionsArea);

    // Line generator for cumulative questions
    const questionsLine = d3
      .line<DataPoint>()
      .x(getX)
      .y((d) => yScaleQuestions(d.cumulativeDistinctQuestions))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', '#007a83')
      .attr('stroke-width', 2.8)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', questionsLine);

    // Trend line for Independent Accuracy
    const accuracyLine = d3
      .line<DataPoint>()
      .x(getX)
      .y((d) => yScaleAccuracy(d.cumulativeAccuracy))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', 'url(#accuracy-line-grad)')
      .attr('stroke-width', 3.2)
      .attr('stroke-linejoin', 'round')
      .attr('stroke-linecap', 'round')
      .attr('d', accuracyLine);

    // Optional subtle rolling accuracy guide line
    if (chartData.length > 3) {
      const rollingLine = d3
        .line<DataPoint>()
        .x(getX)
        .y((d) => yScaleAccuracy(d.rollingAccuracy5))
        .curve(d3.curveCatmullRom);

      g.append('path')
        .datum(chartData)
        .attr('fill', 'none')
        .attr('stroke', '#ea580c')
        .attr('stroke-width', 1.2)
        .attr('stroke-dasharray', '2 2')
        .attr('opacity', 0.5)
        .attr('d', rollingLine);
    }

    // Data points for Accuracy Trend
    const dotsGroup = g.append('g').attr('class', 'chart-dots');

    dotsGroup
      .selectAll('circle.acc-dot')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'acc-dot')
      .attr('cx', getX)
      .attr('cy', (d) => yScaleAccuracy(d.cumulativeAccuracy))
      .attr('r', 4.5)
      .attr('fill', (d) => {
        if (d.isIndependent) return '#10b981'; // emerald green
        if (d.isAssisted) return '#f59e0b'; // amber
        return '#ef4444'; // crimson
      })
      .attr('stroke', '#fff9ec')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer');

    // X Axis
    let xAxisGenerator: d3.Axis<any>;
    if (xAxisMode === 'timeline') {
      xAxisGenerator = d3
        .axisBottom(xScale as d3.ScaleTime<number, number>)
        .ticks(Math.min(chartData.length, 6))
        .tickFormat(d3.timeFormat('%b %d, %H:%M') as any);
    } else {
      xAxisGenerator = d3
        .axisBottom(xScale as d3.ScaleLinear<number, number>)
        .ticks(Math.min(chartData.length, 10))
        .tickFormat(d3.format('d') as any);
    }

    const xAxisG = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxisGenerator);

    xAxisG.select('.domain').attr('stroke', '#ab843e');
    xAxisG.selectAll('.tick line').attr('stroke', '#ab843e88');
    xAxisG
      .selectAll('.tick text')
      .attr('fill', '#553e18')
      .attr('font-size', '11px')
      .attr('font-family', 'inherit');

    // X Axis Label
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 42)
      .attr('text-anchor', 'middle')
      .attr('fill', '#553e18')
      .attr('font-size', '12px')
      .attr('font-weight', '600')
      .text(xAxisMode === 'timeline' ? 'Attempt Timeline (Date & Time)' : 'Attempt Sequence (Chronological Order #)');

    // Left Y Axis (Cumulative Questions)
    const yAxisQuestions = d3
      .axisLeft(yScaleQuestions)
      .ticks(6)
      .tickFormat(d3.format('d'));

    const yAxisQuestionsG = g.append('g').call(yAxisQuestions);
    yAxisQuestionsG.select('.domain').attr('stroke', '#007a83');
    yAxisQuestionsG.selectAll('.tick line').attr('stroke', '#007a8344');
    yAxisQuestionsG
      .selectAll('.tick text')
      .attr('fill', '#006e77')
      .attr('font-size', '11px')
      .attr('font-family', 'inherit');

    // Left Y Axis Title
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .attr('fill', '#006e77')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .text(`Questions Covered (0–${totalQuestionsTarget})`);

    // Right Y Axis (Accuracy %)
    const yAxisAccuracy = d3
      .axisRight(yScaleAccuracy)
      .ticks(5)
      .tickFormat((d) => `${d}%`);

    const yAxisAccuracyG = g
      .append('g')
      .attr('transform', `translate(${innerWidth},0)`)
      .call(yAxisAccuracy);

    yAxisAccuracyG.select('.domain').attr('stroke', '#b45309');
    yAxisAccuracyG.selectAll('.tick line').attr('stroke', '#b4530944');
    yAxisAccuracyG
      .selectAll('.tick text')
      .attr('fill', '#b45309')
      .attr('font-size', '11px')
      .attr('font-family', 'inherit');

    // Right Y Axis Title
    g.append('text')
      .attr('transform', 'rotate(90)')
      .attr('x', innerHeight / 2)
      .attr('y', -innerWidth - 48)
      .attr('text-anchor', 'middle')
      .attr('fill', '#b45309')
      .attr('font-size', '12px')
      .attr('font-weight', '700')
      .text('Independent Accuracy Trend (%)');

    // Interactive Crosshair & Tooltip Overlay
    const focusGroup = g.append('g').attr('class', 'chart-focus').style('display', 'none');

    // Vertical indicator line
    const focusLine = focusGroup
      .append('line')
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#553e18')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3');

    // Focus circles
    const focusCircleQuestions = focusGroup
      .append('circle')
      .attr('r', 6)
      .attr('fill', '#007a83')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    const focusCircleAccuracy = focusGroup
      .append('circle')
      .attr('r', 7)
      .attr('fill', '#d97706')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#glow-filter)');

    // Transparent mouse-catching rect
    const overlay = g
      .append('rect')
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .attr('fill', 'transparent')
      .style('cursor', 'crosshair');

    // Bisector for finding nearest data point
    const bisectIndex = d3.bisector((d: DataPoint) => d.index).center;
    const bisectDate = d3.bisector((d: DataPoint) => d.timestamp.getTime()).center;

    overlay
      .on('mouseenter', () => focusGroup.style('display', null))
      .on('mouseleave', () => {
        focusGroup.style('display', 'none');
        setHoveredPoint(null);
      })
      .on('mousemove', (event) => {
        const [mx] = d3.pointer(event);
        let selectedIndex = 0;

        if (xAxisMode === 'timeline') {
          const dateAtMouse = (xScale as d3.ScaleTime<number, number>).invert(mx).getTime();
          selectedIndex = bisectDate(chartData, dateAtMouse);
        } else {
          const numAtMouse = (xScale as d3.ScaleLinear<number, number>).invert(mx);
          selectedIndex = bisectIndex(chartData, numAtMouse);
        }

        const point = chartData[Math.max(0, Math.min(selectedIndex, chartData.length - 1))];
        if (!point) return;

        const px = getX(point);
        const pyQ = yScaleQuestions(point.cumulativeDistinctQuestions);
        const pyA = yScaleAccuracy(point.cumulativeAccuracy);

        focusLine.attr('x1', px).attr('x2', px);
        focusCircleQuestions.attr('cx', px).attr('cy', pyQ);
        focusCircleAccuracy.attr('cx', px).attr('cy', pyA);

        setHoveredPoint(point);
      });
  }, [chartData, xAxisMode, selectedBank, totalQuestionsTarget, showTargetLines]);

  // Export chart as SVG file for teacher / student portfolio
  const downloadChartSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kemet_cumulative_progress_${selectedBank.toLowerCase()}_${Date.now()}.svg`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="cumulative-progress-container panel" ref={containerRef}>
      {/* Header & Badges */}
      <div className="chart-header-row">
        <div>
          <h2 style={{ margin: '0 0 4px 0', color: '#173b3d' }}>
            {lang === 'ar' ? 'مخطط التراكم التاريخي لـ 330 سؤالاً' : 'Cumulative Progress & Mastery Chart (330 Questions)'}
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#634d20' }}>
            {lang === 'ar'
              ? 'تتبع تاريخ محاولاتك عبر الزمن وقياس دقة الأداء المستقل كخط اتجاهي بياني دقيق.'
              : 'D3.js time-series tracking cumulative curriculum coverage across all 330 questions alongside independent accuracy trend.'}
          </p>
        </div>

        <div className="chart-quick-actions">
          <button
            className={`btn-toggle-demo ${showDemo ? 'active-demo' : ''}`}
            onClick={() => setShowDemo(!showDemo)}
            title="Toggle simulated demonstration trail for instructor review"
          >
            {showDemo ? '★ Viewing Demo Trail (Click for Real Data)' : 'Preview Demo Trail (60 Attempts)'}
          </button>
          <button onClick={downloadChartSvg} title="Download vector graphic of this progress chart">
            Download SVG
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="chart-metric-cards-grid">
        <div className="metric-card nile-teal">
          <span className="metric-label">Distinct Questions Covered</span>
          <span className="metric-value">
            {distinctCovered} <small>/ {totalQuestionsTarget}</small>
          </span>
          <div className="metric-progress-bar">
            <div className="bar-fill" style={{ width: `${percentCovered}%`, background: '#007a83' }}></div>
          </div>
          <span className="metric-sub">{percentCovered}% of {selectedBank === 'ALL' ? '330 questions' : `${selectedBank} bank`}</span>
        </div>

        <div className="metric-card egyptian-amber">
          <span className="metric-label">Independent Accuracy Trend</span>
          <span className="metric-value">{currentAccuracy}%</span>
          <div className="metric-progress-bar">
            <div className="bar-fill" style={{ width: `${Math.min(100, currentAccuracy)}%`, background: '#d97706' }}></div>
          </div>
          <span className="metric-sub">
            {currentAccuracy >= 80 ? '✓ Exceeds 80% Mastery Standard' : 'Aiming for 80% independent mastery'}
          </span>
        </div>

        <div className="metric-card desert-sand">
          <span className="metric-label">Total Recorded Attempts</span>
          <span className="metric-value">{chartData.length}</span>
          <span className="metric-sub">
            {latestPoint ? `${latestPoint.cumulativeIndependentCorrect} unassisted correct` : 'No attempts logged'}
          </span>
        </div>

        <div className="metric-card lapis-blue">
          <span className="metric-label">Curriculum Balance</span>
          <span className="metric-value">
            {selectedBank === 'ALL' ? '11 Banks' : `${selectedBank} Bank`}
          </span>
          <span className="metric-sub">{core.BANK_METADATA.map(bank => bank.id).join(', ')}</span>
        </div>
      </div>

      {/* Chart Controls Bar */}
      <div className="chart-controls-toolbar">
        <label className="toolbar-item">
          <span>Source Bank Filter:</span>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All 330 Questions (Complete Curriculum)</option>
            {core.BANK_METADATA.map((b) => (
              <option key={b.id} value={b.id}>
                {b.id} — {b.name} (30 items)
              </option>
            ))}
          </select>
        </label>

        <label className="toolbar-item">
          <span>X-Axis Mode:</span>
          <select
            value={xAxisMode}
            onChange={(e) => setXAxisMode(e.target.value as any)}
            className="filter-select"
          >
            <option value="sequence">Chronological Attempts (#1, #2, #3...)</option>
            <option value="timeline">Time & Date Timeline</option>
          </select>
        </label>

        <label className="toolbar-checkbox">
          <input
            type="checkbox"
            checked={showTargetLines}
            onChange={(e) => setShowTargetLines(e.target.checked)}
          />
          <span>Show Mastery & Goal Targets</span>
        </label>
      </div>

      {/* SVG Visualization Canvas */}
      <div className="svg-chart-wrapper" style={{ position: 'relative' }}>
        <svg ref={svgRef} className="d3-progress-svg" />

        {/* Hover Tooltip Box */}
        {hoveredPoint && (
          <div className="chart-tooltip-panel">
            <div className="tooltip-header">
              <strong>Attempt #{hoveredPoint.index}</strong> · {hoveredPoint.timeStr}
            </div>
            <div className="tooltip-body">
              <div className="tooltip-row">
                <span className="t-label">Question:</span>
                <span className="t-val">
                  <strong>{hoveredPoint.contentId}</strong> ({hoveredPoint.bankId})
                </span>
              </div>
              <div className="tooltip-row">
                <span className="t-label">Outcome:</span>
                <span
                  className="t-badge"
                  style={{
                    color: hoveredPoint.isIndependent
                      ? '#0f766e'
                      : hoveredPoint.isAssisted
                      ? '#b45309'
                      : '#b91c1c',
                  }}
                >
                  {hoveredPoint.isIndependent
                    ? '✓ Independent Correct'
                    : hoveredPoint.isAssisted
                    ? '⚡ Assisted / Scaffolded'
                    : '✗ Incorrect'}
                </span>
              </div>
              <div className="tooltip-row">
                <span className="t-label">Cumulative Questions:</span>
                <span className="t-val">
                  <strong>{hoveredPoint.cumulativeDistinctQuestions}</strong> / {hoveredPoint.totalQuestionsTarget} (
                  {Math.round((hoveredPoint.cumulativeDistinctQuestions / hoveredPoint.totalQuestionsTarget) * 100)}%)
                </span>
              </div>
              <div className="tooltip-row">
                <span className="t-label">Independent Accuracy:</span>
                <span className="t-val highlight-amber">
                  <strong>{hoveredPoint.cumulativeAccuracy}%</strong>
                </span>
              </div>
              {hoveredPoint.rollingAccuracy5 !== undefined && (
                <div className="tooltip-row">
                  <span className="t-label">Rolling 5-Attempt Accuracy:</span>
                  <span className="t-val">{hoveredPoint.rollingAccuracy5}%</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Guide */}
      <div className="chart-legend-row">
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: '#007a83', height: 4 }}></span>
          <span>Cumulative Unique Questions Covered (Left Axis: 0–{totalQuestionsTarget})</span>
        </div>
        <div className="legend-item">
          <span className="legend-swatch" style={{ background: '#d97706', height: 4 }}></span>
          <span>Independent Accuracy Performance Trend Line (Right Axis: 0%–100%)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#10b981' }}></span>
          <span>Independent Correct</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
          <span>Assisted</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot" style={{ background: '#ef4444' }}></span>
          <span>Incorrect</span>
        </div>
      </div>
    </div>
  );
}
