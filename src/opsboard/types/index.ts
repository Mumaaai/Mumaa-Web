export type TaskStatus = 'Draft' | 'Assigned' | 'In Progress' | 'Review' | 'Changes Requested' | 'Blocked' | 'Completed' | 'Archived';
export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  team_id?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  assignees?: string;
  assigned_by: string;
  team_id: string;
  project_id: string;
  status: TaskStatus;
  priority: Priority;
  progress: number;
  start_date?: string;
  deadline: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags?: string;
  drive_links?: string;
  remarks?: string;
  created_at: string;
  updated_at: string;
  assignee_name?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  status: string;
  progress: number;
  deadline: string;
}

export type EventType = 'Meeting' | 'Event' | 'Reminder';

export interface Event {
  id: string;
  title: string;
  description: string;
  event_type: EventType;
  start_time: string;
  end_time: string;
  location: string;
  attendees: string;
  created_by: string;
}

export interface Team {
  id: string;
  name: string;
  purpose: string;
  lead_id: string;
  members?: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}
