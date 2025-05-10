import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

export const MessageList = ({ entries, onRemove }) => {
  const html = htm.bind(React.createElement);
  const messagesEndRef = React.useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [entries]);

  const handleRemove = (e) => {
    const timestamp = Number(e.currentTarget.getAttribute("data-timestamp"));
    onRemove({ target: { getAttribute: () => timestamp } });
  };

  return html`
    <div class="flex flex-col gap-4 px-2 pb-32 pt-24 max-w-2xl mx-auto">
      ${entries.map((entry, idx) => {
        const isUser = true; // All messages are user for now
        return html`
          <div class="flex ${isUser ? 'justify-end' : 'justify-start'} group">
            <div class="relative max-w-[100%]">
              <div class="rounded-2xl px-5 py-3 shadow-md transition-all duration-200
                ${isUser ? 'bg-red-50 text-gray-600' : 'bg-gray-200 text-gray-800'}">
                <p class="break-words">${entry.content}</p>
                <span class="block text-xs text-gray-400 mt-2 text-right select-none">
                  ${new Date(parseInt(entry.timestamp)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <button
                class="absolute -right-3 -top-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white border border-gray-300 rounded-full p-1 shadow hover:bg-red-100"
                onClick=${handleRemove}
                data-timestamp=${entry.timestamp}
                title="Remove"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        `;
      })}
      <div ref=${messagesEndRef} />
    </div>
  `;
};