import React, { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import { Settings as SettingsIcon, Save, RefreshCw, Download, Upload } from 'lucide-react';

export default function Settings() {
  const { state, dispatch } = useLibrary();
  const [settings, setSettings] = useState({
    libraryName: 'Narula Institute of Technology Library',
    maxBooksPerStudent: 3,
    defaultIssuePeriod: 14,
    finePerDay: 2,
    maxRenewalDays: 7,
    allowRenewal: true,
  });

  const handleSaveSettings = () => {
    // In a real application, these would be saved to a backend
    localStorage.setItem('librarySettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const dataToExport = {
      users: state.users,
      books: state.books,
      issues: state.issues,
      fines: state.fines,
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-data-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        if (confirm('This will replace all current data. Are you sure?')) {
          if (importedData.users) dispatch({ type: 'LOAD_DATA', payload: { users: importedData.users } });
          if (importedData.books) dispatch({ type: 'LOAD_DATA', payload: { books: importedData.books } });
          if (importedData.issues) dispatch({ type: 'LOAD_DATA', payload: { issues: importedData.issues } });
          if (importedData.fines) dispatch({ type: 'LOAD_DATA', payload: { fines: importedData.fines } });
          
          alert('Data imported successfully!');
        }
      } catch (error) {
        alert('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('This will delete all data and cannot be undone. Are you sure?')) {
      if (confirm('Are you absolutely sure? This action is irreversible.')) {
        localStorage.removeItem('libraryData');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* Library Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Library Configuration
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Library Name
              </label>
              <input
                type="text"
                value={settings.libraryName}
                onChange={(e) => setSettings({ ...settings, libraryName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Books Per Student
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={settings.maxBooksPerStudent}
                onChange={(e) => setSettings({ ...settings, maxBooksPerStudent: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Issue Period (Days)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={settings.defaultIssuePeriod}
                onChange={(e) => setSettings({ ...settings, defaultIssuePeriod: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fine Per Day (₹)
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={settings.finePerDay}
                onChange={(e) => setSettings({ ...settings, finePerDay: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Renewal Days
              </label>
              <input
                type="number"
                min="1"
                max="14"
                value={settings.maxRenewalDays}
                onChange={(e) => setSettings({ ...settings, maxRenewalDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowRenewal"
                checked={settings.allowRenewal}
                onChange={(e) => setSettings({ ...settings, allowRenewal: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="allowRenewal" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Allow Book Renewals
              </label>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Data Management</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </button>

            <label className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer">
              <Upload className="h-5 w-5 mr-2" />
              Import Data
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>

            <button
              onClick={handleResetData}
              className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Reset All Data
            </button>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Data Management Notes:</h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>• Export creates a backup of all library data</li>
              <li>• Import will replace current data with imported data</li>
              <li>• Reset will permanently delete all data</li>
              <li>• Always create backups before making major changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Information</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Users:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{state.users.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Books:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{state.books.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Issues:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{state.issues.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Total Fines:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{state.fines.length}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Version:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">1.0.0</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Last Updated:</span>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-200 mb-2">About</h3>
        <p className="text-blue-800 dark:text-blue-300 text-sm mb-4">
          Narula Institute of Technology Library Management System - A comprehensive solution for managing library operations, 
          book inventory, student records, and fine management.
        </p>
        <p className="text-blue-700 dark:text-blue-400 text-sm font-medium">
          Library Management System proudly built by Kris Mehra © 2025
        </p>
      </div>
    </div>
  );
}