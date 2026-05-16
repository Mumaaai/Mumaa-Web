import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../../api';
import type { Task, Project, Team, User } from '../types';
import mockData from '../mock/mockData';

const OpsDataContext = createContext<any>(null);

export const OpsDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [employee, setEmployee] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (session) {
      setUser(JSON.parse(session));
    }
  }, []);

  const checkEmployeeProfile = async (userId: string) => {
    try {
      const profile = await api.get(`/ops/employee/profile/${userId}`);
      // If profile is empty (meaning user was deleted from DB but session exists)
      if (!profile || profile.error) {
        localStorage.removeItem('ops_session');
        return null;
      }
      setEmployee(profile);
      return profile;
    } catch (err) {
      console.error('Failed to check employee profile', err);
      return null;
    }
  };

  const onboardEmployee = async (data: any) => {
    try {
      await api.post('/ops/employee/onboard', data);
      await checkEmployeeProfile(data.user_id);
    } catch (err) {
      console.error('Failed to onboard employee', err);
      throw err;
    }
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const session = localStorage.getItem('ops_session');
      if (session) {
        const user = JSON.parse(session);
        await checkEmployeeProfile(user.id);
      }

      const [tasksRes, projectsRes, teamsRes, usersRes, eventsRes] = await Promise.all([
        api.get('/ops/tasks'),
        api.get('/ops/projects'),
        api.get('/ops/teams'),
        api.get('/ops/users'),
        api.get('/ops/events')
      ]);

      if (Array.isArray(tasksRes)) setTasks(tasksRes);
      if (Array.isArray(projectsRes)) setProjects(projectsRes);
      if (Array.isArray(teamsRes)) setTeams(teamsRes);
      if (Array.isArray(usersRes)) setUsers(usersRes);
      if (Array.isArray(eventsRes)) setEvents(eventsRes);
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch operational data from API, falling back to mock data', err);
      // Fallback to bundled mock data so the UI remains usable during development
      setTasks(mockData.tasks as Task[]);
      setProjects(mockData.projects as Project[]);
      setTeams(mockData.teams as Team[]);
      setUsers(mockData.users as User[]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const session = localStorage.getItem('ops_session');
      const currentUser = session ? JSON.parse(session) : null;
      // Optimistic UI: add a temporary task locally before API call
      const tempId = `tmp-${Date.now()}`;
      const tempTask: Task = {
        id: tempId,
        title: (taskData.title as string) || 'Untitled',
        description: (taskData.description as string) || '',
        assigned_to: (taskData.assigned_to as string) || '',
        assigned_by: currentUser?.id || null,
        team_id: (taskData.team_id as string) || '',
        project_id: (taskData.project_id as string) || '',
        status: (taskData.status as any) || 'Draft',
        priority: (taskData.priority as any) || 'Medium',
        progress: (taskData.progress as number) || 0,
        start_date: (taskData.start_date as any) || '',
        deadline: (taskData.deadline as any) || '',
        estimated_hours: (taskData.estimated_hours as any) || 0,
        actual_hours: (taskData.actual_hours as any) || 0,
        tags: (taskData.tags as any) || '',
        drive_links: (taskData.drive_links as any) || '',
        remarks: (taskData.remarks as any) || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as Task;

      setTasks(prev => [tempTask, ...prev]);

      try {
        const res = await api.post('/ops/tasks', {
          ...taskData,
          assigned_by: currentUser?.id
        });
        // Replace temp task with real one or refresh
        if (res?.id) {
          await fetchData();
        } else {
          await fetchData();
        }
      } catch (err) {
        // Revert optimistic update on failure
        setTasks(prev => prev.filter(t => t.id !== tempId));
        console.error('Failed to create task', err);
        throw err;
      }
    } catch (err) {
      console.error('Failed to create task', err);
    }
  };

  const createProject = async (projectData: Partial<Project>) => {
    try {
      const res = await api.post('/ops/projects', projectData);
      if (res?.id) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to create project', err);
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } as Project : p));
      await api.put(`/ops/projects/${id}`, updates);
      fetchData(true);
    } catch (err) {
      console.error('Failed to update project', err);
      fetchData(true); // Revert
      throw err;
    }
  };

  const createTeam = async (teamData: Partial<Team>) => {
    try {
      const res = await api.post('/ops/admin/teams', teamData);
      if (res?.id) {
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to create team', err);
      throw err;
    }
  };

  const updateTeam = async (id: string, updates: Partial<Team>) => {
    try {
      setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
      await api.put(`/ops/admin/teams/${id}`, updates);
      fetchData(true);
    } catch (err) {
      console.error('Failed to update team', err);
      fetchData(true);
      throw err;
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const session = localStorage.getItem('ops_session');
      const currentUser = session ? JSON.parse(session) : null;
      const res = await api.post('/ops/events', { ...eventData, created_by: currentUser?.id });
      if (res?.id) {
        await fetchData(true);
      }
    } catch (err) {
      console.error('Failed to create event', err);
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: any) => {
    try {
      setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      await api.put(`/ops/events/${id}`, updates);
      fetchData(true);
    } catch (err) {
      console.error('Failed to update event', err);
      fetchData(true);
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      setEvents(prev => prev.filter(e => e.id !== id));
      await api.delete(`/ops/events/${id}`);
      fetchData(true);
    } catch (err) {
      console.error('Failed to delete event', err);
      fetchData(true);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Optimistic UI: apply update locally first
      let previous: Task | null = null;
      setTasks(prev => {
        return prev.map(t => {
          if (t.id === id) {
            previous = { ...t };
            return { ...t, ...updates } as Task;
          }
          return t;
        });
      });

      try {
        await api.put(`/ops/tasks/${id}`, updates);
        fetchData(true);
      } catch (err) {
        // Revert on failure
        if (previous) {
          setTasks(prev => prev.map(t => t.id === id ? previous! : t));
        }
        console.error('Failed to update task', err);
        throw err;
      }
    } catch (err) {
      console.error('Failed to update task', err);
    }
  };

  const addComment = async (taskId: string, content: string) => {
    try {
      const session = localStorage.getItem('ops_session');
      const currentUser = session ? JSON.parse(session) : null;
      if (!currentUser) return;

      await api.post(`/ops/tasks/${taskId}/comments`, { 
        user_id: currentUser.id,
        content 
      });
    } catch (err) {
      console.error('Failed to add comment', err);
      throw err;
    }
  };

  const fetchComments = async (taskId: string) => {
    try {
      return await api.get(`/ops/tasks/${taskId}/comments`);
    } catch (err) {
      console.error('Failed to fetch comments', err);
      return [];
    }
  };

  return (
    <OpsDataContext.Provider value={{
      tasks,
      projects,
      teams,
      events,
      users,
      employee,
      user,
      loading,
      error,
      refresh: fetchData,
      createTask,
      updateTask,
      createProject,
      updateProject,
      createTeam,
      updateTeam,
      createEvent,
      updateEvent,
      deleteEvent,
      addComment,
      fetchComments,
      onboardEmployee
    }}>
      {children}
    </OpsDataContext.Provider>
  );
};

export const useOpsData = () => {
  const context = useContext(OpsDataContext);
  if (!context) {
    throw new Error('useOpsData must be used within an OpsDataProvider');
  }
  return context;
};
