import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OpsLayout from '../components/OpsLayout';
import { useOpsData } from '../hooks/useOpsData';
import { 
  User, 
  Lock, 
  Bell, 
  Palette, 
  Shield, 
  Save,
  Mail,
  Phone,
  Briefcase,
  Camera,
  Edit2,
  X,
  Calendar,
  MapPin,
  Heart,
  BadgeCheck,
  Clock
} from 'lucide-react';
import { api } from '../../api';

const OpsSettings: React.FC = () => {
  const { user, employee, refresh } = useOpsData();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');
  const [isEditing, setIsEditing] = useState(false);

  // Form States (Pre-filled with employee data from hook)
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
    emergency_contact: '',
    profile_picture: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('ops_session');
    if (!session) {
      navigate('/opsboard/auth');
    } else {
      setCurrentUser(JSON.parse(session));
    }
  }, [navigate]);

  useEffect(() => {
    if (employee) {
      setProfileForm({
        full_name: employee.full_name || '',
        phone_number: employee.phone_number || '',
        date_of_birth: employee.date_of_birth || '',
        address: employee.address || '',
        emergency_contact: employee.emergency_contact || '',
        profile_picture: employee.profile_picture || ''
      });
    }
  }, [employee]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/ops/employee/profile/${employee.id}`, profileForm);
      alert('Profile updated successfully!');
      setIsEditing(false);
      refresh(); // Refresh data
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Password updated! (Demo)');
  };

  const infoLabelClass = "text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider";
  const infoValueClass = "text-sm font-bold text-slate-800 dark:text-white mt-1";

  return (
    <OpsLayout user={currentUser || user}>
      <main className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-slate-800 dark:text-slate-100 bg-transparent min-h-full">
        
        {/* Header */}
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Account Settings</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage your professional profile and security.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-2 space-y-1 shadow-sm">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'profile' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <User size={18} /> My Profile
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'account' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Lock size={18} /> Password & Security
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${activeTab === 'notifications' ? 'bg-cyan-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                <Bell size={18} /> Notifications
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-sm">
            
            {/* Profile Settings */}
            {activeTab === 'profile' && employee && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Manage your public and private details.</p>
                  </div>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 h-9 px-4 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                      <Edit2 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 h-9 px-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg transition-colors hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        <X size={14} /> Cancel
                      </button>
                      <button 
                        onClick={handleProfileSubmit}
                        className="flex items-center gap-2 h-9 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        <Save size={14} /> Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center space-y-3">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 overflow-hidden">
                        {employee.profile_picture ? (
                          <img src={employee.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User size={48} />
                        )}
                      </div>
                      {isEditing && (
                        <button type="button" className="absolute inset-0 bg-slate-900/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Camera size={20} />
                        </button>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-1 rounded-md uppercase">
                        {employee.role || 'Staff'}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    
                    {/* Read-Only Fields */}
                    <div>
                      <div className={infoLabelClass}><Mail size={12} className="inline mr-1" /> Email Address</div>
                      <div className={infoValueClass}>{employee.email}</div>
                    </div>
                    
                    <div>
                      <div className={infoLabelClass}><Briefcase size={12} className="inline mr-1" /> Designation</div>
                      <div className={infoValueClass}>{employee.designation || 'Not Set'}</div>
                    </div>

                    <div>
                      <div className={infoLabelClass}><Shield size={12} className="inline mr-1" /> Department</div>
                      <div className={infoValueClass}>{employee.department || 'Not Set'}</div>
                    </div>

                    <div>
                      <div className={infoLabelClass}><BadgeCheck size={12} className="inline mr-1" /> Employee ID</div>
                      <div className={infoValueClass}>{employee.employee_id || 'Not Assigned'}</div>
                    </div>

                    <div>
                      <div className={infoLabelClass}><Clock size={12} className="inline mr-1" /> Joining Date</div>
                      <div className={infoValueClass}>{employee.joining_date || 'Not Available'}</div>
                    </div>

                    {/* Divider */}
                    <div className="col-span-1 md:col-span-2 border-t border-slate-100 dark:border-white/5 my-2"></div>

                    {/* Editable or View Fields */}
                    <div>
                      <div className={infoLabelClass}><User size={12} className="inline mr-1" /> Full Name</div>
                      {isEditing ? (
                        <input 
                          type="text"
                          className="w-full h-10 mt-1 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                          value={profileForm.full_name}
                          onChange={e => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        />
                      ) : (
                        <div className={infoValueClass}>{employee.full_name}</div>
                      )}
                    </div>

                    <div>
                      <div className={infoLabelClass}><Phone size={12} className="inline mr-1" /> Phone Number</div>
                      {isEditing ? (
                        <input 
                          type="text"
                          className="w-full h-10 mt-1 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                          value={profileForm.phone_number}
                          onChange={e => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                        />
                      ) : (
                        <div className={infoValueClass}>{employee.phone_number || 'Not Set'}</div>
                      )}
                    </div>

                    <div>
                      <div className={infoLabelClass}><Calendar size={12} className="inline mr-1" /> Date of Birth</div>
                      {isEditing ? (
                        <input 
                          type="date"
                          className="w-full h-10 mt-1 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                          value={profileForm.date_of_birth}
                          onChange={e => setProfileForm({ ...profileForm, date_of_birth: e.target.value })}
                        />
                      ) : (
                        <div className={infoValueClass}>{employee.date_of_birth || 'Not Set'}</div>
                      )}
                    </div>

                    <div>
                      <div className={infoLabelClass}><Heart size={12} className="inline mr-1" /> Emergency Contact</div>
                      {isEditing ? (
                        <input 
                          type="text"
                          className="w-full h-10 mt-1 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                          value={profileForm.emergency_contact}
                          onChange={e => setProfileForm({ ...profileForm, emergency_contact: e.target.value })}
                          placeholder="Name / Phone"
                        />
                      ) : (
                        <div className={infoValueClass}>{employee.emergency_contact || 'Not Set'}</div>
                      )}
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <div className={infoLabelClass}><MapPin size={12} className="inline mr-1" /> Address</div>
                      {isEditing ? (
                        <textarea 
                          className="w-full h-20 mt-1 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                          value={profileForm.address}
                          onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                          placeholder="Full residential address"
                        />
                      ) : (
                        <div className={infoValueClass}>{employee.address || 'Not Set'}</div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === 'account' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Update Password</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Ensure your account is using a long, random password to stay secure.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Current Password</label>
                    <input 
                      type="password"
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">New Password</label>
                    <input 
                      type="password"
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Confirm New Password</label>
                    <input 
                      type="password"
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5">
                  <button 
                    type="submit"
                    className="flex items-center gap-2 h-10 px-6 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                  >
                    <Shield size={14} /> Update Password
                  </button>
                </div>
              </form>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Notification Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Choose how you want to be alerted about updates.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Email Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Receive daily summaries and urgent alerts via email.</p>
                    </div>
                    <div className="relative inline-block w-10 h-6">
                      <input type="checkbox" className="peer sr-only" id="email-notif" defaultChecked />
                      <label htmlFor="email-notif" className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer transition-colors peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4"></label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Push Notifications</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Receive real-time alerts in your browser.</p>
                    </div>
                    <div className="relative inline-block w-10 h-6">
                      <input type="checkbox" className="peer sr-only" id="push-notif" defaultChecked />
                      <label htmlFor="push-notif" className="absolute inset-0 bg-slate-300 dark:bg-slate-700 rounded-full cursor-pointer transition-colors peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-transform peer-checked:after:translate-x-4"></label>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </main>
    </OpsLayout>
  );
};

export default OpsSettings;
