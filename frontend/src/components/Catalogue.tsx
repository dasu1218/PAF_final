import React, { useState, useEffect } from 'react';
import { Resource } from '../types/Resource';
import { resourceApi } from '../api/resourceApi';
import { Search, Filter, MapPin, Users, Activity, Settings, SlidersHorizontal, LibraryBig } from 'lucide-react';

export const Catalogue: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [minCapacity, setMinCapacity] = useState<number | ''>('');

  useEffect(() => {
    loadResources();
  }, []);

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

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          resource.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? resource.type === typeFilter : true;
    const matchesCapacity = minCapacity !== '' ? resource.capacity >= minCapacity : true;
    
    return matchesSearch && matchesType && matchesCapacity;
  });

  const uniqueTypes = Array.from(new Set(resources.map(r => r.type)));

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors duration-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              <LibraryBig className="h-3.5 w-3.5 text-[#F27D26]" />
              Resource catalogue
            </p>
            <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              Find the right resource faster.
            </h3>
            <p className="mt-2 text-sm leading-6 text-secondary sm:text-base">
              Use search, type, and capacity filters to narrow the list without losing context.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-secondary sm:grid-cols-3">
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Matching</p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">{filteredResources.length} resources</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Types</p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">{uniqueTypes.length || 0}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.24em] text-muted">Capacity floor</p>
              <p className="mt-1 font-display text-lg font-semibold text-primary">{minCapacity || 'Any'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-secondary" />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="w-full rounded-2xl border border-border/70 bg-input/90 py-3 pl-11 pr-4 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:w-[32rem]">
            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <select
                className="w-full appearance-none rounded-2xl border border-border/70 bg-input/90 py-3 pl-11 pr-4 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Users className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary" />
              <input
                type="number"
                placeholder="Min Capacity"
                className="w-full rounded-2xl border border-border/70 bg-input/90 py-3 pl-11 pr-4 text-primary shadow-inner shadow-black/5 outline-none transition focus:border-[#F27D26] focus:ring-4 focus:ring-[#F27D26]/10"
                value={minCapacity}
                onChange={(e) => setMinCapacity(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#F27D26]/20 border-t-[#F27D26]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.length > 0 ? (
            filteredResources.map(resource => (
              <div key={resource.id} className="group overflow-hidden rounded-[1.75rem] border border-border/70 bg-surface/80 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#F27D26]/40 hover:shadow-[0_24px_60px_rgba(242,125,38,0.12)]">
                <div className="h-1 bg-gradient-to-r from-[#F27D26] via-[#ffb36e] to-sky-400" />
                <div className="p-6 space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-full border border-[#F27D26]/20 bg-[#F27D26]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#F27D26]">
                        {resource.type}
                      </span>
                      <h3 className="mt-3 font-display text-2xl font-semibold tracking-tight text-primary">{resource.name}</h3>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${
                      resource.status === 'ACTIVE'
                        ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
                    }`}>
                      {resource.status ? resource.status.replace('_', ' ') : 'UNKNOWN'}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm text-secondary">
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                      <MapPin className="h-4 w-4 text-[#F27D26]" />
                      <span>{resource.location}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                      <Users className="h-4 w-4 text-[#F27D26]" />
                      <span>Capacity: {resource.capacity}</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-4 py-3">
                      <Activity className="h-4 w-4 text-[#F27D26]" />
                      <span>Windows: {(resource.availabilityWindows || []).join(', ') || 'None'}</span>
                    </div>
                  </div>

                  {Object.keys(resource.metadata).length > 0 && (
                    <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
                      <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-secondary">
                        <Settings className="h-3 w-3" />
                        <span>Metadata</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(resource.metadata || {}).map(([key, value]) => (
                          <span key={key} className="rounded-full border border-border/70 bg-input/80 px-3 py-1 text-xs text-muted">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-border/70 bg-surface/60 py-16 text-center text-secondary backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <p className="mt-4 font-display text-xl font-semibold text-primary">No resources match your filters.</p>
              <p className="mt-2 text-sm">Try broadening the search or clearing one of the filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
