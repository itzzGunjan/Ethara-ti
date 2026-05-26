import React, { useState, useEffect } from 'react';
import './styles/variables.css';
import './styles/main.css';
import './styles/components.css';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import GoalsPage from './pages/GoalsPage';

const API_BASE = 'http://localhost:8000/api';

const DEFAULT_TASKS = [
  { id: 101, title: 'Configure Git PAT Credentials', description: 'Set up Personal Access Token Classic to authorize pushing repositories.', status: 'done', priority: 'high', category: 'work' },
  { id: 102, title: 'Implement FastAPI Backend App', description: 'Design SQLite schemas, setup API routers, and test with Uvicorn.', status: 'done', priority: 'high', category: 'work' },
  { id: 103, title: 'Build React Premium Dashboard UI', description: 'Develop glassmorphic widgets, charts, and interactive Kanban boards.', status: 'in_progress', priority: 'medium', category: 'work' },
  { id: 104, title: 'Set Up Automated Tests', description: 'Write unit tests to verify CRUD state synchronizations.', status: 'todo', priority: 'low', category: 'personal' }
];

const DEFAULT_GOALS = [
  {
    id: 201,
    title: 'Launch Ethara Workspace Dashboard',
    description: 'Fully build out, verify local servers, and commit final build to remote GitHub.',
    category: 'work',
    milestones: [
      { id: 301, goal_id: 201, title: 'Complete Git and Repository setup', is_completed: true },
      { id: 302, goal_id: 201, title: 'Deploy FastAPI local CRUD service', is_completed: true },
      { id: 303, goal_id: 201, title: 'Interface Vite React with API endpoints', is_completed: false },
      { id: 304, goal_id: 201, title: 'Upload clean build to GitHub', is_completed: false }
    ]
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [analytics, setAnalytics] = useState(null);

  // Fetch all data from backend
  const fetchData = async () => {
    try {
      // 1. Fetch Tasks
      const resTasks = await fetch(`${API_BASE}/tasks/`);
      if (resTasks.ok) {
        const dataTasks = await resTasks.json();
        if (dataTasks.length > 0) setTasks(dataTasks);
      }

      // 2. Fetch Goals
      const resGoals = await fetch(`${API_BASE}/goals/`);
      if (resGoals.ok) {
        const dataGoals = await resGoals.json();
        if (dataGoals.length > 0) setGoals(dataGoals);
      }

      // 3. Fetch Analytics
      const resAnalytics = await fetch(`${API_BASE}/analytics/`);
      if (resAnalytics.ok) {
        const dataAnalytics = await resAnalytics.json();
        setAnalytics(dataAnalytics);
      }
    } catch (err) {
      console.warn('FastAPI backend not running or not accessible. Operating in high-performance local state mode.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Analytics helper
  const updateAnalyticsLocal = (newTasks = tasks, newGoals = goals) => {
    const total = newTasks.length;
    const done = newTasks.filter(t => t.status === 'done').length;
    const todo = newTasks.filter(t => t.status === 'todo').length;
    const in_progress = newTasks.filter(t => t.status === 'in_progress').length;
    const t_rate = total > 0 ? (done / total) * 100 : 0;

    let totalMs = 0;
    let completedMs = 0;
    newGoals.forEach(g => {
      g.milestones.forEach(ms => {
        totalMs++;
        if (ms.is_completed) completedMs++;
      });
    });
    const g_rate = totalMs > 0 ? (completedMs / totalMs) * 100 : 0;

    const priorities = newTasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    const categories = newTasks.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    const prodScore = total > 0 || totalMs > 0
      ? Math.round((t_rate * 0.6) + (g_rate * 0.4))
      : 0;

    setAnalytics({
      tasks: { total, todo, in_progress, done, completion_rate: t_rate },
      priorities,
      categories,
      goals: { total: newGoals.length, total_milestones: totalMs, completed_milestones: completedMs, completion_rate: g_rate },
      productivity_score: prodScore
    });
  };

  // --- Task Handlers ---

  const handleAddTask = async (taskData) => {
    const tempId = Date.now();
    const newTask = { ...taskData, id: tempId, created_at: new Date().toISOString() };
    const updatedTasks = [...tasks, newTask];
    
    // Optimistic update
    setTasks(updatedTasks);
    updateAnalyticsLocal(updatedTasks, goals);

    try {
      const res = await fetch(`${API_BASE}/tasks/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      if (res.ok) {
        fetchData(); // Reload with server-allocated IDs
      }
    } catch (e) {
      console.warn('Optimistic local task create successful (Backend offline)');
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);
    updateAnalyticsLocal(updatedTasks, goals);

    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (e) {
      console.warn('Optimistic local task update successful (Backend offline)');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    updateAnalyticsLocal(updatedTasks, goals);

    try {
      await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Optimistic local task delete successful (Backend offline)');
    }
  };

  // --- Goal Handlers ---

  const handleAddGoal = async (goalData) => {
    const tempId = Date.now();
    const newGoal = {
      ...goalData,
      id: tempId,
      created_at: new Date().toISOString(),
      milestones: goalData.milestones.map((ms, idx) => ({ ...ms, id: tempId + idx, goal_id: tempId }))
    };
    const updatedGoals = [...goals, newGoal];
    
    setGoals(updatedGoals);
    updateAnalyticsLocal(tasks, updatedGoals);

    try {
      const res = await fetch(`${API_BASE}/goals/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.warn('Optimistic local goal create successful (Backend offline)');
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    const updatedGoals = goals.map(g => {
      const hasMs = g.milestones.some(m => m.id === milestoneId);
      if (hasMs) {
        return {
          ...g,
          milestones: g.milestones.map(m => m.id === milestoneId ? { ...m, is_completed: !m.is_completed } : m)
        };
      }
      return g;
    });

    setGoals(updatedGoals);
    updateAnalyticsLocal(tasks, updatedGoals);

    try {
      await fetch(`${API_BASE}/goals/milestones/${milestoneId}/toggle`, {
        method: 'PUT'
      });
    } catch (e) {
      console.warn('Optimistic local milestone toggle successful (Backend offline)');
    }
  };

  const handleDeleteGoal = async (goalId) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    updateAnalyticsLocal(tasks, updatedGoals);

    try {
      await fetch(`${API_BASE}/goals/${goalId}`, {
        method: 'DELETE'
      });
    } catch (e) {
      console.warn('Optimistic local goal delete successful (Backend offline)');
    }
  };

  return (
    <div className="workspace-container">
      {/* Header */}
      <header className="workspace-header">
        <div className="workspace-title">
          <h1>Ethara Workspace</h1>
          <p>Task tracker, strategic milestones, and real-time dashboard analytics.</p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="workspace-tabs">
          <button 
            className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
          <button 
            className={`tab-btn ${activeTab === 'kanban' ? 'active' : ''}`}
            onClick={() => setActiveTab('kanban')}
          >
            📋 Kanban Board
          </button>
          <button 
            className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
          >
            🎯 Goals & Milestones
          </button>
        </div>
      </header>

      {/* Main Page Render */}
      <main>
        {activeTab === 'dashboard' && (
          <DashboardPage 
            analytics={analytics} 
            tasks={tasks} 
            goals={goals} 
          />
        )}
        {activeTab === 'kanban' && (
          <KanbanPage 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
          />
        )}
        {activeTab === 'goals' && (
          <GoalsPage 
            goals={goals}
            onAddGoal={handleAddGoal}
            onToggleMilestone={handleToggleMilestone}
            onDeleteGoal={handleDeleteGoal}
          />
        )}
      </main>
    </div>
  );
}
