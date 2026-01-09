import { useState, useRef, useEffect, useCallback } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Update editor content when value prop changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const insertImage = useCallback(() => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      document.execCommand('insertImage', false, url);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  }, [onChange]);

  // Handle focus when component mounts
  useEffect(() => {
    if (value === '' && editorRef.current) {
      // Use a timeout to ensure the editor is rendered before focusing
      const timer = setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.focus();
        }
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [value]);

  // Handle placeholder display
  useEffect(() => {
    if (editorRef.current) {
      if (value === '' && !isFocused && placeholder) {
        editorRef.current.innerHTML = `<span class="text-gray-400 italic">${placeholder}</span>`;
        editorRef.current.classList.add('empty');
      } else if (value === '' && isFocused && placeholder) {
        editorRef.current.innerHTML = '';
        editorRef.current.classList.remove('empty');
      } else if (value !== '' && editorRef.current.classList.contains('empty')) {
        editorRef.current.classList.remove('empty');
      }
    }
  }, [value, isFocused, placeholder]);

  const handleEditorFocus = () => {
    setIsFocused(true);
    if (editorRef.current && editorRef.current.classList.contains('empty')) {
      editorRef.current.innerHTML = '';
      editorRef.current.classList.remove('empty');
    }
  };

  const handleEditorBlur = () => {
    setIsFocused(false);
    if (editorRef.current && editorRef.current.innerHTML === '' && placeholder) {
      editorRef.current.innerHTML = `<span class="text-gray-400 italic">${placeholder}</span>`;
      editorRef.current.classList.add('empty');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Ctrl+B, Ctrl+I, Ctrl+U shortcuts
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormat('bold');
          break;
        case 'i':
          e.preventDefault();
          handleFormat('italic');
          break;
        case 'u':
          e.preventDefault();
          handleFormat('underline');
          break;
      }
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Tebal (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Miring (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Garis Bawah (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6 my-auto"></div>
        <button
          type="button"
          onClick={() => handleFormat('insertUnorderedList')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Daftar Bullet"
        >
          • Bullet
        </button>
        <button
          type="button"
          onClick={() => handleFormat('insertOrderedList')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Daftar Angka"
        >
          1. Number
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6 my-auto"></div>
        <button
          type="button"
          onClick={() => handleFormat('justifyLeft')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Rata Kiri"
        >
          ⊣
        </button>
        <button
          type="button"
          onClick={() => handleFormat('justifyCenter')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Rata Tengah"
        >
          ⊤
        </button>
        <button
          type="button"
          onClick={() => handleFormat('justifyRight')}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Rata Kanan"
        >
          ⊢
        </button>
        <div className="border-r border-gray-300 dark:border-gray-600 mx-1 h-6 my-auto"></div>
        <button
          type="button"
          onClick={insertImage}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          title="Sisipkan Gambar"
        >
          🖼️
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className={`p-4 min-h-[200px] focus:outline-none ${
          isFocused ? 'ring-2 ring-pink-500' : ''
        } bg-white dark:bg-gray-700 text-gray-900 dark:text-white prose prose-pink dark:prose-invert`}
        onInput={handleInput}
        onFocus={handleEditorFocus}
        onBlur={handleEditorBlur}
        onKeyDown={handleKeyDown}
      />
      <div className="p-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
        Gunakan toolbar di atas untuk memformat teks Anda
      </div>
    </div>
  );
}