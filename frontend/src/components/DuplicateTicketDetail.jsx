// src/components/DuplicateTicketDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const DuplicateTicketDetail = () => {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [candidates, setCandidates] = useState({ existing: null, new: null });
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  useEffect(() => {
    fetchTicketDetails();
  }, [ticketId]);
  
  const fetchTicketDetails = async () => {
    try {
      const ticketDoc = await getDoc(doc(db, 'duplicate_tickets', ticketId));
      if (ticketDoc.exists()) {
        const ticketData = { id: ticketDoc.id, ...ticketDoc.data() };
        setTicket(ticketData);
        
        // Fetch both candidates
        const existingDoc = await getDoc(doc(db, 'candidates', ticketData.primaryCandidateId));
        const newDoc = await getDoc(doc(db, 'candidates', ticketData.duplicateCandidateId));
        
        setCandidates({
          existing: existingDoc.exists() ? { id: existingDoc.id, ...existingDoc.data() } : null,
          new: newDoc.exists() ? { id: newDoc.id, ...newDoc.data() } : null
        });
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAction = async (actionType) => {
    try {
      await updateDoc(doc(db, 'duplicate_tickets', ticket.id), {
        status: actionType === 'merge' ? 'merged' : 'separate',
        resolvedAt: new Date(),
        resolvedBy: currentUser.uid,
        action: actionType,
        notes: notes
      });
      
      // Add activity log
      await addDoc(collection(db, 'candidates', ticket.primaryCandidateId, 'activities'), {
        action: `Ticket resolved: ${actionType}`,
        timestamp: new Date(),
        userId: currentUser.uid,
        details: { ticketId: ticket.ticketId, notes }
      });
      
      navigate('/duplicate-tickets');
    } catch (error) {
      console.error('Error processing action:', error);
    }
  };
  
  if (loading) return <div className="text-center py-12">Loading ticket details...</div>;
  if (!ticket) return <div className="text-center py-12">Ticket not found</div>;
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Duplicate Ticket #{ticket.ticketId}</h1>
      
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* New Candidate */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4 text-blue-600">New Applicant</h3>
          {candidates.new && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {candidates.new.fullName}</p>
              <p><strong>Email:</strong> {candidates.new.email}</p>
              <p><strong>Phone:</strong> {candidates.new.phone}</p>
              <p><strong>Role:</strong> {candidates.new.appliedRole}</p>
              <p><strong>Submitted:</strong> {new Date(candidates.new.createdAt).toLocaleString()}</p>
            </div>
          )}
        </div>
        
        {/* Existing Candidate */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-bold text-lg mb-4 text-slate-600">Existing Candidate</h3>
          {candidates.existing && (
            <div className="space-y-3">
              <p><strong>Name:</strong> {candidates.existing.fullName}</p>
              <p><strong>Email:</strong> {candidates.existing.email}</p>
              <p><strong>Phone:</strong> {candidates.existing.phone}</p>
              <p><strong>Status:</strong> {candidates.existing.status}</p>
              <p><strong>Since:</strong> {new Date(candidates.existing.createdAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Match Information */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="font-bold mb-3">Match Information</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-slate-600">Confidence Score</p>
            <p className="text-2xl font-bold text-blue-600">{ticket.confidenceScore}%</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Email Match</p>
            <p className="font-semibold">{ticket.matchFields?.email ? '✓ Yes' : '✗ No'}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Phone Match</p>
            <p className="font-semibold">{ticket.matchFields?.phone ? '✓ Yes' : '✗ No'}</p>
          </div>
        </div>
      </div>
      
      {/* Notes and Actions */}
      <div className="bg-white rounded-lg border p-6">
        <textarea
          placeholder="Add resolution notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 border rounded-lg mb-6"
          rows={4}
        />
        
        <div className="flex gap-4">
          <button
            onClick={() => handleAction('merge')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Merge Profiles
          </button>
          <button
            onClick={() => handleAction('separate')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Keep Separate
          </button>
          <button
            onClick={() => navigate('/duplicate-tickets')}
            className="px-6 py-2 border rounded-lg hover:bg-gray-50"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateTicketDetail;