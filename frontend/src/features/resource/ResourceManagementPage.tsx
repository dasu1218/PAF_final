import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Package,
  MapPin,
  Users
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { resourceService, Resource, ResourceStatus } from './resourceService';
import { ConfirmModal } from '../../shared/components/ConfirmModal';

export const ResourceManagementPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ResourceStatus | 'ALL'>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState<Partial<Resource>>({
    name: '',
    type: 'LECTURE_HALL',
    faculty: 'Computing',
    building: 'Main Building',
    capacity: 0,
    location: '',
    status: 'ACTIVE',
    description: ''
  });

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const data = await resourceService.getResources();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentResource({
      name: '',
      type: 'LECTURE_HALL',
      faculty: 'Computing',
      building: 'Main Building',
      capacity: 0,
      location: '',
      status: 'ACTIVE',
      description: ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (resource: Resource) => {
    setIsEditing(true);
    setCurrentResource(resource);
    setShowModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentResource.id) {
        await resourceService.updateResource(currentResource.id, currentResource);
      } else {
        await resourceService.createResource(currentResource);
      }
      await fetchResources();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to save resource:', error);
      alert('Error saving resource. Please try again.');
    }
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (resourceToDelete) {
      try {
        await resourceService.deleteResource(resourceToDelete);
        await fetchResources();
      } catch (error) {
        console.error('Failed to delete resource:', error);
        alert('Error deleting resource.');
      } finally {
        setResourceToDelete(null);
      }
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesFilter = filter === 'ALL' || r.status === filter;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (r.id && r.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusStyle = (status: ResourceStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-100';
      case 'OUT_OF_SERVICE': return 'bg-red-50 text-red-600 border-red-100';
      case 'MAINTENANCE': return 'bg-orange-50 text-orange-600 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-ink">Resource Management</h1>
          <p className="text-xl serif-italic text-ink/50">Manage campus facilities, labs, and equipment inventory.</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-ink text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-accent transition-all duration-300 shadow-2xl shadow-ink/10 shrink-0"
        >
          <Plus size={20} /> Add Resource
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-4">
          {['ALL', 'ACTIVE', 'OUT_OF_SERVICE', 'MAINTENANCE'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 border",
                filter === s 
                  ? "bg-accent text-white border-accent shadow-xl shadow-accent/20" 
                  : "bg-card text-ink/40 border-border hover:border-ink/20 hover:text-ink"
              )}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative group flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-accent transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-card border border-border rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium"
          />
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-card rounded-[3rem] border border-border overflow-hidden card-shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black/[0.02] border-b border-border">
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Resource</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Type</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Faculty</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Building</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30">Status</th>
              <th className="px-8 py-6 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-ink/40 serif-italic">Loading resources...</td>
              </tr>
            ) : filteredResources.map((resource) => (
              <tr key={resource.id} className="group hover:bg-black/[0.01] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-paper rounded-xl flex items-center justify-center text-ink/20 group-hover:bg-accent/10 group-hover:text-accent transition-all">
                      <Package size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-ink">{resource.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink/20">{resource.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-xs font-bold text-ink/60 uppercase tracking-widest">{resource.type?.replace('_', ' ')}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium text-ink/60">{resource.faculty}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-ink/60">
                    <MapPin size={14} />
                    <span className="text-sm font-medium">{resource.building}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border",
                    getStatusStyle(resource.status)
                  )}>
                    {resource.status?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(resource)}
                      className="p-3 hover:bg-black/5 rounded-xl transition-all text-ink/40 hover:text-accent"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => resource.id && handleDeleteClick(resource.id)}
                      className="p-3 hover:bg-red-50 rounded-xl transition-all text-ink/40 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {!isLoading && filteredResources.length === 0 && (
          <div className="p-20 text-center">
            <div className="w-20 h-20 bg-paper rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="text-ink/10" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-ink mb-2">No resources found</h3>
            <p className="text-ink/40 serif-italic">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>

      {/* Resource Modal (Add/Edit) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3rem] p-12 max-w-2xl w-full card-shadow my-8">
            <h2 className="text-3xl font-bold tracking-tight mb-10">{isEditing ? 'Edit Resource' : 'Add New Resource'}</h2>
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Resource Name</label>
                  <input 
                    name="name"
                    type="text" 
                    required
                    value={currentResource.name}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium" 
                    placeholder="e.g. Lab 404" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Type</label>
                  <select 
                    name="type"
                    value={currentResource.type}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                  >
                    <option value="LECTURE_HALL">LECTURE HALL</option>
                    <option value="LAB">LAB</option>
                    <option value="EQUIPMENT">EQUIPMENT</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Faculty</label>
                  <select 
                    name="faculty"
                    value={currentResource.faculty}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                  >
                    <option value="Computing">Computing</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Building</label>
                  <select 
                    name="building"
                    value={currentResource.building}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                  >
                    <option value="Main Building">Main Building</option>
                    <option value="New Building">New Building</option>
                    <option value="Engineering Building">Engineering Building</option>
                    <option value="BM Building">BM Building</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Capacity</label>
                  <input 
                    name="capacity"
                    type="number" 
                    required
                    value={currentResource.capacity}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium" 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Location (Floor/Room)</label>
                  <input 
                    name="location"
                    type="text" 
                    required
                    value={currentResource.location}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium" 
                    placeholder="e.g. 3rd Floor" 
                  />
                </div>
                {isEditing && (
                  <div className="space-y-3 col-span-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Status</label>
                    <select 
                      name="status"
                      value={currentResource.status}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium appearance-none"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                )}
                <div className="space-y-3 col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-ink/30 ml-1">Description</label>
                  <textarea 
                    name="description"
                    value={currentResource.description}
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 bg-paper border border-black/5 rounded-2xl focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all outline-none text-sm font-medium min-h-[100px] resize-none" 
                    placeholder="Brief description of the resource..." 
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)} 
                  className="flex-1 py-5 bg-paper text-ink font-bold rounded-2xl hover:bg-black/5 transition-all duration-300 uppercase tracking-widest text-[10px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 bg-ink text-white rounded-2xl font-bold hover:bg-accent transition-all duration-500 shadow-2xl shadow-ink/10 uppercase tracking-widest text-[10px]"
                >
                  {isEditing ? 'Update Resource' : 'Create Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource?"
        message="Are you sure you want to delete this campus resource? This will remove all associated booking data and cannot be undone."
      />
    </div>
  );
};
