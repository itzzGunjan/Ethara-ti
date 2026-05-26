import React, { useState } from 'react';

export default function KanbanPage({ tasks, onAddTask, onUpdateTaskStatus, onDeleteTask }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('work');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title,
      description: desc,
      priority,
      category,
      status: 'todo'
    });
    // Reset Form
    setTitle('');
    setDesc('');
    setPriority('medium');
    setCategory('work');
    setShowModal(false);
  };

  const columns = [
    { id: 'todo', title: 'To Do', accent: 'var(--accent-cyan)' },
    { id: 'in_progress', title: 'In Progress', accent: 'var(--accent-purple)' },
    { id: 'done', title: 'Completed', accent: 'var(--accent-green)' }
  ];

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Interactive Task Board</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            Organize tasks and push priorities instantly.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <span style={{ fontSize: '1.2rem', lineHeight: 0 }}>+</span> Create Task
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="kanban-grid">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="kanban-column">
              <div className="column-header">
                <span className="column-title">
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: col.accent }}></span>
                  {col.title}
                </span>
                <span className="column-count">{colTasks.length}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
                {colTasks.length > 0 ? (
                  colTasks.map(task => (
                    <div key={task.id} className="kanban-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <span className={`badge ${task.priority}`}>{task.priority}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{task.category}</span>
                      </div>
                      <div className="kanban-card-title" style={{ marginTop: '0.6rem' }}>{task.title}</div>
                      {task.description && <div className="kanban-card-desc">{task.description}</div>}
                      
                      <div className="kanban-card-footer">
                        {/* Status Mover Buttons */}
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {col.id !== 'todo' && (
                            <button 
                              className="action-btn" 
                              title="Move back"
                              onClick={() => onUpdateTaskStatus(task.id, col.id === 'done' ? 'in_progress' : 'todo')}
                            >
                              ←
                            </button>
                          )}
                          {col.id !== 'done' && (
                            <button 
                              className="action-btn" 
                              title="Move forward"
                              style={{ color: 'var(--accent-cyan)' }}
                              onClick={() => onUpdateTaskStatus(task.id, col.id === 'todo' ? 'in_progress' : 'done')}
                            >
                              →
                            </button>
                          )}
                        </div>
                        {/* Delete Button */}
                        <button 
                          className="action-btn delete" 
                          title="Delete task"
                          onClick={() => onDeleteTask(task.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    border: '1px dashed var(--glass-border)', 
                    borderRadius: 'var(--radius-md)', 
                    padding: '2rem 1rem', 
                    textAlign: 'center', 
                    color: 'var(--text-muted)', 
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyCenter: 'center',
                    flexGrow: 1
                  }}>
                    Empty Column
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Creation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Create New Task</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Task Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="What needs to be done?" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Provide context or details..." 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="form-control" value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                    <option value="health">Health</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
