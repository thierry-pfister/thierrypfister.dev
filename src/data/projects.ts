import type { Project } from '@/types/project'

export const projects: readonly Project[] = [
  {
    id: 'pfstr-portfolio',
    title: 'PFSTR_ Portfolio',
    description: 'This site — Next.js 16, Three.js, GSAP. Built from scratch.',
    tags: ['Next.js', 'Three.js', 'GSAP', 'TypeScript'],
    gradient: ['#6366F1', '#8B5CF6'],
    href: '/',
  },
  {
    id: 'dashboard-alpha',
    title: 'Dashboard Alpha',
    description: 'Real-time analytics with WebSocket feeds and D3 charts.',
    tags: ['React', 'Node.js', 'WebSocket', 'D3'],
    gradient: ['#F59E0B', '#EF4444'],
    href: '#',
  },
  {
    id: 'storefront',
    title: 'Storefront',
    description: 'Headless e-commerce — Stripe, inventory management, admin panel.',
    tags: ['Next.js', 'Stripe', 'PostgreSQL'],
    gradient: ['#10B981', '#06B6D4'],
    href: '#',
  },
  {
    id: 'api-gateway',
    title: 'API Gateway',
    description: 'High-throughput REST API — Redis cache, JWT auth, CI/CD pipeline.',
    tags: ['Node.js', 'Redis', 'Docker'],
    gradient: ['#7C3AED', '#EC4899'],
    href: '#',
  },
  {
    id: 'motion-lab',
    title: 'Motion Lab',
    description: 'Experimental Three.js — custom shaders, particles, post-processing.',
    tags: ['Three.js', 'GLSL', 'WebGL'],
    gradient: ['#3B82F6', '#14B8A6'],
    href: '#',
  },
]
