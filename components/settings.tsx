import { IconX } from '@tabler/icons-react'

interface SettingsProps {
  onClose: () => void;
}

export function Settings({ onClose }: SettingsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">設定</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <IconX className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          {/* Add your settings form fields here */}
          <div>
            <label htmlFor="setting1" className="block text-sm font-medium text-gray-700">
              設定 1
            </label>
            <input
              type="text"
              id="setting1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label htmlFor="setting2" className="block text-sm font-medium text-gray-700">
              設定 2
            </label>
            <input
              type="text"
              id="setting2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

