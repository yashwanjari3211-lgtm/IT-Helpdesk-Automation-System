import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldAlert,
  ChevronRight,
  Mail,
  Database,
  Cpu,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const App: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'create'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/create_ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ issue_description: description }),
      });
      if (res.ok) {
        setDescription('');
        setActiveTab('dashboard');
        fetchTickets();
      }
    } catch (err) {
      console.error('Error creating ticket:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTicket = async (id: string) => {
    try {
      const res = await fetch(`/api/close_ticket/${id}`, { method: 'PUT' });
      if (res.ok) fetchTickets();
    } catch (err) {
      console.error('Error closing ticket:', err);
    }
  };

  const filteredTickets = tickets.filter(t => 
    t.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.issue_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-50 border-red-100';
      case 'Medium': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Low': return 'text-blue-500 bg-blue-50 border-blue-100';
      default: return 'text-gray-500 bg-gray-50 border-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'Open' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1A1C1E] font-sans">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 z-10 hidden lg:block">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-bold text-xl tracking-tight">IT Helpdesk</h1>
        </div>

        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'create' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <PlusCircle className="w-5 h-5" />
            New Ticket
          </button>
        </nav>

        <div className="absolute bottom-10 left-6 right-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase mb-2">
              <Cpu className="w-3 h-3" /> System Status
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Backend Online
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? 'Incident Management' : 'Create New Incident'}
            </h2>
            <p className="text-gray-500 mt-1">Automated IT Helpdesk & Classification System</p>
          </div>

          {activeTab === 'dashboard' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' ? (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {filteredTickets.length === 0 ? (
                <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-20 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <Database className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No tickets found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mt-2">
                    Start by creating a new ticket to see the automation in action.
                  </p>
                  <button 
                    onClick={() => setActiveTab('create')}
                    className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                  >
                    Create First Ticket
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredTickets.map((ticket) => (
                    <motion.div 
                      layout
                      key={ticket.ticket_id}
                      className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-bold font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {ticket.ticket_id}
                            </span>
                            <span className={`text-xs font-bold px-2 py-1 rounded border ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority}
                            </span>
                            <span className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded border ${ticket.status === 'Open' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-500 bg-gray-50 border-gray-100'}`}>
                              {getStatusIcon(ticket.status)}
                              {ticket.status}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {ticket.issue_description}
                          </h3>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <AlertCircle className="w-4 h-4" />
                              {ticket.category}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {new Date(ticket.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {ticket.status === 'Open' && (
                            <button 
                              onClick={() => handleCloseTicket(ticket.ticket_id)}
                              className="px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                            >
                              Close Ticket
                            </button>
                          )}
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="create"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white border border-gray-200 rounded-3xl p-10 shadow-xl shadow-gray-200/50">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-blue-600/30">
                  <PlusCircle className="w-8 h-8" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Describe the Issue</h3>
                <p className="text-gray-500 mb-8">Our AI classifier will automatically categorize and prioritize your request.</p>

                <form onSubmit={handleCreateTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Issue Description</label>
                    <textarea 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Example: VPN is not connecting from home office..."
                      className="w-full h-40 p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all resize-none text-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase mb-1">
                        <Mail className="w-3 h-3" /> Automation
                      </div>
                      <p className="text-xs text-blue-500">Auto-acknowledgment email will be sent upon creation.</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase mb-1">
                        <ShieldAlert className="w-3 h-3" /> Priority
                      </div>
                      <p className="text-xs text-amber-500">Network and Access issues are escalated automatically.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? 'Processing...' : 'Submit Incident'}
                      {!loading && <ChevronRight className="w-5 h-5" />}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-lg hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
