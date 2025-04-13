'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Modal from '@/components/ui/modal';

export default function ModalExamplePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('default');

  const openModal = (type: string) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8 text-white">Flowbite-Inspired Dark Mode Modals</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Default Modal</h2>
          <p className="text-gray-300 mb-4">A standard modal with a title, content and footer.</p>
          <Button variant="blue" onClick={() => openModal('default')}>
            Open Modal
          </Button>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Large Modal</h2>
          <p className="text-gray-300 mb-4">A larger sized modal for more content.</p>
          <Button variant="green" onClick={() => openModal('large')}>
            Open Large Modal
          </Button>
        </div>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-white">Confirmation Modal</h2>
          <p className="text-gray-300 mb-4">A modal for confirming user actions.</p>
          <Button variant="red" onClick={() => openModal('confirmation')}>
            Open Confirmation
          </Button>
        </div>
      </div>

      {/* Default Modal */}
      {modalType === 'default' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Default Modal"
          description="This is a standard modal dialog based on Flowbite design"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline-dark" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="blue">Confirm</Button>
            </div>
          }
        >
          <div className="text-gray-300">
            <p className="mb-4">
              This modal features a header with a title and description, content area, and a footer
              with action buttons.
            </p>
            <p>
              Use modals to focus user attention on a specific task or piece of information without
              navigating away from the current page.
            </p>
          </div>
        </Modal>
      )}

      {/* Large Modal */}
      {modalType === 'large' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Large Modal"
          size="xl"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="outline-dark" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="text-gray-300">
            <p className="mb-4">
              This is a larger modal that provides more space for content. It's useful for
              displaying forms, detailed information, or when you need to present multiple elements
              within a modal context.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Feature One</h3>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Integer
                  eget justo vel nunc eleifend tincidunt.
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-white mb-2">Feature Two</h3>
                <p className="text-sm">
                  Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis
                  bibendum auctor.
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {modalType === 'confirmation' && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Confirm Action"
          size="sm"
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button
                variant="outline-dark"
                onClick={() => setIsModalOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button variant="red" className="w-full">
                Delete
              </Button>
            </div>
          }
        >
          <div className="text-center text-gray-300">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-900/25 p-3">
                <svg
                  className="h-10 w-10 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Are you sure?</h3>
            <p className="mb-4">
              This action cannot be undone. This will permanently delete the selected item.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
