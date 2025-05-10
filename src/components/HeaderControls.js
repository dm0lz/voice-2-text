import React from 'https://esm.sh/react@18.2.0';
import htm from 'https://esm.sh/htm@3.1.1';

export const HeaderControls = ({
  isRecording,
  onToggleRecording,
  disabled,
  browserInfo,
  entries,
  onClearAll
}) => {
  const html = htm.bind(React.createElement);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isAboutOpen, setIsAboutOpen] = React.useState(false);

  const getButtonTitle = () => {
    if (!disabled) return '';
    if (browserInfo?.isFirefox && browserInfo?.isMacOS) {
      return 'Speech recognition is not supported in Firefox on macOS. Please use Chrome or Safari for voice input.';
    }
    return 'Speech recognition is not supported in your browser';
  };

  const handleDownload = () => {
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chatlog-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all messages? This action cannot be undone.')) {
      onClearAll();
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.menu-container')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return html`
    <header class="fixed top-0 left-0 right-0 z-10 bg-black shadow-md">
      <div class="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-3 flex-1">
          <div class="relative">
            <button
              onClick=${() => window.location.href = '/'}
              class="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
              title="Go to home"
            >
              <svg class="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 14h2v6H4z" fill="currentColor"/>
                <path d="M8 6h2v14H8z" fill="currentColor"/>
                <path d="M12 8h2v12h-2z" fill="currentColor"/>
                <path d="M16 4h2v16h-2z" fill="currentColor"/>
                <path d="M20 10h2v10h-2z" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="flex-1 flex justify-end hidden sm:flex mr-3">
          ${isRecording && html`
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-red-500 font-medium animate-pulse">Recording</span>
            </div>
          `}
        </div>
        <div class="flex items-center space-x-3 items-center">
          <div class="relative menu-container">
            <button
              onClick=${() => setIsMenuOpen(!isMenuOpen)}
              class="p-2 rounded-full bg-gray-700 focus:outline-none"
              title="More options"
            >
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            ${isMenuOpen && html`
              <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <button
                    onClick=${() => {
                      setIsAboutOpen(true);
                      setIsMenuOpen(false);
                    }}
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>About</span>
                  </button>
                  ${entries.length > 0 && html`
                    <button
                      onClick=${handleClearAll}
                      class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Clear All Messages</span>
                    </button>
                  `}
                  <button
                    onClick=${handleDownload}
                    disabled=${entries.length === 0}
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    title=${entries.length === 0 ? 'No messages to download' : 'Download chat history'}
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Download History</span>
                  </button>
                </div>
              </div>
            `}
          </div>
          <button
            onClick=${onToggleRecording}
            disabled=${disabled}
            class="relative group px-6 py-2.5 rounded-full font-semibold transition-all duration-300 focus:outline-none shadow-sm
              ${disabled ? 'bg-gray-300 cursor-not-allowed' : 
                isRecording ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg shadow-red-200' : 
                'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-blue-200'}"
            title=${getButtonTitle()}
          >
            <div class="flex items-center space-x-2 whitespace-nowrap">
              ${isRecording ? html`
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                <span>Stop Recording</span>
              ` : html`
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Start Recording</span>
              `}
            </div>
            ${!disabled && html`
              <div class="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            `}
          </button>
        </div>
      </div>
    </header>

    ${isAboutOpen && html`
      <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick=${() => setIsAboutOpen(false)}
      >
        <div
          class="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-lg relative max-h-[90vh] overflow-y-auto"
          onClick=${(e) => e.stopPropagation()}
        >
          <button
            onClick=${() => setIsAboutOpen(false)}
            class="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
            title="Close"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 class="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 pr-8">About This App</h2>
          <div class="space-y-3 sm:space-y-4">
            <p class="text-sm sm:text-base">
              Welcome to Voice 2 Text - a powerful, privacy-focused speech recognition tool that converts your voice into text in real-time. This app is completely free to use with no limitations or hidden costs.
            </p>
            
            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">How It Works</h3>
              <ul class="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                <li>Uses Google's Speech Recognition API for accurate voice-to-text conversion</li>
                <li>Real-time transcription with continuous recording capability</li>
                <li>All data is stored locally in your browser using IndexedDB</li>
                <li>No server-side storage - your conversations stay private</li>
                <li>Download your conversation history as JSON at any time</li>
              </ul>
            </div>

            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">Privacy & Security</h3>
              <p class="text-sm sm:text-base text-gray-700">
                Your privacy is our priority. All voice processing happens in your browser, and your data never leaves your device. You have full control over your conversation history - delete individual messages or clear all data at any time.
              </p>
            </div>

            <div>
              <h3 class="font-semibold text-base sm:text-lg mb-2">Features</h3>
              <ul class="list-disc list-inside space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
                <li>Unlimited voice recording and transcription</li>
                <li>Manual text input option</li>
                <li>Message history with timestamps</li>
                <li>Export functionality for your conversations</li>
                <li>Responsive design for all devices</li>
              </ul>
            </div>

            <p class="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">© 2025 Voice 2 Text - Your Privacy-First Speech Recognition Tool</p>
          </div>
        </div>
      </div>
    `}
  `;
};