import React, { useState, useEffect } from 'react';
import { connectionService } from '../api/connectionService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { UserCheck, Check, X, Clock, Send, Inbox } from 'lucide-react';

export default function ConnectionRequestsPage() {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const [received, sent] = await Promise.all([
        connectionService.getReceivedRequests().catch(() => []),
        connectionService.getSentRequests().catch(() => []),
      ]);
      setReceivedRequests(Array.isArray(received) ? received : []);
      setSentRequests(Array.isArray(sent) ? sent : []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    setActionLoadingId(id);
    try {
      await connectionService.acceptConnectionRequest(id);
      setReceivedRequests((prev) => prev.filter((r) => (r.id || r.connectionId) !== id));
    } catch (err) {
      alert(`Failed to accept request: ${getErrorMessage(err)}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoadingId(id);
    try {
      await connectionService.rejectConnectionRequest(id);
      setReceivedRequests((prev) => prev.filter((r) => (r.id || r.connectionId) !== id));
    } catch (err) {
      alert(`Failed to reject request: ${getErrorMessage(err)}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Connection Requests
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Manage your incoming invitations and review sent networking requests.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('received')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'received'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Inbox className="h-4 w-4" />
          Received Invitations ({receivedRequests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('sent')}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === 'sent'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Send className="h-4 w-4" />
          Sent Invitations ({sentRequests.length})
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchRequests} />}

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Loading connection requests..." size="lg" className="py-20" />
      ) : activeTab === 'received' ? (
        receivedRequests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {receivedRequests.map((req) => {
              const reqId = req.id || req.connectionId;
              const senderName = req.senderName || req.sender?.name || req.name || 'Student Peer';
              const senderEducation = req.senderEducation || req.sender?.education || req.sender?.profile?.education;

              return (
                <div key={reqId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-sm">
                      {senderName[0]?.toUpperCase() || 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{senderName}</h4>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{senderEducation || 'Student'}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(reqId)}
                      disabled={actionLoadingId === reqId}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" />
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccept(reqId)}
                      disabled={actionLoadingId === reqId}
                      className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Inbox}
            title="No received requests"
            description="You do not have any pending connection invitations from students."
          />
        )
      ) : sentRequests.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sentRequests.map((req) => {
            const reqId = req.id || req.connectionId;
            const receiverName = req.receiverName || req.receiver?.name || req.name || 'Student Peer';
            const status = req.status || 'PENDING';

            return (
              <div key={reqId} className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-sm">
                    {receiverName[0]?.toUpperCase() || 'S'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{receiverName}</h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">Invitation sent</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-amber-700 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {status}
                  </span>
                  <span className="text-slate-400 text-[11px]">Awaiting response</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Send}
          title="No sent requests"
          description="You have not sent any pending connection requests."
          actionLabel="Discover Students"
          onAction={() => (window.location.href = '/student/network')}
        />
      )}
    </div>
  );
}
