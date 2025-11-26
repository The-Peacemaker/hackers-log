'use client';

import { FileItem } from '@/types';
import { useRouter } from 'next/navigation';

interface PreviewPaneProps {
  file: FileItem;
}

export default function PreviewPane({ file }: PreviewPaneProps) {
  const router = useRouter();

  if (file.type === 'link') {
    router.push('https://benedii.netlify.app/');
    return null;
  }

  return (
    <div
      className="file-preview flex-1 p-10 overflow-y-auto text-sm leading-relaxed transition-all duration-500"
      style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
      dangerouslySetInnerHTML={{ __html: file.content || '' }}
    />
  );
}
