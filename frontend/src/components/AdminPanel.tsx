import React, { useState, useEffect } from 'react';
import { Resource } from '../types/Resource';
import { resourceApi } from '../api/resourceApi';
import { ResourceForm } from './ResourceForm';
import { Plus, Edit2, Trash2, ShieldCheck, CircleAlert, Database } from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  const loadResources = async () => {
    try {
      setLoading(true);
      const data = await resourceApi.getAll();
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleAdd = () => {
    setEditingId(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setResourceToDelete(id);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;
    try {
      await resourceApi.delete(resourceToDelete);
      loadResources();
    } catch (error) {
      console.error('Failed to delete resource', error);
    } finally {
      setResourceToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    loadResources();
  };

  if (isFormOpen) {
    return (
      <ResourceForm 
        resourceId={editingId} 
        onSuccess={handleFormSuccess} 
        onCancel={() => setIsFormOpen(false)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              <ShieldCheck className="h-3.5 w-3.5 text-[#F27D26]" />
              Admin workspace
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">Resource management</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary sm:text-base">Add, update, or remove resources from one focused table view.</p>
          </div>

          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-full bg-[#F27D26] px-5 py-3 font-medium text-white shadow-lg shadow-[#F27D26]/25 transition hover:-translate-y-0.5 hover:bg-[#ff9548]"
          >
            <Plus className="h-5 w-5" />
            Add Resource
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Total resources</p>
            <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Active</p>
            <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.filter(r => r.status === 'ACTIVE').length}</p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.24em] text-muted">Attention</p>
            <p className="mt-1 font-display text-2xl font-semibold text-primary">{resources.filter(r => r.status !== 'ACTIVE').length}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#F27D26]/20 border-t-[#F27D26]" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border/70 bg-background/70 text-xs uppercase tracking-[0.28em] text-secondary transition-colors duration-300">
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Location</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {resources.map(resource => (
                  <tr key={resource.id} className="transition-colors hover:bg-input/60">
                    <td className="px-6 py-5 font-medium text-primary">{resource.name}</td>
                    <td className="px-6 py-5 text-muted">{resource.type}</td>
                    <td className="px-6 py-5 text-muted">{resource.location}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                        resource.status === 'ACTIVE'
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {resource.status ? resource.status.replace('_', ' ') : 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(resource.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-secondary transition hover:-translate-y-0.5 hover:text-primary hover:shadow-md"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-background/70 text-secondary transition hover:-translate-y-0.5 hover:text-red-500 hover:shadow-md"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-secondary">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                        <Database className="h-6 w-6" />
                      </div>
                      <p className="mt-4 font-display text-xl font-semibold text-primary">No resources found</p>
                      <p className="mt-2 text-sm">Use the Add Resource button to create the first entry.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      {resourceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[1.75rem] border border-border/70 bg-surface/90 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.24)] backdrop-blur-xl transition-colors duration-300">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
              <CircleAlert className="h-6 w-6" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-primary">Confirm deletion</h3>
            <p className="mt-2 text-secondary">Are you sure you want to delete this resource? This action cannot be undone.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setResourceToDelete(null)}
                className="rounded-full border border-border/70 bg-background/70 px-4 py-2.5 text-sm font-medium text-muted transition hover:text-primary hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
