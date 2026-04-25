import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { cn } from '../../lib/utils';

interface WeatherData {
  temp: number;
  condition: string;
  location: string;
  humidity: number;
  windSpeed: number;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulating a third-party API call (e.g., OpenWeatherMap)
    const fetchWeather = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setWeather({
        temp: 28,
        condition: 'Partly Cloudy',
        location: 'Colombo, Sri Lanka',
        humidity: 65,
        windSpeed: 12
      });
      setIsLoading(false);
    };
    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-card rounded-[2.5rem] border border-border p-10 animate-pulse space-y-4">
        <div className="h-6 w-32 bg-paper rounded-lg" />
        <div className="h-12 w-20 bg-paper rounded-lg" />
        <div className="h-4 w-48 bg-paper rounded-lg" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-[2.5rem] border border-border p-10 card-shadow group relative overflow-hidden">
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="space-y-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-ink/20">Campus Weather</h3>
          <p className="text-sm font-black text-ink">{weather?.location}</p>
        </div>
        <div className="w-12 h-12 bg-paper rounded-2xl flex items-center justify-center text-accent">
          <Cloud size={24} />
        </div>
      </div>

      <div className="flex items-end gap-4 mb-8 relative z-10">
        <span className="text-6xl font-black tracking-tighter text-ink">{weather?.temp}°</span>
        <div className="pb-2">
          <p className="text-sm font-black text-ink leading-none mb-1">{weather?.condition}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/30">Feels like 31°</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 relative z-10">
        <div className="flex items-center gap-3 p-4 bg-paper rounded-2xl">
          <Wind size={16} className="text-accent" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-ink/30">Wind</span>
            <span className="text-xs font-black text-ink">{weather?.windSpeed} km/h</span>
          </div>
        </div>
        <div className="flex items-center gap-3 p-4 bg-paper rounded-2xl">
          <Thermometer size={16} className="text-accent" />
          <div className="flex flex-col">
            <span className="text-[9px] font-bold uppercase tracking-widest text-ink/30">Humidity</span>
            <span className="text-xs font-black text-ink">{weather?.humidity}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
