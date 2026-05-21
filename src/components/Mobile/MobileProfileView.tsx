import { Home, Github, TrendingUp } from 'lucide-react';

const HOST_URL = import.meta.env.VITE_HOST_URL || 'http://localhost:3000';
const GITHUB_URL = 'https://github.com/OmarZambranoDev/portfolio-music';

interface Project {
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
}

const PROJECTS: Project[] = [
  {
    name: 'Trade App',
    description:
      'Real-time stock trading simulator with interactive charts and portfolio tracking.',
    icon: TrendingUp,
    url: `${HOST_URL}/trade`,
  },
];

export function MobileProfileView() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-earth-forest mb-4">Profile</h1>
        <div className="space-y-2">
          <a
            href={HOST_URL}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-earth-stone/70 text-earth-forest hover:bg-earth-stone/10 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Omar's Portfolio</span>
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-earth-stone/70 text-earth-forest hover:bg-earth-stone/10 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>View Source on GitHub</span>
          </a>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-earth-sage uppercase tracking-wider mb-3">
          Projects
        </h2>
        <div className="space-y-2">
          {PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.url}
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white border border-earth-stone/70 hover:bg-earth-stone/10 transition-colors"
            >
              <project.icon className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="font-medium text-earth-forest">{project.name}</p>
                <p className="text-xs text-earth-moss">{project.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
