import { useEffect, useState } from 'react';
import { AlertCircle, User, Calendar, Package, MessageSquare } from 'lucide-react';
import DashboardHeader from '../components/provider/Header';
import authApi from '../config/auth-config';
import Loading from '../components/Loading';

function ComplaintItem({ complaint, onStatusUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (status) => {
    setIsUpdating(true);
    try {
      await authApi.put(`/complaints/${complaint.id}/status`, { status });
      onStatusUpdate(complaint.id, status);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert('Failed to update complaint status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'OPEN': 'bg-red-100 text-red-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'RESOLVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusMap[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <li className='hover:bg-gray-50/30 hover:border hover:border-indigo-200'>
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="font-bold text-primary tracking-wide text-lg">
              {complaint.subject || 'Complaint'}
            </p>
          </div>
          <div className="ml-2 flex-shrink-0 flex items-center space-x-2">
            {getStatusBadge(complaint.status)}
          </div>
        </div>
        
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex sm:flex-col space-y-2">
            <p className="flex items-center text-sm text-gray-500 font-medium">
              <User className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary/60" />
              <span>{complaint.CustomerInfo?.name || 'Customer'}</span>
            </p>
            {complaint.Service && (
              <p className="flex items-center text-sm text-gray-500">
                <Package className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary/60" />
                <span>{complaint.Service.name}</span>
              </p>
            )}
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-primary/60" />
            <p>{new Date(complaint.created).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="flex items-start">
            <MessageSquare className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400 mt-1" />
            <p className="text-gray-700 text-sm">{complaint.issue}</p>
          </div>
        </div>

        {complaint.status === 'OPEN' && (
          <div className="mt-3 flex justify-end space-x-2">
            <button 
              onClick={() => handleStatusUpdate('IN_PROGRESS')}
              disabled={isUpdating}
              className="inline-flex items-center px-3 py-1 border border-yellow-500 font-medium rounded text-yellow-600 hover:bg-yellow-50 disabled:opacity-50"
            >
              {isUpdating ? 'Processing...' : 'Mark In Progress'}
            </button>
            <button 
              onClick={() => handleStatusUpdate('RESOLVED')}
              disabled={isUpdating}
              className="inline-flex items-center px-3 py-1 border border-transparent font-medium rounded text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              {isUpdating ? 'Processing...' : 'Mark Resolved'}
            </button>
          </div>
        )}

        {complaint.status === 'IN_PROGRESS' && (
          <div className="mt-3 flex justify-end">
            <button 
              onClick={() => handleStatusUpdate('RESOLVED')}
              disabled={isUpdating}
              className="inline-flex items-center px-3 py-1 border border-transparent font-medium rounded text-white bg-green-500 hover:bg-green-600 disabled:opacity-50"
            >
              {isUpdating ? 'Processing...' : 'Mark Resolved'}
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

function ProviderComplaint() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const filteredComplaints = filter === "All" 
    ? complaintsData 
    : complaintsData.filter(complaint => complaint.status === filter);

  const statusFilters = ["All", "OPEN", "IN_PROGRESS", "RESOLVED"];

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await authApi.get("/complaints/provider");
      setComplaintsData(response.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusUpdate = (complaintId, newStatus) => {
    setComplaintsData(prevComplaints => 
      prevComplaints.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus } 
          : complaint
      )
    );
  };

  return (
    <>
      <DashboardHeader />
      <div className="bg-white shadow overflow-hidden sm:rounded-md max-w-7xl mx-auto pt-18">
        <div className="px-4 py-3 sm:px-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              {statusFilters.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={
                    filter === status
                      ? "px-4 py-2 rounded-md text-sm font-medium border bg-indigo-50 text-indigo-700 border-indigo-300"
                      : "px-4 py-2 rounded-md text-sm font-medium border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }
                >
                  {status === "All" ? "All" : status.replace('_', ' ')}
                </button>
              ))}
            </div>
            <button 
              onClick={fetchComplaints}
              disabled={loading}
              className="px-4 py-2 rounded-md text-sm font-medium border bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto z-0">
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-3">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Customer Complaints</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              {filteredComplaints.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No complaints found</div>
              ) : (
                <ul role="list" className="divide-y divide-gray-200">
                  {filteredComplaints.map((complaint) => (
                    <ComplaintItem 
                      key={complaint.id} 
                      complaint={complaint} 
                      onStatusUpdate={handleStatusUpdate} 
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default ProviderComplaint;