import { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertImage = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      document.execCommand('insertImage', false, url);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  // Fokus ke editor saat komponen dimuat jika value kosong
  useEffect(() => {
    if (value === '' && editorRef.current) {
      editorRef.current.focus();
    }
  }, [value]);

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
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
      />
      <div className="p-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-t border-gray-300 dark:border-gray-600">
        Gunakan toolbar di atas untuk memformat teks Anda
      </div>
    </div>
  );
}