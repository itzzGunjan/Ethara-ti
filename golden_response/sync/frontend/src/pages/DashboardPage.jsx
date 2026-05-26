import React from 'react';

export default function DashboardPage({ analytics, tasks, goals }) {
  // Compute fallbacks if backend analytics are loading or empty
  const totalTasks = analytics?.tasks?.total ?? tasks.length;
  const doneTasks = analytics?.tasks?.done ?? tasks.filter(t => t.status === 'done').length;
  const todoTasks = analytics?.tasks?.todo ?? tasks.filter(t => t.status === 'todo').length;
  const inProgressTasks = analytics?.tasks?.in_progress ?? tasks.filter(t => t.status === 'in_progress').length;
  
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const prodScore = analytics?.productivity_score ?? Math.round(completionRate * 0.8 + 10);

  // Categories fallback
  const categoriesList = analytics?.categories && Object.keys(analytics.categories).length > 0 
    ? analytics.categories 
    : tasks.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + 1;
        return acc;
      }, {});

  // Priorities fallback
  const prioritiesList = analytics?.priorities 
    ? analytics.priorities 
    : tasks.reduce((acc, t) => {
        acc[t.priority] = (acc[t.priority] || 0) + 1;
        return acc;
      }, { low: 0, medium: 0, high: 0 });

  // Goal metrics
  const totalGoals = analytics?.goals?.total ?? goals.length;
  const totalMilestones = analytics?.goals?.total_milestones ?? goals.reduce((sum, g) => sum + g.milestones.length, 0);
  const completedMilestones = analytics?.goals?.completed_milestones ?? goals.reduce((sum, g) => sum + g.milestones.filter(m => m.is_completed).length, 0);
  const goalCompletionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  // SVG Radial Progress Calculation
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prodScore / 100) * circumference;

  return (
    <div className="fade-in">
      {/* Top Welcome Card */}
      <div className="glass-card widget-score" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(124, 77, 255, 0.1) 0%, rgba(15, 17, 28, 0.75) 100%)' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome to Ethara Workspace</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.5' }}>
            Your premium central command hub. Monitor your goals, manage interactive boards, and review live productivity scores. Everything you need is updated in real time.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Productivity Index</span>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginTop: '0.2rem' }}>{prodScore}%</div>
          </div>
          <div className="radial-progress-wrapper">
            <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="60" cy="60" r={radius} fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="8" />
              <circle 
                cx="60" 
                cy="60" 
                r={radius} 
                fill="transparent" 
                stroke="url(#cyanPurpleGrad)" 
                strokeWidth="8" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
              <defs>
                <linearGradient id="cyanPurpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-cyan)" />
                  <stop offset="100%" stopColor="var(--accent-purple)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="radial-score-text">{prodScore}</div>
          </div>
        </div>
      </div>

      {/* Grid Metrics */}
      <div className="dashboard-grid">
        {/* Metric 1 */}
        <div className="glass-card">
          <div className="widget-title">Task Completion</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="widget-value">{completionRate}%</div>
            <div style={{ color: 'var(--accent-green)', fontSize: '0.9rem', fontWeight: 600 }}>{doneTasks} / {totalTasks} Done</div>
          </div>
          <div className="goal-progress-bar-container" style={{ marginTop: '1.2rem' }}>
            <div className="goal-progress-bar" style={{ width: `${completionRate}%`, background: 'var(--accent-purple)' }}></div>
          </div>
          <div className="widget-subtitle">{todoTasks} To Do | {inProgressTasks} In Progress</div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card">
          <div className="widget-title">Goal Success Rate</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="widget-value">{goalCompletionRate}%</div>
            <div style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', fontWeight: 600 }}>{completedMilestones} / {totalMilestones} Milestones</div>
          </div>
          <div className="goal-progress-bar-container" style={{ marginTop: '1.2rem' }}>
            <div className="goal-progress-bar" style={{ width: `${goalCompletionRate}%`, background: 'var(--accent-cyan)' }}></div>
          </div>
          <div className="widget-subtitle">{totalGoals} Active Workspace Goals</div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card">
          <div className="widget-title">Task Distribution</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            {Object.keys(categoriesList).length > 0 ? (
              Object.entries(categoriesList).slice(0, 3).map(([cat, count]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{cat}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{count} {count === 1 ? 'task' : 'tasks'}</span>
                </div>
              ))
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '0.5rem' }}>No task data available</div>
            )}
          </div>
        </div>
      </div>

      {/* Priorities and Recent Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Priorities Panel */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem', fontWeight: 600 }}>Priority Loadout</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge high">High Priority</span>
              <span style={{ fontWeight: 600 }}>{prioritiesList.high || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge medium">Medium Priority</span>
              <span style={{ fontWeight: 600 }}>{prioritiesList.medium || 0}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge low">Low Priority</span>
              <span style={{ fontWeight: 600 }}>{prioritiesList.low || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Tips Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--accent-purple)' }}>Smart Recommendations</h3>
          <ul style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', paddingLeft: '1.2rem', lineHeight: '1.6' }}>
            <li>{totalTasks === 0 ? "Initialize some workspace tasks in the Kanban tab." : `You currently have ${inProgressTasks} tasks In Progress. Focus on finishing them first.`}</li>
            <li>{totalGoals === 0 ? "Define a career or personal goal with milestones." : `Keep checking off milestones to raise your productivity index.`}</li>
            <li>Maintain a balanced loadout across High, Medium, and Low priorities.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
