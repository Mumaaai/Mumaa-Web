-- OpsBoard Database Schema (SQLite)
-- Integrated with Mumaa-Web ecosystem

DROP TABLE IF EXISTS ops_activity_logs;
DROP TABLE IF EXISTS ops_task_comments;
DROP TABLE IF EXISTS ops_tasks;
DROP TABLE IF EXISTS ops_team_projects;
DROP TABLE IF EXISTS ops_projects;
DROP TABLE IF EXISTS ops_teams;

-- 1. Ops Teams
CREATE TABLE IF NOT EXISTS ops_teams (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    purpose TEXT,
    lead_id TEXT, -- References employees(id)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lead_id) REFERENCES employees(id)
);

-- 2. Ops Projects
CREATE TABLE IF NOT EXISTS ops_projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_id TEXT, -- References employees(id)
    status TEXT CHECK( status IN ('Active', 'Paused', 'Completed', 'Archived') ) DEFAULT 'Active',
    progress INTEGER DEFAULT 0,
    start_date DATE,
    deadline DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES employees(id)
);

-- 3. Team-Project Mapping (Many-to-Many)
CREATE TABLE IF NOT EXISTS ops_team_projects (
    team_id TEXT,
    project_id TEXT,
    PRIMARY KEY (team_id, project_id),
    FOREIGN KEY (team_id) REFERENCES ops_teams(id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES ops_projects(id) ON DELETE CASCADE
);

-- 4. Ops Tasks
CREATE TABLE IF NOT EXISTS ops_tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT, -- References users(id)
    assigned_by TEXT, -- References users(id)
    team_id TEXT,
    project_id TEXT,
    status TEXT CHECK( status IN ('Draft', 'Assigned', 'In Progress', 'Review', 'Changes Requested', 'Blocked', 'Completed', 'Archived') ) DEFAULT 'Draft',
    priority TEXT CHECK( priority IN ('Low', 'Medium', 'High', 'Urgent') ) DEFAULT 'Medium',
    progress INTEGER DEFAULT 0,
    start_date DATE,
    deadline DATE,
    estimated_hours REAL,
    actual_hours REAL,
    tags TEXT, -- Comma-separated
    drive_links TEXT, -- JSON or Comma-separated
    remarks TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES employees(id),
    FOREIGN KEY (assigned_by) REFERENCES employees(id),
    FOREIGN KEY (team_id) REFERENCES ops_teams(id),
    FOREIGN KEY (project_id) REFERENCES ops_projects(id)
);

-- 5. Task Comments
CREATE TABLE IF NOT EXISTS ops_task_comments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES ops_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES employees(id)
);

-- 6. Ops Activity Logs
CREATE TABLE IF NOT EXISTS ops_activity_logs (
    id TEXT PRIMARY KEY,
    task_id TEXT,
    user_id TEXT NOT NULL,
    action TEXT NOT NULL, -- e.g., 'Status Changed', 'Task Created', 'Comment Added'
    details TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES ops_tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES employees(id)
);

-- 7. Employees (Internal Staff - Independent Auth)
CREATE TABLE IF NOT EXISTS employees (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    designation TEXT,
    department TEXT,
    role TEXT CHECK( role IN ('Admin', 'Manager', 'Developer', 'Designer', 'QA', 'Marketing', 'Support') ) DEFAULT NULL,
    status TEXT CHECK( status IN ('Pending', 'Approved', 'Rejected', 'Active', 'Inactive') ) DEFAULT 'Pending',
    
    -- Professional Details
    employee_id TEXT UNIQUE,
    phone_number TEXT,
    date_of_birth DATE,
    address TEXT,
    emergency_contact TEXT,
    profile_picture TEXT,
    
    -- Employment Status
    joining_date DATE DEFAULT (date('now')),
    onboarded BOOLEAN DEFAULT FALSE,
    
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS ops_events (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    event_type TEXT CHECK( event_type IN ('Meeting', 'Event', 'Reminder') ) DEFAULT 'Event',
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    location TEXT,
    attendees TEXT,
    created_by TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES employees(id)
);

-- 1. Chat Channels (For group/team communications)
CREATE TABLE IF NOT EXISTS ops_chat_channels (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    is_private BOOLEAN DEFAULT FALSE,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Channel Members (Who is in which channel)
CREATE TABLE IF NOT EXISTS ops_chat_channel_members (
    channel_id TEXT,
    user_id TEXT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (channel_id, user_id)
);

-- 3. Chat Messages (Handles both Channel and Direct Messages)
CREATE TABLE IF NOT EXISTS ops_chat_messages (
    id TEXT PRIMARY KEY,
    channel_id TEXT, -- NULL if it is a Direct Message
    sender_id TEXT NOT NULL,
    receiver_id TEXT, -- NULL if it is a Channel message
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ops_notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL, -- The specific person getting notified
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK( type IN ('Task', 'Comment', 'Project', 'Alert') ),
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES employees(id)
);
