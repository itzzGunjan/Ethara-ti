import React, { useState } from 'react';

export default function GoalsPage({ goals, onAddGoal, onToggleMilestone, onDeleteGoal }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('work');
  const [milestonesInput, setMilestonesInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Parse milestones from new-line separated input
    const milestones = milestonesInput
      .split('\n')
      .map(m => m.trim())
      .filter(m => m !== '')
      .map(m => ({ title: m, is_completed: false }));

    onAddGoal({
      title,
      description: desc,
      category,
      milestones
    });

    // Reset Form
    setTitle('');
    setDesc('');
    setCategory('work');
    setMilestonesInput('');
    setShowModal(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Goals & Milestones</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Set macro objectives, break them into milestones, and track your achievements.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>+</span> Create Goal
        </button>
      </div>

      {/* Goals List */}
      <div className="goals-list">
        {goals.length > 0 ? (
          goals.map(goal => {
            const totalMs = goal.milestones.length;
            const completedMs = goal.milestones.filter(m => m.is_completed).length;
            const percent = totalMs > 0 ? Math.round((completedMs / totalMs) * 100) : 0;

            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card-header">
                  <div>
                    <span className="badge medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      {goal.category}
                    </span>
                    <h3 className="goal-title">{goal.title}</h3>
                    {goal.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '0.25rem' }}>{goal.description}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</span>
                      <div style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{percent}% ({completedMs}/{totalMs})</div>
                    </div>
                    <button 
                      className="action-btn delete" 
                      style={{ fontSize: '1.1rem', padding: '0.4rem' }}
                      title="Delete goal"
                      onClick={() => onDeleteGoal(goal.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="goal-progress-bar-container">
                  <div className="goal-progress-bar" style={{ width: `${percent}%` }}></div>
                </div>

                {/* Milestones accordion/list */}
                {totalMs > 0 && (
                  <div className="milestones-section">
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                      Milestones
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem 1.5rem' }}>
                      {goal.milestones.map(ms => (
                        <div 
                          key={ms.id} 
                          className={`milestone-item ${ms.is_completed ? 'completed' : ''}`}
                          onClick={() => onToggleMilestone(ms.id)}
                        >
                          <div className="milestone-checkbox">
                            {ms.is_completed && (
                              <svg className="check-icon" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                          <span>{ms.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>No Active Goals</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '400px', margin: '0 auto' }}>
              Create your first strategic workspace goal and break it down into achievable milestones.
            </p>
          </div>
        )}
      </div>

      {/* Goal Creation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Create New Workspace Goal</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Goal Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Master Backend FastAPI Service" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Objective / Description</label>
                <textarea 
                  className="form-control" 
                  rows="2" 
                  placeholder="e.g. Set up schemas, write tests, and complete repository pattern documentation" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="work">Work & Development</option>
                  <option value="personal">Personal Development</option>
                  <option value="health">Health & Fitness</option>
                  <option value="finance">Financial Freedom</option>
                </select>
              </div>
              <div className="form-group">
                <label>Milestones (One per line)</label>
                <textarea 
                  className="form-control" 
                  rows="4" 
                  placeholder="e.g.&#10;Design SQLAlchemy schemas&#10;Configure database sessions&#10;Write unit tests for endpoints" 
                  value={milestonesInput} 
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  required
                />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
