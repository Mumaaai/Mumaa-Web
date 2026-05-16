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
