import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

export const MessageInput = ({ value, onChange, onSubmit }) => {
  const html = htm.bind(React.createElement);

  return html`
    <form
      onSubmit=${(e) => {
        e.preventDefault();
        onSubmit();
      }}
      class="fixed bottom-0 left-0 right-0 z-10 bg-white border-t shadow-lg px-4 py-3 flex justify-center"
    >
      <div class="flex w-full max-w-2xl gap-2">
        <input
          type="text"
          value=${value}
          onChange=${onChange}
          placeholder="Type a message..."
          class="flex-1 p-3 rounded-full border border-gray-300 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          class="px-6 py-2 rounded-full bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          Enter
        </button>
      </div>
    </form>
  `;
};