import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const handleRef = (node: HTMLTextAreaElement | null) => {
      if (node) {
        // Apply auto-resize logic
        node.style.height = "0px";
        node.style.height = node.scrollHeight + "px";

        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
      }
    };

    return (
      <Textarea
        autoComplete="off"
        ref={handleRef}
        name="message"
        className={cn(
          "px-4 py-3 min-h-16 text-sm text-gray-700 placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-2xl flex items-center h-16 bg-white border border-pink-200 shadow-sm focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-200 hover:bg-pink-50/50",
          className
        )}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

export { ChatInput };
