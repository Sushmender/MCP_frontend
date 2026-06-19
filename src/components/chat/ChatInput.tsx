import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (text: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content height
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }, [text]);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setText('');
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-card/60 backdrop-blur-md p-4 shrink-0">
      <div className="max-w-3xl mx-auto relative flex items-end gap-2 border border-input rounded-xl bg-background shadow-sm hover:border-muted-foreground/30 focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-200 pl-3 pr-2 py-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder || 'Ask about papers, or type @topic, /prompts...'}
          rows={1}
          className="flex-1 max-h-[200px] resize-none outline-none border-none bg-transparent text-sm py-1.5 pr-2 focus:ring-0 placeholder:text-muted-foreground/60 text-foreground"
        />

        <button
          onClick={handleSubmit}
          disabled={disabled || !text.trim()}
          className="p-2 rounded-lg bg-primary hover:bg-primary/95 text-primary-foreground transition-all duration-250 disabled:opacity-30 disabled:hover:bg-primary shrink-0 flex items-center justify-center h-9 w-9 shadow-sm"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <div className="max-w-3xl mx-auto mt-2 flex justify-between items-center text-[10px] text-muted-foreground/80 px-1">
        <div>
          <span>Tip: Use </span>
          <code className="font-mono text-foreground font-semibold">@topic</code>
          <span> to browse, </span>
          <code className="font-mono text-foreground font-semibold">/prompts</code>
          <span> to view research workflows.</span>
        </div>
        <div className="hidden sm:block">Press Enter to send, Shift+Enter for newline</div>
      </div>
    </div>
  );
}
