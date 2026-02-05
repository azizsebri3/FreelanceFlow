'use client';

/* ==========================================================================
   Projects Page
   List and manage all projects
   ========================================================================== */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { projectsData, Project, clientsData, Client } from '@/data/placeholder';
import { validateProjectForm, hasErrors } from '@/utils/validation';
import { useToast } from '@/components/ui/Toast';
import { useConfirmDialog } from '@/components/ui/ConfirmDialog';

// ==========================================================================
// Project Modal Component
// ==========================================================================

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSave: (project: Omit<Project, 'id'>) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    budget: 0,
    deadline: '',
    status: 'pending' as Project['status'],
    progress: 0,
  });
  const [isAddingNewClient, setIsAddingNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form data when project prop changes
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        client: project.client || '',
        budget: project.budget || 0,
        deadline: project.deadline || '',
        status: project.status || 'pending',
        progress: project.progress || 0,
      });
    } else {
      // Reset form for new project
      setFormData({
        name: '',
        client: '',
        budget: 0,
        deadline: '',
        status: 'pending',
        progress: 0,
      });
    }
    setIsAddingNewClient(false);
    setNewClientName('');
  }, [project, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateProjectForm(formData);
    if (hasErrors(errors)) {
      setErrors(errors);
      return;
    }

    onSave(formData);
    onClose();
    setIsAddingNewClient(false);
    setNewClientName('');
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md mx-auto animate-in zoom-in-95 duration-300 delay-150 shadow-2xl border border-gray-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 pr-2">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            onClick={() => {
              onClose();
              setIsAddingNewClient(false);
              setNewClientName('');
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            {!isAddingNewClient ? (
              <div className="space-y-2">
                <select
                  value={formData.client}
                  onChange={(e) => {
                    if (e.target.value === 'add-new') {
                      setIsAddingNewClient(true);
                    } else {
                      setFormData({ ...formData, client: e.target.value });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                >
                  <option value="">Select a client</option>
                  {clientsData.map((client) => (
                    <option key={client.id} value={client.company || client.name}>
                      {client.company || client.name}
                    </option>
                  ))}
                  <option value="add-new">+ Add new client</option>
                </select>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="Enter new client name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (newClientName.trim()) {
                        setFormData({ ...formData, client: newClientName.trim() });
                        setIsAddingNewClient(false);
                        setNewClientName('');
                      }
                    }}
                    className="flex-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark text-xs sm:text-sm"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewClient(false);
                      setNewClientName('');
                    }}
                    className="flex-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            {errors.client && <p className="text-red-500 text-sm mt-1">{errors.client}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($)</label>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
              required
            />
            {errors.budget && <p className="text-red-500 text-sm mt-1">{errors.budget}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
            {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
            <input
              type="number"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              min="0"
              max="100"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsAddingNewClient(false);
                setNewClientName('');
              }}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm sm:text-base font-medium"
            >
              {project ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================================================
// Status Badge Component
// ==========================================================================

const StatusBadge: React.FC<{ status: Project['status'] }> = ({ status }) => {
  const config: Record<Project['status'], { label: string; className: string }> = {
    'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
    'completed': { label: 'Completed', className: 'bg-green-100 text-green-700' },
    'on-hold': { label: 'On Hold', className: 'bg-yellow-100 text-yellow-700' },
    'pending': { label: 'Pending', className: 'bg-gray-100 text-gray-700' },
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config[status].className}`}>
      {config[status].label}
    </span>
  );
};

// ==========================================================================
// Projects Page Component
// ==========================================================================

export default function ProjectsPage() {
  const { showToast } = useToast();
  const { confirm } = useConfirmDialog();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(p => p.status === filter);

  // Handle create modal from header (query parameter)
  useEffect(() => {
    const create = searchParams.get('create');
    if (create === 'true') {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
      setEditingProject(undefined);
      setIsModalOpen(true);
      // Remove the query parameter from URL
      router.replace('/projects', { scroll: false });
    }
  }, [searchParams, router]);

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (date: string) => 
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleNewProject = () => {
    setIsAnimating(true);
    // Reset animation after it completes
    setTimeout(() => setIsAnimating(false), 600);
    setEditingProject(undefined);
    setIsModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleSaveProject = (projectData: Omit<Project, 'id'>) => {
    if (editingProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === editingProject.id 
          ? { ...projectData, id: editingProject.id }
          : p
      ));
      showToast({
        type: 'success',
        title: 'Project Updated',
        message: 'The project has been successfully updated.',
      });
    } else {
      // Create new project
      const newId = (Math.max(...projects.map(p => parseInt(p.id))) + 1).toString();
      const newProject: Project = {
        ...projectData,
        id: newId,
      };
      setProjects([...projects, newProject]);
      showToast({
        type: 'success',
        title: 'Project Created',
        message: 'The new project has been successfully created.',
      });
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    console.log('handleDeleteProject called with:', projectId);
    const project = projects.find(p => p.id === projectId);
    console.log('Found project:', project);
    // const confirmed = await confirm({
    //   title: 'Delete Project',
    //   message: `Are you sure you want to delete "${project?.name}"? This action cannot be undone.`,
    //   type: 'danger',
    //   confirmLabel: 'Delete',
    //   cancelLabel: 'Cancel',
    // });
    const confirmed = window.confirm(`Are you sure you want to delete "${project?.name}"?`);
    console.log('Confirmation result:', confirmed);

    if (confirmed) {
      setProjects(projects.filter(p => p.id !== projectId));
      showToast({
        type: 'success',
        title: 'Project Deleted',
        message: 'The project has been successfully deleted.',
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
              Projects
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage and track all your projects
            </p>
          </div>
          <button
            onClick={handleNewProject}
            className={`flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-primary text-white rounded-lg transition-all duration-300 transform shrink-0 ${
              isAnimating
                ? 'scale-95 animate-pulse'
                : 'hover:bg-primary-dark hover:scale-105 active:scale-95'
            }`}
          >
            <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className={`text-sm sm:text-base transition-all duration-300 ${isAnimating ? 'font-bold' : ''}`}>New Project</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'in-progress', 'completed', 'on-hold', 'pending'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? 'All Projects' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ml-2">
                <StatusBadge status={project.status} />
                <div className="flex gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditProject(project);
                    }}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                    title="Edit project"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                    className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110 active:scale-95"
                    title="Delete project"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 truncate">{project.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 truncate">{project.client}</p>

            {/* Progress */}
            <div className="mb-3 sm:mb-4">
              <div className="flex justify-between text-xs sm:text-sm mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0 text-xs sm:text-sm">
              <div className="text-gray-500">
                <span className="font-medium text-gray-900">{formatCurrency(project.budget)}</span>
              </div>
              <div className="text-gray-500">
                Due: {formatDate(project.deadline)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        onSave={handleSaveProject}
      />

    </DashboardLayout>
  );
}
