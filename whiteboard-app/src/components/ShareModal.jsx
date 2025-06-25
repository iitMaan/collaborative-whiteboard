import { Dialog } from '@headlessui/react';
import { useState } from 'react';

const ShareModal = ({ roomId, isOpen, onClose }) => {
  const origin = window.location.origin;
  const editLink = `${origin}/${roomId}?permission=edit`;
  const viewLink = `${origin}/${roomId}?permission=view`;

  const [copied, setCopied] = useState('');

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-gray-300">
          <Dialog.Title className="text-2xl font-bold text-gray-800 mb-6 text-center">
            🔗 Share Room
          </Dialog.Title>

          <div className="space-y-5">
            {/* Edit Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Edit Link</label>
              <div className="flex gap-2">
                <input
                  value={editLink}
                  readOnly
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleCopy(editLink, 'edit')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Copy
                </button>
              </div>
              {copied === 'edit' && (
                <p className="text-green-600 text-xs mt-1">✅ Copied edit link!</p>
              )}
            </div>

            <hr className="border-t border-gray-200" />

            {/* View Link */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">View-Only Link</label>
              <div className="flex gap-2">
                <input
                  value={viewLink}
                  readOnly
                  className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={() => handleCopy(viewLink, 'view')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition"
                >
                  Copy
                </button>
              </div>
              {copied === 'view' && (
                <p className="text-green-600 text-xs mt-1">✅ Copied view-only link!</p>
              )}
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline transition"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ShareModal;
