// QuillEditor.tsx
import React, { useEffect, useRef } from 'react';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const quillContainerRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    const loadQuill = async () => {
      if (!quillContainerRef.current) return;

      const Quill = (await import('quill')).default;

      // Check if Quill is already initialized
      if (!quillRef.current) {
        quillRef.current = new Quill(quillContainerRef.current, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'], // toggled buttons
              ['blockquote', 'code-block'],
              [{ list: 'ordered' }, { list: 'bullet' }],
              [{ script: 'sub' }, { script: 'super' }],
              [{ indent: '-1' }, { indent: '+1' }],
              [{ direction: 'rtl' }],
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              [{ color: [] }, { background: [] }],
              [{ font: [] }],
              [{ align: [] }],
              ['link'], // add 'image' and 'video' modules
              ['clean'], // remove formatting button
            ],
          },
        });

        const quill = quillRef.current;

        quill?.on('text-change', () => {
          const content = quill.root.innerHTML;
          onChange(content);
        });

        // Set initial content
        if(quill)
        quill.root.innerHTML = value;
      }
    };

    // Check if window is defined (client-side) before loading Quill
    if (typeof window !== 'undefined') {
      loadQuill();
    }
  }, [value, onChange]);

  return <div ref={quillContainerRef} style={{ height: '400px' }} />;
};

export default QuillEditor;
