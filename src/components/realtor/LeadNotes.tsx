/**
 * Lead Notes Component
 * Add notes and track contact status for leads
 */

'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Clock, XCircle, Plus } from 'lucide-react';

interface Note {
  id: string;
  note: string;
  status: 'not_contacted' | 'contacted' | 'interested' | 'not_interested';
  created_at: string;
}

interface LeadNotesProps {
  leadId: string;
}

const statusOptions = [
  { value: 'not_contacted', label: 'Not Contacted', icon: Clock, color: 'text-gray-600 bg-gray-50' },
  { value: 'contacted', label: 'Contacted', icon: CheckCircle, color: 'text-blue-600 bg-blue-50' },
  { value: 'interested', label: 'Interested', icon: CheckCircle, color: 'text-green-600 bg-green-50' },
  { value: 'not_interested', label: 'Not Interested', icon: XCircle, color: 'text-red-600 bg-red-50' },
];

export function LeadNotes({ leadId }: LeadNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [status, setStatus] = useState<'not_contacted' | 'contacted' | 'interested' | 'not_interested'>('not_contacted');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [leadId]);

  async function loadNotes() {
    try {
      const response = await fetch(`/api/realtor/leads/${leadId}/notes`);
      const data = await response.json();
      setNotes(data.notes || []);
      
      // Set current status from most recent note
      if (data.notes && data.notes.length > 0) {
        setStatus(data.notes[0].status);
      }
    } catch (error) {
      console.error('Load notes error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addNote() {
    if (!newNote.trim()) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/realtor/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote, status }),
      });

      if (response.ok) {
        setNewNote('');
        loadNotes();
      }
    } catch (error) {
      console.error('Add note error:', error);
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(newStatus: typeof status) {
    setSaving(true);
    try {
      const response = await fetch(`/api/realtor/leads/${leadId}/notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        loadNotes();
      }
    } catch (error) {
      console.error('Update status error:', error);
    } finally {
      setSaving(false);
    }
  }

  const currentStatus = statusOptions.find(s => s.value === status);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          Notes & Status
        </h3>
        
        {/* Status Badge */}
        {currentStatus && (
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${currentStatus.color}`}>
            <currentStatus.icon className="w-4 h-4" />
            {currentStatus.label}
          </div>
        )}
      </div>

      {/* Status Selector */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {statusOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => updateStatus(option.value as typeof status)}
              disabled={saving}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border-2 transition-all ${
                status === option.value
                  ? `${option.color} border-current`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Note */}
      <div className="mb-4">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a note about this lead..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
        <button
          onClick={addNote}
          disabled={!newNote.trim() || saving}
          className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {loading ? (
          <div className="text-center text-gray-500 py-4">Loading notes...</div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No notes yet. Add your first note above.</div>
        ) : (
          notes.map((note) => {
            const noteStatus = statusOptions.find(s => s.value === note.status);
            return (
              <div key={note.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between mb-1">
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${noteStatus?.color || 'bg-gray-100 text-gray-600'}`}>
                    {noteStatus && <noteStatus.icon className="w-3 h-3" />}
                    {noteStatus?.label || note.status}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{note.note}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
