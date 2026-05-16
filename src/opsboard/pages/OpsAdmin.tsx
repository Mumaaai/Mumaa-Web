import React, { useState, useEffect } from 'react';
import OpsLayout from '../components/OpsLayout';
import { api } from '../../api';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Shield, 
  Mail, 
  Briefcase,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Check,
  X,
  Plus,
  Pencil,
  Calendar
} from 'lucide-react';

const CreateTeamModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => Promise<void>; staff: any[] }> = ({ isOpen, onClose, onSubmit, staff }) => {
  const [formData, setFormData] = useState({ name: '', purpose: '', lead_id: '' });
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Team</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Name</label>
            <input 
              placeholder="e.g. Frontend Engineering" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Purpose</label>
            <textarea 
              placeholder="What does this team do?" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 h-24 resize-none"
              value={formData.purpose}
              onChange={e => setFormData({...formData, purpose: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Lead</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
              value={formData.lead_id}
              onChange={e => setFormData({...formData, lead_id: e.target.value})}
            >
              <option value="">Select Team Lead</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
          <button 
            disabled={loading || !formData.name}
            onClick={async () => { setLoading(true); await onSubmit(formData); setLoading(false); onClose(); }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CreateProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => Promise<void>; staff: any[] }> = ({ isOpen, onClose, onSubmit, staff }) => {
  const [formData, setFormData] = useState({ name: '', description: '', owner_id: '', deadline: '' });
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Start New Project</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Name</label>
            <input 
              placeholder="e.g. AI Content Generator" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
            <textarea 
              placeholder="What is this project about?" 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 h-24 resize-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Owner</label>
            <select 
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
              value={formData.owner_id}
              onChange={e => setFormData({...formData, owner_id: e.target.value})}
            >
              <option value="">Select Project Owner</option>
              {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Target Deadline</label>
            <input 
              type="date"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>
          <button 
            disabled={loading || !formData.name}
            onClick={async () => { setLoading(true); await onSubmit(formData); setLoading(false); onClose(); }}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Starting Project...' : 'Launch Project'}
          </button>
        </div>
      </div>
    </div>
  );
};

const EditStaffModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  onSubmit: (id: string, data: any) => Promise<void>; 
  staff: any 
}> = ({ isOpen, onClose, onSubmit, staff }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    designation: '',
    department: '',
    role: '',
    status: '',
    employee_id: '',
    phone_number: '',
    joining_date: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        full_name: staff.full_name || '',
        designation: staff.designation || '',
        department: staff.department || '',
        role: staff.role || '',
        status: staff.status || '',
        employee_id: staff.employee_id || '',
        phone_number: staff.phone_number || '',
        joining_date: staff.joining_date || '',
        address: staff.address || ''
      });
    }
  }, [staff]);

  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Staff Profile</h2>
            <p className="text-xs text-gray-500 mt-1">Updating information for {staff.full_name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Personal Info</label>
              <input 
                placeholder="Full Name" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
              <input 
                placeholder="Phone Number" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                value={formData.phone_number}
                onChange={e => setFormData({...formData, phone_number: e.target.value})}
              />
              <textarea 
                placeholder="Address" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50 h-24 resize-none"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">Employment Details</label>
              <div className="flex gap-2">
                <input 
                  placeholder="Employee ID" 
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                  value={formData.employee_id}
                  onChange={e => setFormData({...formData, employee_id: e.target.value})}
                />
                <button 
                  onClick={() => setFormData({...formData, employee_id: generateEmployeeId(formData.department)})}
                  className="px-4 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold hover:bg-stone-200 transition-all"
                  title="Auto-generate from Dept"
                >
                  Gen
                </button>
              </div>
              <input 
                placeholder="Designation (e.g. Senior Dev)" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                value={formData.designation}
                onChange={e => setFormData({...formData, designation: e.target.value})}
              />
              <select 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                value={formData.department}
                onChange={e => setFormData({...formData, department: e.target.value})}
              >
                <option value="">Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Product">Product</option>
                <option value="Operations">Operations</option>
                <option value="HR">HR</option>
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="">Assign Role</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="QA">QA</option>
                </select>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-50"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            disabled={loading}
            onClick={async () => { setLoading(true); await onSubmit(staff.id, formData); setLoading(false); onClose(); }}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Saving Changes...' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

const generateEmployeeId = (dept: string) => {
  if (!dept) return '';
  const prefix = dept.substring(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
};

const ViewStaffModal: React.FC<{ isOpen: boolean; onClose: () => void; staff: any }> = ({ isOpen, onClose, staff }) => {
  if (!isOpen || !staff) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-black text-gray-400 border border-gray-200">
              {staff.full_name?.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{staff.full_name}</h2>
              <p className="text-sm text-gray-500 font-medium">{staff.designation || 'Staff Member'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-600">Employment</h3>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Employee ID</p>
              <p className="text-sm font-bold text-gray-800">{staff.employee_id || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Department</p>
              <p className="text-sm font-bold text-gray-800">{staff.department || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Status</p>
              <p className="text-sm font-bold text-blue-600">{staff.status}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Contact</h3>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
              <p className="text-sm font-bold text-gray-800">{staff.email}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
              <p className="text-sm font-bold text-gray-800">{staff.phone_number || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Joined</p>
              <p className="text-sm font-bold text-gray-800">{staff.joined_at ? new Date(staff.joined_at).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
          
          <div className="col-span-2 pt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Address</p>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mt-1">{staff.address || 'No address provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewTeamModal: React.FC<{ isOpen: boolean; onClose: () => void; team: any; staff: any[]; onUpdate: (id: string, data: any) => Promise<void> }> = ({ isOpen, onClose, team, staff, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', purpose: '', lead_id: '' });
  
  useEffect(() => {
    if (team) setFormData({ name: team.name, purpose: team.purpose, lead_id: team.lead_id || '' });
  }, [team]);

  if (!isOpen || !team) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Team' : 'Team Details'}</h2>
          <div className="flex gap-2">
            {!isEditing && <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-xs">
              <Pencil size={14} /> Edit
            </button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Name</label>
                <input 
                  placeholder="Team Name" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Purpose</label>
                <textarea 
                  placeholder="Purpose" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none"
                  value={formData.purpose}
                  onChange={e => setFormData({...formData, purpose: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Team Lead</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.lead_id}
                  onChange={e => setFormData({...formData, lead_id: e.target.value})}
                >
                  <option value="">Select Lead</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <button 
                onClick={async () => { await onUpdate(team.id, formData); setIsEditing(false); }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Team Name</p>
                <p className="text-lg font-bold text-gray-900">{team.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Lead</p>
                <p className="text-sm font-bold text-gray-800">{team.lead_name || 'No Lead'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Purpose</p>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{team.purpose}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ViewProjectModal: React.FC<{ isOpen: boolean; onClose: () => void; project: any; staff: any[]; onUpdate: (id: string, data: any) => Promise<void> }> = ({ isOpen, onClose, project, staff, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', owner_id: '', deadline: '' });
  
  useEffect(() => {
    if (project) setFormData({ name: project.name, description: project.description, owner_id: project.owner_id || '', deadline: project.deadline || '' });
  }, [project]);

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Project' : 'Project Details'}</h2>
          <div className="flex gap-2">
            {!isEditing && <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-all text-xs">
              <Pencil size={14} /> Edit
            </button>}
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="space-y-4">
          {isEditing ? (
            <>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Name</label>
                <input 
                  placeholder="Project Name" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Description</label>
                <textarea 
                  placeholder="Description" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl h-24 resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Project Owner</label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.owner_id}
                  onChange={e => setFormData({...formData, owner_id: e.target.value})}
                >
                  <option value="">Select Owner</option>
                  {staff.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Target Deadline</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                />
              </div>
              <button 
                onClick={async () => { await onUpdate(project.id, formData); setIsEditing(false); }}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all mt-4"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Project Name</p>
                <p className="text-lg font-bold text-gray-900">{project.name}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Owner</p>
                <p className="text-sm font-bold text-gray-800">{project.owner_name || 'No Owner'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Deadline</p>
                <p className="text-sm font-bold text-blue-600">{project.deadline || 'No deadline'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Description</p>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">{project.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const OpsAdmin: React.FC = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'staff' | 'teams' | 'projects'>('staff');
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isTeamViewOpen, setIsTeamViewOpen] = useState(false);
  const [isProjectViewOpen, setIsProjectViewOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [empData, teamData, projData] = await Promise.all([
        api.get('/ops/admin/employees'),
        api.get('/ops/teams'),
        api.get('/ops/projects')
      ]);

      if (Array.isArray(empData)) setEmployees(empData);
      if (Array.isArray(teamData)) setTeams(teamData);
      if (Array.isArray(projData)) setProjects(projData);
      
      setError(null);
    } catch (err) {
      setError('Failed to fetch operational records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/ops/admin/employee/${id}`, { status });
      await fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      await api.put(`/ops/admin/employee/${id}`, { role });
      await fetchData();
    } catch (err) {
      console.error('Failed to update role', err);
    }
  };

  const handleUpdateStaff = async (id: string, data: any) => {
    try {
      await api.put(`/ops/admin/employee/${id}`, data);
      await fetchData();
    } catch (err) {
      console.error('Failed to update staff', err);
    }
  };

  const handleCreateTeam = async (data: any) => {
    try {
      await api.post('/ops/admin/teams', data);
      await fetchData();
    } catch (err) {
      console.error('Failed to create team', err);
    }
  };

  const handleUpdateTeam = async (id: string, data: any) => {
    try {
      await api.put(`/ops/admin/teams/${id}`, data);
      await fetchData();
    } catch (err) {
      console.error('Failed to update team', err);
    }
  };

  const handleCreateProject = async (data: any) => {
    try {
      await api.post('/ops/admin/projects', data);
      await fetchData();
    } catch (err) {
      console.error('Failed to create project', err);
    }
  };

  const handleUpdateProject = async (id: string, data: any) => {
    try {
      await api.put(`/ops/admin/projects/${id}`, data);
      await fetchData();
    } catch (err) {
      console.error('Failed to update project', err);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && employees.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <OpsLayout user={currentUser}>
      <main className="p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Management Console</h1>
              <p className="text-gray-500 mt-1">Configure teams, projects, and manage staff access.</p>
              
              <div className="flex gap-6 mt-8">
                {[
                  { id: 'staff', label: 'Staff Management', icon: Users },
                  { id: 'teams', label: 'Teams', icon: Shield },
                  { id: 'projects', label: 'Projects', icon: Briefcase }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 pb-4 px-1 text-sm font-bold transition-all border-b-2 ${
                      activeTab === tab.id 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-4 pb-4">
               {activeTab === 'staff' && (
                 <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                     type="text"
                     placeholder="Search staff..."
                     className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                     value={searchTerm}
                     onChange={e => setSearchTerm(e.target.value)}
                   />
                 </div>
               )}
               {activeTab !== 'staff' && (
                 <button 
                   onClick={() => activeTab === 'teams' ? setIsTeamModalOpen(true) : setIsProjectModalOpen(true)}
                   className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md transition-all flex items-center gap-2"
                 >
                   <Plus size={18} />
                   Create {activeTab.slice(0, -1)}
                 </button>
               )}
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500 min-h-[400px]">
            {activeTab === 'staff' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4 font-black">Staff Member</th>
                      <th className="px-6 py-4 font-black">Status</th>
                      <th className="px-6 py-4 font-black">Department</th>
                      <th className="px-6 py-4 font-black">Current Role</th>
                      <th className="px-6 py-4 font-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 cursor-pointer" onClick={() => { setSelectedStaff(emp); setIsViewModalOpen(true); }}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-500 border border-stone-200 group-hover:border-blue-200 transition-all">
                              {emp.full_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{emp.full_name}</p>
                              <p className="text-xs text-gray-500">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            emp.status === 'Approved' || emp.status === 'Active' ? 'bg-green-100 text-green-700' :
                            emp.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{emp.department || 'Unassigned'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-gray-600 hover:text-blue-600 transition-colors"
                            value={emp.role || ''}
                            onChange={(e) => handleUpdateRole(emp.id, e.target.value)}
                          >
                            <option value="">No Role Assigned</option>
                            <option value="Admin">Admin</option>
                            <option value="Manager">Manager</option>
                            <option value="Developer">Developer</option>
                            <option value="Designer">Designer</option>
                            <option value="QA">QA</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {emp.status === 'Pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(emp.id, 'Approved')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve Staff"
                                >
                                  <Check size={18} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(emp.id, 'Rejected')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject Staff"
                                >
                                  <X size={18} />
                                </button>
                              </>
                            )}
                            <button 
                              onClick={() => { setSelectedStaff(emp); setIsEditModalOpen(true); }}
                              className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Profile"
                            >
                              <Briefcase size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'teams' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4 font-black">Team Name</th>
                      <th className="px-6 py-4 font-black">Lead</th>
                      <th className="px-6 py-4 font-black">Purpose</th>
                      <th className="px-6 py-4 font-black">Members</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {teams.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">No teams found. Click "Create Team" to start.</td></tr>
                    ) : teams.map((team) => (
                      <tr 
                        key={team.id} 
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedTeam(team); setIsTeamViewOpen(true); }}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                              <Shield size={18} />
                            </div>
                            <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{team.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{team.lead_name || 'No Lead'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-500 max-w-xs truncate">{team.purpose}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">
                                {i}
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                      <th className="px-6 py-4 font-black">Project</th>
                      <th className="px-6 py-4 font-black">Owner</th>
                      <th className="px-6 py-4 font-black">Deadline</th>
                      <th className="px-6 py-4 font-black">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 text-sm">No active projects found.</td></tr>
                    ) : projects.map((proj) => (
                      <tr 
                        key={proj.id} 
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedProject(proj); setIsProjectViewOpen(true); }}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{proj.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{proj.description?.substring(0, 30)}...</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600 font-medium">{proj.owner_name || 'Assignee Pending'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-bold text-gray-500">{proj.deadline || 'No Deadline'}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Active</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <ViewStaffModal 
        isOpen={isViewModalOpen} 
        onClose={() => { setIsViewModalOpen(false); setSelectedStaff(null); }} 
        staff={selectedStaff}
      />

      <ViewTeamModal 
        isOpen={isTeamViewOpen} 
        onClose={() => { setIsTeamViewOpen(false); setSelectedTeam(null); }} 
        team={selectedTeam}
        staff={employees}
        onUpdate={handleUpdateTeam}
      />

      <ViewProjectModal 
        isOpen={isProjectViewOpen} 
        onClose={() => { setIsProjectViewOpen(false); setSelectedProject(null); }} 
        project={selectedProject}
        staff={employees}
        onUpdate={handleUpdateProject}
      />

      <EditStaffModal 
        isOpen={isEditModalOpen} 
        onClose={() => { setIsEditModalOpen(false); setSelectedStaff(null); }} 
        onSubmit={handleUpdateStaff}
        staff={selectedStaff}
      />

      <CreateTeamModal 
        isOpen={isTeamModalOpen} 
        onClose={() => setIsTeamModalOpen(false)} 
        onSubmit={handleCreateTeam}
        staff={employees.filter(e => e.status === 'Approved' || e.status === 'Active')}
      />

      <CreateProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        onSubmit={handleCreateProject}
        staff={employees.filter(e => e.status === 'Approved' || e.status === 'Active')}
      />
    </OpsLayout>
  );
};

export default OpsAdmin;
