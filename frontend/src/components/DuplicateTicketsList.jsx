// src/components/DuplicateTicketsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FiEye } from 'react-icons/fi';

const DuplicateTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchTickets();
  }, [filter]);
  
  const fetchTickets = async () => {
    setLoading(true);
    try {
      let q = query(
        collection(db, 'duplicate_tickets'),
        orderBy('createdAt', 'desc')
      );
      
      if (filter !== 'all') {
        q = query(q, where('status', '==', filter));
      }
      
      const snapshot = await getDocs(q);
      const ticketsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Fetch candidate details for each ticket
      const ticketsWithCandidates = await Promise.all(
        ticketsData.map(async (ticket) => {
          const existingCandidate = await getDoc(doc(db, 'candidates', ticket.primaryCandidateId));
          const newCandidate = await getDoc(doc(db, 'candidates', ticket.duplicateCandidateId));
          
          return {
            ...ticket,
            existingCandidate: existingCandidate.exists() ? existingCandidate.data() : null,
            newCandidate: newCandidate.exists() ? newCandidate.data() : null
          };
        })
      );
      
      setTickets(ticketsWithCandidates);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'merged': return 'bg-green-100 text-green-800';
      case 'separate': return 'bg-blue-100 text-blue-800';
      case 'info_requested': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getConfidenceColor = (score) => {
    if (score >= 85) return 'text-red-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-yellow-600';
  };
  
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Duplicate Resolution Tickets</h1>
        <p className="text-slate-500 mt-1">Manage and resolve candidate duplicate tickets</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {['all', 'pending', 'merged', 'separate', 'info_requested'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 capitalize ${filter === status ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500'}`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>
      
      {/* Tickets List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No tickets found</div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-slate-500">#{ticket.ticketId}</span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span className={`text-sm font-bold ${getConfidenceColor(ticket.confidenceScore)}`}>
                      {ticket.confidenceScore}% Match
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-slate-500">New Applicant</p>
                      <p className="font-medium">{ticket.newCandidate?.fullName || 'Unknown'}</p>
                      <p className="text-sm text-slate-600">{ticket.newCandidate?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Existing Candidate</p>
                      <p className="font-medium">{ticket.existingCandidate?.fullName || 'Unknown'}</p>
                      <p className="text-sm text-slate-600">{ticket.existingCandidate?.email}</p>
                    </div>
                  </div>
                  
                  {/* Match indicators */}
                  <div className="flex gap-4 mt-3">
                    {ticket.matchFields?.email && (
                      <span className="text-xs text-green-600">✓ Email match</span>
                    )}
                    {ticket.matchFields?.phone && (
                      <span className="text-xs text-green-600">✓ Phone match</span>
                    )}
                    {ticket.matchFields?.name?.similarity > 80 && (
                      <span className="text-xs text-green-600">✓ Name match ({ticket.matchFields.name.similarity}%)</span>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-3">
                    Created: {ticket.createdAt?.toDate ? new Date(ticket.createdAt.toDate()).toLocaleDateString() : new Date(ticket.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                <button
                  onClick={() => navigate(`/review-duplicate/${ticket.ticketId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <FiEye size={16} />
                  Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DuplicateTicketsList;