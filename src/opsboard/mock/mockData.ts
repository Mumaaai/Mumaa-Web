// Lightweight mock data for OpsBoard UI during development
import type { Task, Project, Team, User } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', full_name: 'Amina Noor', email: 'amina@mumaa.ai' },
  { id: 'u2', full_name: 'David Okoro', email: 'david@mumaa.ai' },
  { id: 'u3', full_name: 'Rita Gomez', email: 'rita@mumaa.ai' }
];

export const mockTeams: Team[] = [
  { id: 't1', name: 'Development', purpose: 'Product engineering', lead_id: '' },
  { id: 't2', name: 'Operations', purpose: 'Coordination & execution', lead_id: '' }
];

export const mockProjects: Project[] = [
  { id: 'p1', name: 'Website Refresh', description: 'Landing and marketing pages', owner_id: 'u1', status: 'Active', progress: 30, deadline: '' },
  { id: 'p2', name: 'Ops Migration', description: 'Migrate ops workflows', owner_id: 'u2', status: 'Active', progress: 12, deadline: '' }
];

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    title: 'Update landing hero copy',
    description: 'Refresh hero copy to match new campaign',
    assigned_to: 'u1',
    assigned_by: 'u2',
    team_id: 't1',
    project_id: 'p1',
    status: 'In Progress',
    priority: 'Medium',
    progress: 45,
    start_date: '',
    deadline: '',
    estimated_hours: 2,
    actual_hours: 1.5,
    tags: 'copy,landing',
    drive_links: '',
    remarks: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'task-002',
    title: 'Prepare ops onboarding checklist',
    description: 'Create a standardized checklist for new hires',
    assigned_to: 'u3',
    assigned_by: 'u2',
    team_id: 't2',
    project_id: 'p2',
    status: 'Assigned',
    priority: 'High',
    progress: 10,
    start_date: '',
    deadline: '',
    estimated_hours: 4,
    actual_hours: 0,
    tags: 'onboarding,docs',
    drive_links: '',
    remarks: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export default {
  users: mockUsers,
  teams: mockTeams,
  projects: mockProjects,
  tasks: mockTasks
};
