export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'md' | 'dir' | 'link';
  content?: string;
  slug?: string;
}

export type ThemeName = 'dracula' | 'gruvbox' | 'hacker' | 'github';

export interface Command {
  name: string;
  execute: (arg?: string) => void;
  description?: string;
}

export interface CommandResponse {
  text: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}
