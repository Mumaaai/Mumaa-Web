import React from 'react';
import { Clock, AlertCircle, CheckCircle2, MoreHorizontal } from 'lucide-react';
import type { Task } from '../types';

interface TaskTableProps {
  tasks: Task[];
  users: any[];
  onTaskClick: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, users, onTaskClick }) => {
  const priorityStyles = {
    Low: 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-200 border-slate-200 dark:border-white/10',
    Medium: 'bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-200 border-cyan-200 dark:border-cyan-500/20',
    High: 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-200 border-amber-200 dark:border-amber-500/20',
    Urgent: 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-200 border-rose-200 dark:border-rose-500/20',
  };

  const statusIcons = {
    'Draft': <Clock className="text-slate-400" size={16} />,
    'Assigned': <Clock className="text-cyan-500 dark:text-cyan-400" size={16} />,
    'In Progress': <Clock className="text-cyan-400 dark:text-cyan-300" size={16} />,
    'Review': <AlertCircle className="text-amber-500 dark:text-amber-400" size={16} />,
    'Changes Requested': <AlertCircle className="text-yellow-500 dark:text-yellow-300" size={16} />,
    'Blocked': <AlertCircle className="text-rose-500 dark:text-rose-400" size={16} />,
    'Completed': <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={16} />,
    'Archived': <AlertCircle className="text-slate-400 dark:text-slate-500" size={16} />,
  };

  return (
    <div className="bg-white/60 dark:bg-slate-950/60 rounded-[1.75rem] shadow-lg dark:shadow-[0_18px_50px_rgba(2,6,23,0.35)] border border-slate-200 dark:border-white/10 overflow-hidden text-slate-800 dark:text-slate-100 backdrop-blur-xl">
      <div className="p-5 md:p-6 border-b border-slate-200 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white">Tasks</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tasks.length} items in view</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.26em] font-black border-b border-slate-200 dark:border-white/10">
              <th className="px-6 py-4">Task</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Assignee</th>
              <th className="px-6 py-4">Due</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/8">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="max-w-xs mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">No tasks in this view.</p>
                  </div>
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr 
                  key={task.id} 
                  className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{task.id.slice(0, 8)}</p>
                      {task.tags ? task.tags.split(',').slice(0, 3).map((tag: string) => (
                        <span key={tag} className="text-[10px] bg-slate-100 dark:bg-white/8 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300 font-bold border border-slate-200 dark:border-white/10">{tag.trim()}</span>
                      )) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.22em] border ${priorityStyles[task.priority]}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      {statusIcons[task.status]}
                      {task.status}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {task.assignees ? (
                      <div className="flex flex-wrap gap-1">
                        {task.assignees.split(',').slice(0, 2).map((id) => {
                          const u = users.find(user => user.id === id);
                          return (
                            <span key={id} className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg truncate max-w-[100px]" title={u?.full_name}>
                              {u?.full_name?.split(' ')[0] || 'Unknown'}
                            </span>
                          );
                        })}
                        {task.assignees.split(',').length > 2 && (
                          <span className="px-2 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg">
                            +{task.assignees.split(',').length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 font-semibold">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      {task.deadline ? new Date(task.deadline).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'NO DEADLINE'}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 rounded-xl transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
