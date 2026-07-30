'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, Terminal, LogOut, Plus, Trash2, Edit2, GripVertical, Check, AlertCircle, Save, ArrowLeft, Image as ImageIcon, Upload, Loader2, Award, User, Briefcase, GraduationCap, Sparkles, FolderOpen 
} from 'lucide-react';
import Link from 'next/link';
import { 
  login, logout, checkAuth, getPortfolioData, saveProjects, saveConfig, uploadImage, uploadProfileImage 
} from './actions';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  image: string;
  githubLink?: string;
  liveLink?: string;
  featured: boolean;
  status: 'published' | 'draft';
  order: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'profile' | 'skills' | 'experience' | 'education' | 'extras'>('projects');

  const tabs = [
    { id: 'projects', label: 'Projects Gallery', icon: FolderOpen, desc: 'Drag, drop, add, or delete portfolio project cards' },
    { id: 'profile', label: 'Profile & Socials', icon: User, desc: 'Bio, contact info, photo, achievements, and social links' },
    { id: 'skills', label: 'Skills Capsules', icon: Terminal, desc: 'Manage skills categories and capsule tags' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, desc: 'Manage collapsible timeline accordion rows' },
    { id: 'education', label: 'Education Details', icon: GraduationCap, desc: 'Timeline cards for degrees, certificates, and schools' },
    { id: 'extras', label: 'Banner & Stats', icon: Sparkles, desc: 'Customize resume marquee text and statistics boxes' },
  ];
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [personalInfo, setPersonalInfo] = useState<any>({});
  const [socials, setSocials] = useState<any>({});
  const [skills, setSkills] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [marquee, setMarquee] = useState<string[]>([]);
  const [stats, setStats] = useState<any[]>([]);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingProfile, setUploadingProfile] = useState(false);

  // Drag and Drop State
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Status/Notifications
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        loadData();
      }
    };
    authenticate();
  }, []);

  const loadData = async () => {
    const data = await getPortfolioData();
    setProjects(data.projects);
    setPersonalInfo(data.personalInfo);
    setSocials(data.socials);
    setSkills(data.skills);
    setExperience(data.experience);
    setAchievements(data.achievements);
    setEducation(data.education);
    setMarquee(data.marquee || []);
    setStats(data.stats || []);
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const res = await login(password);
    if (res.success) {
      setIsAuthenticated(true);
      loadData();
    } else {
      setAuthError(res.error || 'Authentication failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
  };

  // Drag and Drop Handlers
  const handleDragStart = (id: string) => {
    setDraggingId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggingId || draggingId === targetId) return;
    
    const items = [...projects];
    const dragIdx = items.findIndex((p) => p.id === draggingId);
    const targetIdx = items.findIndex((p) => p.id === targetId);
    
    if (dragIdx === -1 || targetIdx === -1) return;

    // Shift item
    const [draggedItem] = items.splice(dragIdx, 1);
    items.splice(targetIdx, 0, draggedItem);

    // Recalculate order indices
    const updated = items.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(updated);
    setDraggingId(null);

    const res = await saveProjects(updated);
    if (res.success) {
      showStatus('success', 'Project order updated successfully!');
    } else {
      showStatus('error', res.error || 'Failed to update order');
    }
  };

  // Project CRUD Functions
  const handleOpenAddModal = () => {
    setCurrentProject({
      id: `project-${Date.now()}`,
      title: '',
      description: '',
      techStack: [],
      image: '',
      githubLink: '',
      liveLink: '',
      featured: false,
      status: 'published',
      order: projects.length + 1
    });
    setIsProjectModalOpen(true);
  };

  const handleOpenEditModal = (project: Project) => {
    setCurrentProject({ ...project });
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const updated = projects
      .filter((p) => p.id !== id)
      .map((p, idx) => ({ ...p, order: idx + 1 }));
    
    setProjects(updated);
    const res = await saveProjects(updated);
    if (res.success) {
      showStatus('success', 'Project deleted successfully');
    } else {
      showStatus('error', res.error || 'Failed to delete project');
      loadData();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await uploadImage(formData);
    setUploadingImage(false);

    if (res.success && res.url) {
      setCurrentProject((prev) => prev ? { ...prev, image: res.url } : null);
      showStatus('success', 'Image uploaded successfully!');
    } else {
      showStatus('error', res.error || 'Failed to upload image');
    }
  };

  const handleSaveProjectModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject || !currentProject.title) return;

    const list = [...projects];
    const existingIdx = list.findIndex((p) => p.id === currentProject.id);

    if (existingIdx !== -1) {
      list[existingIdx] = currentProject as Project;
    } else {
      list.push(currentProject as Project);
    }

    // Sort order
    const updated = list
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((p, idx) => ({ ...p, order: idx + 1 }));

    setProjects(updated);
    setIsProjectModalOpen(false);
    setCurrentProject(null);

    const res = await saveProjects(updated);
    if (res.success) {
      showStatus('success', 'Project saved successfully!');
    } else {
      showStatus('error', res.error || 'Failed to save project');
      loadData();
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProfile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadProfileImage(formData);
      if (res.success && res.url) {
        setPersonalInfo({ ...personalInfo, profileImage: res.url });
        showStatus('success', 'Profile picture updated! Click Save Configurations to publish.');
      } else {
        showStatus('error', res.error || 'Failed to upload profile picture');
      }
    } catch (err: any) {
      showStatus('error', err.message || 'Error uploading profile picture');
    } finally {
      setUploadingProfile(false);
    }
  };

  // Config save helper
  const handleSaveConfigs = async () => {
    setSaving(true);
    try {
      const cleanedExperience = experience.map(exp => ({
        ...exp,
        skills: exp.skills ? exp.skills.map((s: string) => s.trim()).filter(Boolean) : [],
        points: exp.points ? exp.points.map((p: string) => p.trim()).filter(Boolean) : []
      }));

      // Filter and clean marquee items
      const cleanedMarquee = marquee.map(m => m.trim().toUpperCase()).filter(Boolean);

      const res1 = await saveConfig('personal-info.json', personalInfo);
      const res2 = await saveConfig('socials.json', socials);
      const res3 = await saveConfig('skills.json', skills);
      const res4 = await saveConfig('experience.json', cleanedExperience);
      const res5 = await saveConfig('achievements.json', achievements);
      const res6 = await saveConfig('education.json', education);
      const res7 = await saveConfig('marquee.json', cleanedMarquee);
      const res8 = await saveConfig('stats.json', stats);

      if (res1.success && res2.success && res3.success && res4.success && res5.success && res6.success && res7.success && res8.success) {
        showStatus('success', 'Configurations saved successfully!');
        setExperience(cleanedExperience);
        setMarquee(cleanedMarquee);
      } else {
        showStatus('error', 'One or more configurations failed to save');
      }
    } catch (e: any) {
      showStatus('error', e.message || 'Error saving configs');
    } finally {
      setSaving(false);
    }
  };

  // Loading state guard
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  // Unauthorized Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Secure Terminal</h1>
            <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-2">Authentication Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Access Key</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950/60 border border-white/[0.08] focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 text-white placeholder-slate-600 outline-none transition-all duration-300 text-center font-mono"
                placeholder="••••••••"
              />
            </div>

            {authError && (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              Verify <Terminal className="w-4.5 h-4.5" />
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors font-mono">
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/[0.06] bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto px-6 max-w-6xl py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h1 className="text-lg font-mono font-bold tracking-wide">
              ADMIN CONTROL PANEL
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
              View Website
            </Link>
            <button
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer select-none active:scale-95"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="container mx-auto px-6 max-w-6xl py-10">
        {/* Vercel Ephemeral Environment Warning */}
        {process.env.NODE_ENV === 'production' && (
          <div className="mb-8 p-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 text-yellow-400 text-xs font-mono flex items-start gap-3">
            <span className="text-base shrink-0">⚠️</span>
            <div>
              <p className="font-bold uppercase tracking-wider">Production Environment Warning</p>
              <p className="mt-1 text-slate-400 font-sans leading-relaxed">
                This site is currently live on production. Any configuration changes made here are temporary and will be lost on the next build. 
                To make permanent updates, run the site locally on your computer (<code className="text-yellow-300">npm run dev</code>), save your changes in this panel, and push the updated <code className="text-yellow-300">data/</code> files to GitHub.
              </p>
            </div>
          </div>
        )}

        {/* Status Messages */}
        <AnimatePresence>
          {statusMsg && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`fixed top-24 right-6 z-50 p-4 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-xl ${
                statusMsg.type === 'success'
                  ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                  : 'bg-red-500/5 border-red-500/20 text-red-400'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-mono">{statusMsg.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Sidebar Sub-Navigation Tabs */}
          <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-24">
            <div className="px-3 py-1.5 mb-1">
              <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Dashboard Menu</p>
            </div>
            
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border font-mono text-xs text-left transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                    activeTab === tab.id
                      ? 'bg-white border-white text-black shadow-lg shadow-white/5 font-bold'
                      : 'bg-white/[0.01] border-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.04] hover:border-white/[0.08]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-black' : 'text-cyan-400'}`} />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Focused Sub-Tab Workspace */}
          <div className="lg:col-span-9 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-4">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h2>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase">
                  {tabs.find(t => t.id === activeTab)?.desc}
                </p>
              </div>
              
              {activeTab !== 'projects' && (
                <button
                  onClick={handleSaveConfigs}
                  disabled={saving}
                  className="py-2 px-4 rounded-lg bg-white hover:bg-slate-200 text-black font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shadow-md shrink-0"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save Changes
                </button>
              )}
            </div>

            {/* TAB 1: PROJECTS GALLERY */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-mono uppercase">DRAG & DROP TO REORDER LAYOUT</span>
                  <button
                    onClick={handleOpenAddModal}
                    className="py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                <div className="space-y-3">
                  {projects.length === 0 ? (
                    <div className="p-12 text-center border border-dashed border-white/[0.06] rounded-2xl text-slate-500 font-mono text-sm">
                      No projects found. Add one to get started!
                    </div>
                  ) : (
                    projects
                      .sort((a, b) => (a.order || 0) - (b.order || 0))
                      .map((project) => (
                        <div
                          key={project.id}
                          draggable
                          onDragStart={() => handleDragStart(project.id)}
                          onDragOver={handleDragOver}
                          onDrop={() => handleDrop(project.id)}
                          className={`flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-grab active:cursor-grabbing ${
                            draggingId === project.id ? 'opacity-40 border-white/30 bg-white/5' : ''
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-slate-600 hover:text-slate-400 cursor-grab shrink-0">
                              <GripVertical className="w-5 h-5" />
                            </div>
                            {project.image && (
                              <div className="w-16 h-10 rounded-lg overflow-hidden bg-slate-900 border border-white/[0.04] relative shrink-0">
                                <img src={project.image} alt={project.title} className="object-cover w-full h-full" />
                              </div>
                            )}
                            <div>
                              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                {project.title}
                                {project.featured && (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">FEATURED</span>
                                )}
                                {project.status === 'draft' && (
                                  <span className="px-1.5 py-0.5 rounded text-[8px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 font-mono">DRAFT</span>
                                )}
                              </h3>
                              <p className="text-xs text-slate-500 font-mono mt-1">Order: {project.order} • {project.techStack.join(', ')}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(project)}
                              className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PROFILE & SOCIALS */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Info */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                  <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest border-b border-white/[0.06] pb-2 font-bold">Personal Info</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Full Name</label>
                      <input
                        type="text"
                        value={personalInfo.name || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Titles / Roles (separated by |)</label>
                      <input
                        type="text"
                        value={personalInfo.titles ? personalInfo.titles.join(' | ') : ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, titles: e.target.value.split('|').map(t => t.trim()) })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Resume Download Link</label>
                      <input
                        type="text"
                        value={personalInfo.resumeUrl || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, resumeUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">About Me Description</label>
                      <textarea
                        rows={4}
                        value={personalInfo.about || ''}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, about: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 resize-none font-sans leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Profile Picture</label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/[0.08] bg-slate-950 flex-shrink-0">
                          {personalInfo.profileImage ? (
                            <img
                              src={personalInfo.profileImage}
                              alt="Profile Preview"
                              className="w-full h-full object-cover grayscale"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-grow">
                          <label className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-950 border border-white/[0.08] hover:border-white/20 transition-all font-mono text-[10px] text-slate-300 hover:text-white cursor-pointer select-none active:scale-95">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadingProfile ? 'UPLOADING...' : 'CHOOSE PICTURE'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProfileImageUpload}
                              disabled={uploadingProfile}
                            />
                          </label>
                          <p className="text-[9px] text-slate-500 font-mono mt-1.5">PNG, JPG, OR WEBP. RECOMMENDED 1:1 SQUARE ASPECT.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Social Links */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                    <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest border-b border-white/[0.06] pb-2 font-bold">Social Links</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={socials.linkedin || ''}
                          onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">GitHub URL</label>
                        <input
                          type="text"
                          value={socials.github || ''}
                          onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">Email Address</label>
                        <input
                          type="text"
                          value={socials.email || ''}
                          onChange={(e) => setSocials({ ...socials, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono text-slate-500 uppercase mb-1">WhatsApp URL (e.g. wa.me link)</label>
                        <input
                          type="text"
                          value={socials.whatsapp || ''}
                          onChange={(e) => setSocials({ ...socials, whatsapp: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Achievements Counters */}
                  <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                      <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">Achievements Counters</h3>
                      <button
                        type="button"
                        onClick={() => {
                          setAchievements([
                            ...achievements,
                            { id: `achievement-${Date.now()}`, title: '', count: 1, icon: 'Award' }
                          ]);
                        }}
                        className="py-1 px-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[9px] flex items-center gap-1 cursor-pointer active:scale-95 select-none shrink-0"
                      >
                        <Plus className="w-3 h-3" /> Add Item
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {achievements.length === 0 ? (
                        <p className="text-xs text-slate-500 font-mono text-center py-4">No achievements counters. Click "Add Item" to create one.</p>
                      ) : (
                        achievements.map((item, idx) => (
                          <div key={item.id || idx} className="flex flex-row items-end gap-3 p-3 rounded-xl bg-slate-950/20 border border-white/[0.02] relative group">
                            <div className="flex-1 min-w-0">
                              <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Achievement Name / Title</label>
                              <input
                                type="text"
                                required
                                value={item.title || ''}
                                onChange={(e) => {
                                  const copy = [...achievements];
                                  copy[idx].title = e.target.value;
                                  setAchievements(copy);
                                }}
                                className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                                placeholder="SQL HackerRank Certified"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Remove achievement "${item.title || 'untitled'}"?`)) {
                                  const copy = achievements.filter((_, i) => i !== idx);
                                  setAchievements(copy);
                                }
                              }}
                              className="p-2 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center w-12 h-9 shrink-0"
                              title="Remove Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS CATALOG */}
            {activeTab === 'skills' && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest border-b border-white/[0.06] pb-2 font-bold">Skills Catalog Categories</h3>
                
                <div className="space-y-5">
                  {skills.map((skillGroup, idx) => (
                    <div key={idx} className="space-y-2 border-b border-white/[0.04] pb-4 last:border-0 last:pb-0">
                      <label className="block text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">{skillGroup.category}</label>
                      <textarea
                        rows={2}
                        value={skillGroup.items.join(', ')}
                        onChange={(e) => {
                          const copy = [...skills];
                          copy[idx].items = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                          setSkills(copy);
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-slate-300 outline-none focus:border-white/30 font-mono leading-relaxed"
                        placeholder="Comma-separated items, e.g. Python, SQL"
                      />
                      <p className="text-[9px] text-slate-600 font-mono">SEPARATE MULTIPLE SKILLS WITH COMMAS</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WORK EXPERIENCE ACCORDIONS */}
            {activeTab === 'experience' && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">Experience Timeline</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">ADD, DELETE, OR MODIFY EXPERIENCE TIMELINE ROWS</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setExperience([
                        ...experience,
                        { role: '', company: '', location: '', duration: '', skills: [], points: [] }
                      ]);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Experience
                  </button>
                </div>

                <div className="space-y-6">
                  {experience.length === 0 ? (
                    <p className="text-xs text-slate-500 font-mono text-center py-4">No experience entries. Click "Add Experience" to create one.</p>
                  ) : (
                    experience.map((item, idx) => (
                      <div key={idx} className="relative p-5 rounded-xl bg-slate-950/40 border border-white/[0.04] space-y-4">
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Remove this experience entry?')) {
                              const copy = experience.filter((_, i) => i !== idx);
                              setExperience(copy);
                            }
                          }}
                          className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95"
                          title="Remove Experience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Role / Job Title</label>
                            <input
                              type="text"
                              required
                              value={item.role || ''}
                              onChange={(e) => {
                                const copy = [...experience];
                                copy[idx].role = e.target.value;
                                setExperience(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="Python Developer"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Company / Organization</label>
                            <input
                              type="text"
                              required
                              value={item.company || ''}
                              onChange={(e) => {
                                const copy = [...experience];
                                copy[idx].company = e.target.value;
                                setExperience(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="Company Name"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Location (e.g. Remote or City)</label>
                            <input
                              type="text"
                              required
                              value={item.location || ''}
                              onChange={(e) => {
                                const copy = [...experience];
                                copy[idx].location = e.target.value;
                                setExperience(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="Remote"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Duration</label>
                            <input
                              type="text"
                              required
                              value={item.duration || ''}
                              onChange={(e) => {
                                const copy = [...experience];
                                copy[idx].duration = e.target.value;
                                setExperience(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-mono"
                              placeholder="June 2026 - Present"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Skills & Tools (Comma-separated)</label>
                          <input
                            type="text"
                            value={item.skills ? item.skills.join(', ') : ''}
                            onChange={(e) => {
                              const copy = [...experience];
                              copy[idx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setExperience(copy);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-mono"
                            placeholder="Flask, MySQL, Docker"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Description / Bullet Points (One per line)</label>
                          <textarea
                            rows={4}
                            value={item.points ? item.points.join('\n') : ''}
                            onChange={(e) => {
                              const copy = [...experience];
                              copy[idx].points = e.target.value.split('\n');
                              setExperience(copy);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-slate-300 outline-none focus:border-white/30 font-sans resize-none leading-relaxed"
                            placeholder="• Built REST APIs&#10;• Structured databases"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 5: EDUCATION HISTORIES */}
            {activeTab === 'education' && (
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div>
                    <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">Education History</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">ADD, DELETE, OR MODIFY SCHOOL TIMELINE CARDS</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEducation([
                        ...education,
                        { period: '', degree: '', institution: '', details: '' }
                      ]);
                    }}
                    className="py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>

                <div className="space-y-6">
                  {education.length === 0 ? (
                    <p className="text-xs text-slate-500 font-mono text-center py-4">No education cards. Click "Add Education" to create one.</p>
                  ) : (
                    education.map((item, idx) => (
                      <div key={idx} className="relative p-5 rounded-xl bg-slate-950/40 border border-white/[0.04] space-y-4">
                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Remove this education entry?')) {
                              const copy = education.filter((_, i) => i !== idx);
                              setEducation(copy);
                            }
                          }}
                          className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95"
                          title="Remove Education"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Period / Date Range</label>
                            <input
                              type="text"
                              required
                              value={item.period || ''}
                              onChange={(e) => {
                                const copy = [...education];
                                copy[idx].period = e.target.value;
                                setEducation(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-mono"
                              placeholder="2023 - 2027"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Degree / Certification</label>
                            <input
                              type="text"
                              required
                              value={item.degree || ''}
                              onChange={(e) => {
                                const copy = [...education];
                                copy[idx].degree = e.target.value;
                                setEducation(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="Bachelor of Technology"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Institution / School</label>
                            <input
                              type="text"
                              required
                              value={item.institution || ''}
                              onChange={(e) => {
                                const copy = [...education];
                                copy[idx].institution = e.target.value;
                                setEducation(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="University Name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Details / Summary Description</label>
                          <textarea
                            rows={2}
                            value={item.details || ''}
                            onChange={(e) => {
                              const copy = [...education];
                              copy[idx].details = e.target.value;
                              setEducation(copy);
                            }}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-slate-300 outline-none focus:border-white/30 font-sans resize-none leading-relaxed"
                            placeholder="Pursuing studies..."
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 6: BANNER & STATISTICS EXTRA DETAILS */}
            {activeTab === 'extras' && (
              <div className="space-y-6">
                {/* Marquee Floating Banner Manager */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div>
                      <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">Marquee Floating Banner</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">TEXT ITEMS SCROLLING UNDER THE RESUME DOWNLOAD BUTTON</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMarquee([...marquee, '']);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Text Item
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {marquee.length === 0 ? (
                      <p className="text-xs text-slate-500 font-mono text-center py-4 col-span-2">No marquee items. Click "Add Text Item" to create one.</p>
                    ) : (
                      marquee.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/40 border border-white/[0.04]">
                          <input
                            type="text"
                            required
                            value={item || ''}
                            onChange={(e) => {
                              const copy = [...marquee];
                              copy[idx] = e.target.value;
                              setMarquee(copy);
                            }}
                            className="flex-grow px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-mono uppercase"
                            placeholder="E.G. PYTHON DEVELOPMENT"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const copy = marquee.filter((_, i) => i !== idx);
                              setMarquee(copy);
                            }}
                            className="p-1.5 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95 flex-shrink-0"
                            title="Remove Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Resume Statistics Grid Manager */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div>
                      <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-widest font-bold">Resume Statistics Grid</h3>
                      <p className="text-[10px] text-slate-500 font-mono mt-1">COUNTER VALUES AND LABELS IN YOUR COUNTER ROW</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStats([
                          ...stats,
                          { id: `stat-${Date.now()}`, value: '', label: '' }
                        ]);
                      }}
                      className="py-1.5 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all font-mono text-[10px] flex items-center gap-1.5 cursor-pointer select-none active:scale-95 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Stat Box
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.length === 0 ? (
                      <p className="text-xs text-slate-500 font-mono text-center py-4 col-span-3">No stats boxes. Click "Add Stat Box" to create one.</p>
                    ) : (
                      stats.map((item, idx) => (
                        <div key={idx} className="relative p-4 rounded-xl bg-slate-950/40 border border-white/[0.04] space-y-3">
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm('Remove this statistic box?')) {
                                const copy = stats.filter((_, i) => i !== idx);
                                setStats(copy);
                              }
                            }}
                            className="absolute top-3 right-3 p-1 rounded-lg bg-red-500/5 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all cursor-pointer active:scale-95"
                            title="Remove Stat Box"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                          <div className="pr-6">
                            <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Value (e.g. 12+ or 04)</label>
                            <input
                              type="text"
                              required
                              value={item.value || ''}
                              onChange={(e) => {
                                const copy = [...stats];
                                copy[idx].value = e.target.value;
                                setStats(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans font-bold"
                              placeholder="12+"
                            />
                          </div>

                          <div>
                            <label className="block text-[8px] font-mono text-slate-500 uppercase mb-1">Label (e.g. Months Experience)</label>
                            <input
                              type="text"
                              required
                              value={item.label || ''}
                              onChange={(e) => {
                                const copy = [...stats];
                                copy[idx].label = e.target.value;
                                setStats(copy);
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-white outline-none focus:border-white/30 font-sans"
                              placeholder="Months Dev/Intern"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* PROJECT ADD/EDIT MODAL DIALOG */}
      <AnimatePresence>
        {isProjectModalOpen && currentProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0a0f1d] border border-white/[0.08] rounded-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-6">
                <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider">
                  {currentProject.title ? `Edit: ${currentProject.title}` : 'Add New Project'}
                </h3>
                <button
                  onClick={() => setIsProjectModalOpen(false)}
                  className="text-slate-400 hover:text-white font-mono text-xs cursor-pointer select-none"
                >
                  [CLOSE]
                </button>
              </div>

              <form onSubmit={handleSaveProjectModal} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Project ID (Unique)</label>
                    <input
                      type="text"
                      required
                      disabled={projects.some(p => p.id === currentProject.id)}
                      value={currentProject.id || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, id: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono disabled:opacity-50"
                      placeholder="smart-sheet-ai"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Project Title</label>
                    <input
                      type="text"
                      required
                      value={currentProject.title || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-sans"
                      placeholder="My Awesome App"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={currentProject.description || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 resize-none font-sans"
                    placeholder="Short project overview description..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Tech Stack (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    value={currentProject.techStack ? currentProject.techStack.join(', ') : ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, techStack: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-slate-300 outline-none focus:border-white/30 font-mono"
                    placeholder="Flask, React, Tailwind CSS"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">GitHub Link</label>
                    <input
                      type="text"
                      value={currentProject.githubLink || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, githubLink: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                      placeholder="https://github.com/..."
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">Live Demo Link</label>
                    <input
                      type="text"
                      value={currentProject.liveLink || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, liveLink: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950/60 border border-white/[0.08] text-sm text-white outline-none focus:border-white/30 font-mono"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Project Image & Upload */}
                <div className="border border-white/[0.06] rounded-2xl p-4 bg-slate-950/30 space-y-3">
                  <span className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest">Project Screenshot</span>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {currentProject.image ? (
                      <div className="w-32 aspect-video rounded-lg overflow-hidden border border-white/[0.08] bg-slate-950 relative shrink-0">
                        <img src={currentProject.image} alt="Preview" className="object-cover w-full h-full" />
                      </div>
                    ) : (
                      <div className="w-32 aspect-video rounded-lg border border-dashed border-white/[0.08] flex flex-col items-center justify-center text-slate-600 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                        <span className="text-[8px] font-mono uppercase mt-1">No Image</span>
                      </div>
                    )}

                    <div className="flex-grow space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={currentProject.image || ''}
                          onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                          className="flex-grow px-3 py-1.5 rounded-lg bg-slate-950/60 border border-white/[0.08] text-xs text-slate-300 outline-none focus:border-white/30 font-mono"
                          placeholder="/projects/filename.png"
                        />
                        
                        <label className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-xs text-white font-mono flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shrink-0 select-none">
                          {uploadingImage ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug font-sans">
                        Provide a public image path or select an image file to upload directly to our media folder.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex flex-wrap items-center gap-6 border-t border-white/[0.06] pt-4">
                  <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProject.featured || false}
                      onChange={(e) => setCurrentProject({ ...currentProject, featured: e.target.checked })}
                      className="w-4.5 h-4.5 accent-cyan-500 rounded border-white/[0.08] bg-slate-950"
                    />
                    Featured Project
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-300">Status:</span>
                    <button
                      type="button"
                      onClick={() => setCurrentProject({ ...currentProject, status: currentProject.status === 'published' ? 'draft' : 'published' })}
                      className={`px-3 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                        currentProject.status === 'published'
                          ? 'bg-white/10 text-white border-white/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {currentProject.status ? currentProject.status.toUpperCase() : 'PUBLISHED'}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] pt-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProjectModalOpen(false);
                      setCurrentProject(null);
                    }}
                    className="py-2.5 px-4 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.06] text-xs font-mono cursor-pointer active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 rounded-xl bg-white hover:bg-slate-200 text-black font-bold transition-all text-xs font-mono cursor-pointer active:scale-95"
                  >
                    Save Project
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
