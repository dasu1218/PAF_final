import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Building2,
  ChevronRight,
  ClipboardList,
  Facebook,
  Instagram,
  Linkedin,
  MapPinned,
  Search,
  ShieldCheck,
  Sparkles,
  Twitter,
  Youtube,
} from 'lucide-react';
import heroVideo from '../asserts/13109981_1920_1080_25fps.mp4';
import lectureHallImage from '../asserts/pexels-asia-culture-center-3116378-4940642.jpg';
import libraryImage from '../asserts/pexels-edward-532643054-37106183.jpg';
import auditoriumImage from '../asserts/pexels-israwmx-20173227.jpg';
import studentHallImage from '../asserts/pexels-natalinadmay-9722652.jpg';
import { CPPilotAssistant } from './CPPilotAssistant';

interface HomePageProps {
  onOpenCatalogue: () => void;
  onOpenAdmin: () => void;
}

const highlights = [
  {
    icon: Search,
    title: 'Find spaces quickly',
    description: 'Search across locations, capacity, and live availability in one view.',
  },
  {
    icon: ClipboardList,
    title: 'Structure the inventory',
    description: 'Keep Student Hall, Lecture Hall, Canteen area, and other resources organized.',
  },
  {
    icon: ShieldCheck,
    title: 'Control updates safely',
    description: 'Use the admin workspace to edit and maintain the resource catalogue.',
  },
];

const stats = [
  { label: 'Resource types', value: '4+' },
  { label: 'Search modes', value: '3' },
  { label: 'Admin actions', value: 'Fast' },
  { label: 'Campus coverage', value: 'Wide' },
];

const socialTickerItems = [
  {
    icon: Facebook,
    text: 'Follow us on Facebook: SLIIT University',
  },
  {
    icon: Instagram,
    text: 'Instagram: @sliit.official',
  },
  {
    icon: Linkedin,
    text: 'LinkedIn: SLIIT Higher Education',
  },
  {
    icon: Youtube,
    text: 'YouTube: SLIIT Official Channel',
  },
  {
    icon: Twitter,
    text: 'X: @SLIIT_LK',
  },
];

const sliderItems = [
  {
    image: lectureHallImage,
    title: 'Smart Lecture Halls',
    description: 'Track room availability, seating capacity, and lecture facilities in one place.',
  },
  {
    image: auditoriumImage,
    title: 'Modern Auditoriums',
    description: 'Manage large event spaces with clear visibility across schedules and occupancy.',
  },
  {
    image: studentHallImage,
    title: 'Connected Student Spaces',
    description: 'Discover student-ready halls for workshops, clubs, and collaborative sessions.',
  },
];

