// src/components/BulkDuplicateResolution.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';

const BulkDuplicateResolution = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [bulkAction, setBulkAction] = useState('merge');
  const [processing, setProcessing] = useState(false);
  
  useEffect(() => {
    fetchPendingTickets();
  }, []);
  
  const fetchPendingTickets = async () => {
    const q = query(
      collection(db, 'duplicate_tickets'),
      where('status', '==', 'pending')
    );
    const snapshot = await getDocs(q);
    const ticketsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTickets(ticketsData);
  };
  
  const toggleSelect = (ticketId) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };
  
  const toggleSelectAll = () => {
    if (selectedTickets.size === tickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(tickets.map(t => t.id)));
    }
  };
  
  const handleBulkAction = async () => {
    if (selectedTickets.size === 0) return;
    
    setProcessing(true);
    const batch = writeBatch(db);
    
    selectedTickets.forEach(ticketId => {
      const ticketRef = doc(db, 'duplicate_tickets', ticketId);
      batch.update(ticketRef, {
        status: bulkAction === 'merge' ? 'merged' : 'separate',
        resolvedAt: new Date(),
        action: bulkAction,
        bulkProcessed: true
      });
    });
    
    await batch.commit();
    alert(`Successfully processed ${selectedTickets.size} tickets!`);
    setSelectedTickets(new Set());
    fetchPendingTickets();
    setProcessing(false);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bulk Duplicate Resolution</h1>
        <p className="text-slate-500">Resolve multiple duplicate tickets at once</p>
      </div>
      
      {tickets.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              {selectedTickets.size === tickets.length ? <FiCheckSquare /> : <FiSquare />}
              {selectedTickets.size === tickets.length ? 'Deselect All' : 'Select All'}
            </button>
            <span className="text-sm text-slate-500">
              {selectedTickets.size} of {tickets.length} selected
            </span>
          </div>
          
          <div className="flex gap-3">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="merge">Merge All</option>
              <option value="separate">Keep Separate</option>
            </select>
            
            <button
              onClick={handleBulkAction}
              disabled={selectedTickets.size === 0 || processing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {processing ? 'Processing...' : `Apply to ${selectedTickets.size} Tickets`}
            </button>
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-white border rounded-lg p-4 flex items-center gap-4">
            <button onClick={() => toggleSelect(ticket.id)}>
              {selectedTickets.has(ticket.id) ? <FiCheckSquare className="text-blue-600" /> : <FiSquare />}
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono">#{ticket.ticketId}</span>
                <span className="text-sm font-medium">{ticket.confidenceScore}% Match</span>
              </div>
              <div className="text-sm text-slate-600 mt-1">
                New: {ticket.duplicateCandidateId?.slice(-6)} | 
                Existing: {ticket.primaryCandidateId?.slice(-6)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BulkDuplicateResolution;