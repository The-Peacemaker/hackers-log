'use client';

import { FileItem } from '@/types';

interface FileListProps {
  files: FileItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

function getIcon(type: string) {
  const iconClass = "mr-3 w-4 text-center";
  
  if (type === 'dir') return <i className={`fa-solid fa-folder ${iconClass}`} style={{ color: 'var(--purple)' }}></i>;
  if (type === 'md') return <i className={`fa-brands fa-markdown ${iconClass}`} style={{ color: 'var(--yellow)' }}></i>;
  if (type === 'link') return <i className={`fa-solid fa-lock ${iconClass}`} style={{ color: 'var(--red)' }}></i>;
  return <i className={`fa-solid fa-file-lines ${iconClass}`} style={{ color: 'var(--cyan)' }}></i>;
}

export default function FileList({ files, selectedIndex, onSelect }: FileListProps) {
  return (
    <div
      className="w-[300px] flex-shrink-0 flex flex-col py-2.5 overflow-y-auto transition-all duration-500"
      style={{ borderRight: `2px solid var(--curr-line)` }}
    >
      {files.map((file, index) => (
        <div
          key={file.id}
          onClick={() => onSelect(index)}
          className={`px-4 py-1.5 cursor-pointer flex items-center text-[13px] transition-all duration-200 ${
            index === selectedIndex
              ? 'font-bold opacity-100'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: index === selectedIndex ? 'var(--curr-line)' : 'transparent',
            color: index === selectedIndex ? 'var(--pink)' : 'var(--fg)',
            borderLeft: index === selectedIndex ? '3px solid var(--pink)' : '3px solid transparent',
          }}
        >
          {getIcon(file.type)}
          {file.name}
        </div>
      ))}
    </div>
  );
}