const importantFacilities = [
  {
    title: 'SLIIT EduScope',
    description: 'Access lecture capture recordings and learning sessions from the official SLIIT portal.',
    url: 'https://lecturecapture.sliit.lk',
    cta: 'Open EduScope',
  },
  {
    title: 'SLIIT Virtual Lab',
    description: 'Enter the virtual lab environment to access course resources and practical activities.',
    url: 'https://courseweb.sliit.lk/course/view.php?id=1204',
    cta: 'Open Virtual Lab',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenCatalogue, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();
  const [activeSlide, setActiveSlide] = useState(0);
  const [quickAccessMotion, setQuickAccessMotion] = useState(0);
  const quickAccessRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % sliderItems.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleScrollMotion = () => {
      const section = quickAccessRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const visibility = (viewportHeight - rect.top) / (viewportHeight + rect.height);
      const clamped = Math.min(Math.max(visibility, 0), 1);
      setQuickAccessMotion(clamped);
    };

    handleScrollMotion();
    window.addEventListener('scroll', handleScrollMotion, { passive: true });
    window.addEventListener('resize', handleScrollMotion);

    return () => {
      window.removeEventListener('scroll', handleScrollMotion);
      window.removeEventListener('resize', handleScrollMotion);
    };
  }, []);

  const imageTranslateY = 36 - quickAccessMotion * 68;
  const imageRotateY = -12 + quickAccessMotion * 24;
  const imageRotateX = 10 - quickAccessMotion * 18;
  const imageScale = 0.94 + quickAccessMotion * 0.1;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-none border border-border/70 bg-surface/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        >
         
        </video>
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(242,125,38,0.35),transparent_35%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.25),transparent_32%)]" />

        <div className="relative z-10 grid gap-10 px-6 py-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-12">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#F27D26]" />
              Campus resource home
            </p>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A modern home for campus spaces and services.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
              Use this hub to explore available resources, understand where they are located, and keep the inventory polished for students and staff.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={onOpenCatalogue}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F27D26] px-6 py-3 font-medium text-white shadow-lg shadow-[#F27D26]/25 transition hover:-translate-y-0.5 hover:bg-[#ff9548]"
              >
                Open Catalogue
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/70 bg-background/70 px-6 py-3 font-medium text-muted transition hover:text-primary hover:shadow-md"
              >
                Go to Admin
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-none border border-white/20 bg-black/30 p-4 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/70">{stat.label}</p>
                  <p className="mt-2 font-display text-2xl font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-[#F27D26]/20 blur-2xl" />
            <div className="absolute right-4 top-24 h-28 w-28 rounded-full bg-sky-500/15 blur-2xl" />

            <div className="relative overflow-hidden rounded-none border border-white/20 bg-black/35 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.2)] backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-[0.28em] text-white/70">Today at a glance</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">Live campus overview</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F27D26]/15 text-[#ffb36e]">
                  <Building2 className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  'Lecture Hall bookings are centralized.',
                  'Student Halls can be filtered by capacity.',
                  'Canteen area resources are easy to review.',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-none border border-white/15 bg-black/25 px-4 py-3">
                    <MapPinned className="mt-0.5 h-4 w-4 text-[#F27D26]" />
                    <span className="text-sm text-white/85">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-none border border-[#F27D26]/35 bg-[#F27D26]/15 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffb36e]">Quick note</p>
                <p className="mt-2 text-sm leading-6 text-white/85">
                  Everything is presented in a calm, high-contrast layout so users can move from discovery to action without friction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="rounded-none border border-border/70 bg-surface/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F27D26]/10 text-[#F27D26]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-secondary">{item.description}</p>
            </div>
          );
        })}
      </section>

      <section className="overflow-hidden rounded-none border border-border/70 bg-gradient-to-r from-[#F27D26] to-[#ff9b4d] px-6 py-8 text-white shadow-[0_24px_80px_rgba(242,125,38,0.18)] sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/80">Ready to start</p>
            <h3 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">Jump straight into the catalogue or admin panel.</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onOpenCatalogue}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-[#F27D26] transition hover:-translate-y-0.5"
            >
              Explore Catalogue
            </button>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/20"
            >
              Open Admin
            </button>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-none border border-border/70 bg-surface/80 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-4 px-2 sm:px-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#F27D26]">Campus highlights</p>
            <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">Explore Our Learning Spaces</h3>
          </div>
          <div className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:block">Slide {activeSlide + 1} / {sliderItems.length}</div>
        </div>

        <div className="relative overflow-hidden rounded-none">
          {sliderItems.map((item, index) => (
            <div
              key={item.title}
              className={`absolute inset-0 transition-opacity duration-700 ${index === activeSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
              <img src={item.image} alt={item.title} className="h-[24rem] w-full object-cover sm:h-[30rem]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h4 className="font-display text-2xl font-semibold text-white sm:text-3xl">{item.title}</h4>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">{item.description}</p>
              </div>
            </div>
          ))}

          <div className="h-[24rem] w-full sm:h-[30rem]" />
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {sliderItems.map((item, index) => (
            <button
              key={item.title}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`h-2.5 rounded-full transition-all ${index === activeSlide ? 'w-9 bg-[#F27D26]' : 'w-2.5 bg-border hover:bg-[#F27D26]/50'}`}
              aria-label={`Go to ${item.title}`}
            />
          ))}
        </div>
      </section>

      <section ref={quickAccessRef} className="border border-border/70 bg-surface/80 p-6 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#F27D26]">Important facilities</p>
              <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
                Quick Access to SLIIT Services
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-secondary sm:text-base">
                Use these shortcuts to open key SLIIT learning facilities directly from the home page.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {importantFacilities.map((facility) => (
                <div key={facility.title} className="border border-border/70 bg-background/70 p-5">
                  <h4 className="font-display text-xl font-semibold text-primary">{facility.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-secondary">{facility.description}</p>
                  <a
                    href={facility.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#F27D26] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff9548]"
                  >
                    {facility.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-20">
            <div className="[perspective:1200px]">
              <div
                className="border border-border/70 bg-background/80 p-3 transition-transform duration-300"
                style={{
                  transform: `translateY(${imageTranslateY}px) rotateY(${imageRotateY}deg) rotateX(${imageRotateX}deg) scale(${imageScale})`,
                  transformStyle: 'preserve-3d',
                }}
              >
                <div className="relative overflow-hidden border border-border/70 bg-black/80">
                  <img src={libraryImage} alt="SLIIT library facility" className="h-[24rem] w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ffb36e]">3D scroll showcase</p>
                    <h4 className="mt-1 font-display text-xl font-semibold text-white">SLIIT Learning Facility</h4>
                    <p className="mt-1 text-sm text-white/85">The card tilts and moves as you scroll through quick-access services.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CPPilotAssistant />

      <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-border/70 bg-surface/80 py-4 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="social-marquee-ltr">
          {[...socialTickerItems, ...socialTickerItems].map((item, index) => (
            <span key={`${item.text}-${index}`} className="social-marquee-item">
              <item.icon className="h-4 w-4 text-[#F27D26]" />
              <span>{item.text}</span>
            </span>
          ))}
        </div>
      </section>

      <footer className="relative left-1/2 w-screen -translate-x-1/2 border-y border-border/70 bg-background/70 px-6 py-8 backdrop-blur-xl sm:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#F27D26]">Campus platform</p>
            <h4 className="mt-3 font-display text-3xl font-bold tracking-tight text-primary">SLIIT University</h4>
            <p className="mt-3 max-w-lg text-sm leading-6 text-secondary">
              Smart Campus Operations Hub helps students and staff explore spaces, monitor availability, and coordinate resource usage efficiently.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Quick options</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary">
              <li>
                <button onClick={onOpenCatalogue} className="transition hover:text-primary">Browse Catalogue</button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="transition hover:text-primary">Admin Workspace</button>
              </li>
              <li>
                <button onClick={onOpenCatalogue} className="transition hover:text-primary">Resource Types</button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">More</p>
            <ul className="mt-4 space-y-2 text-sm text-secondary">
              <li><a href="#" className="transition hover:text-primary">About SLIIT</a></li>
              <li><a href="#" className="transition hover:text-primary">Help Center</a></li>
              <li><a href="#" className="transition hover:text-primary">Contact Support</a></li>
              <li><a href="#" className="transition hover:text-primary">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/70 pt-4 text-xs text-secondary">
          <p>© {currentYear} SLIIT University. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};