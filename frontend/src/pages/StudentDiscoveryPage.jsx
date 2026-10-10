import React, { useState, useEffect } from 'react';
import { connectionService } from '../api/connectionService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StudentCard from '../components/StudentCard.jsx';

import { Search, Compass, Users } from 'lucide-react';

export default function StudentDiscoveryPage() {
  const [query, setQuery] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track status of request per studentId: 'PENDING', 'ACCEPTED', etc.
  const [requestStates, setRequestStates] = useState({});
  const [connectingId, setConnectingId] = useState(null);

  const fetchStudents = async (searchQuery = '') => {
    setLoading(true);
    setError(null);
    try {
      const data = await connectionService.discoverStudents(searchQuery);
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents(query);
  };

  const handleConnect = async (studentId) => {
    setConnectingId(studentId);
    try {
      await connectionService.sendConnectionRequest(studentId);
      setRequestStates((prev) => ({
        ...prev,
        [studentId]: 'PENDING',
      }));
    } catch (err) {
      alert(`Could not send connection request: ${getErrorMessage(err)}`);
    } finally {
      setConnectingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Discover Student Peers
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Search for fellow university students by programming skills (e.g., Java, React, Python) or name to expand your network.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by skill (e.g. Java, Python) or student name..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
        >
          Search
        </button>
      </form>

      {error && <ErrorMessage message={error} onRetry={() => fetchStudents(query)} />}

      {/* Results */}
      {loading ? (
        <LoadingSpinner message="Searching student directory..." size="lg" className="py-20" />
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => {
            const sId = student.id || student.studentId;
            return (
              <StudentCard
                key={sId}
                student={student}
                onConnect={handleConnect}
                isConnecting={connectingId === sId}
                connectionStatus={requestStates[sId] || student.connectionStatus}
              />
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No students found"
          description={
            query
              ? `No student profiles matched "${query}". Try searching for another skill like "Java", "Python", or "SQL".`
              : "No other student profiles are currently registered in the database."
          }
          actionLabel={query ? "Clear Search" : undefined}
          onAction={query ? () => { setQuery(''); fetchStudents(''); } : undefined}
        />
      )}
    </div>
  );
}
