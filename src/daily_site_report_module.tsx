import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  PlusCircle, 
  LogOut, 
  Image as ImageIcon, 
  Calendar, 
  CheckCircle2, 
  HardHat,
  Hammer,
  FileText,
  Camera,
  ChevronLeft,
  X,
  Moon,
  Sun
} from 'lucide-react';

const DarkModeToggle = ({ darkMode, onToggle } : { darkMode: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
    title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
  </button>
);

// --- MOCK DATA ---
const MOCK_USERS = [
  { id: '1', email: 'admin@build.com', password: 'password', role: 'Builder', name: 'Alice (Admin)' },
  { id: '2', email: 'super@build.com', password: 'password', role: 'Supervisor', name: 'Bob (Supervisor)' }
];

const INITIAL_REPORTS = [
  {
    id: 'r1',
    date: new Date().toISOString().split('T')[0], // Today
    submittedBy: 'Bob (Supervisor)',
    workers: 15,
    tasks: 'Completed foundation pouring for sector A.\nStarted scaffolding for sector B.',
    materials: '50 bags of cement, 2 tons of steel rebars',
    attendancePhoto: null,
    progressPhotos: []
  },
  {
    id: 'r2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    submittedBy: 'Bob (Supervisor)',
    workers: 12,
    tasks: 'Site clearance and initial digging.',
    materials: 'Diesel for excavators (100L)',
    attendancePhoto: null,
    progressPhotos: []
  }
];

// --- UI COMPONENTS ---
const Card = ({ children, className = '' } : any) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false } : any) => {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 focus:ring-indigo-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500"
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ label, id, ...props } : any ) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <input
      id={id}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
      {...props}
    />
  </div>
);

const Textarea = ({ label, id, ...props } : any) => (
  <div className="mb-4">
    {label && <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
    <textarea
      id={id}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors min-h-[100px]"
      {...props}
    />
  </div>
);

// --- MAIN VIEWS ---

const LoginView = ({ onLogin, darkMode, onToggleDark } : any) => {
  const [email, setEmail] = useState('admin@build.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Use provided mock credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="fixed top-0 right-0 z-20 flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <DarkModeToggle darkMode={darkMode} onToggle={onToggleDark} />
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <HardHat className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          SiteManager Pro
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          Sign in to access daily site reports
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="px-4 py-8 sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email address"
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-100 dark:border-red-900">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full text-base py-2.5">
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-700" /></div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400">Demo Accounts</span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => { setEmail('admin@build.com'); setPassword('password'); }}
                className={`p-2 border border-slate-200 dark:border-slate-600 rounded-md text-left text-slate-900 dark:text-slate-100 ${email === 'admin@build.com' ? 'bg-slate-200 dark:bg-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <strong>Admin</strong><br/><span className="text-slate-500 dark:text-slate-400 text-[10px]">admin@build.com</span>
              </button>
              <button
                type="button"
                onClick={() => { setEmail('super@build.com'); setPassword('password'); }}
                className={`p-2 border border-slate-200 dark:border-slate-600 rounded-md text-left text-slate-900 dark:text-slate-100 ${email === 'super@build.com' ? 'bg-slate-200 dark:bg-slate-600' : 'hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                <strong>Supervisor</strong><br/><span className="text-slate-500 dark:text-slate-400 text-[10px]">super@build.com</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const DashboardView = ({ user, reports, onNavigate } : any) => {
  const todayDateStr = new Date().toISOString().split('T')[0];
  
  const stats = useMemo(() => {
    const todayReports = reports.filter(r => r.date === todayDateStr);
    const todayWorkers = todayReports.reduce((sum, r) => sum + (Number(r.workers) || 0), 0);
    return {
      totalReports: reports.length,
      todayWorkers: todayWorkers,
      todayReportsCount: todayReports.length
    };
  }, [reports, todayDateStr]);

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back, {user.name}</p>
        </div>
        {user.role === 'Supervisor' && (
          <Button onClick={() => onNavigate('new-report')} className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Submit Daily Report
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Reports</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalReports}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Workers Today</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.todayWorkers}</p>
          </div>
        </Card>
        <Card className="p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Reports Today</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.todayReportsCount}</p>
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            Recent Reports
          </h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-700">
          {reports.length === 0 ? (
            <div className="p-6 text-center text-slate-500 dark:text-slate-400">No reports submitted yet.</div>
          ) : (
            reports.sort((a,b) => new Date(b.date) - new Date(a.date)).map((report) => (
              <div 
                key={report.id} 
                onClick={() => onNavigate('view-report', report.id)}
                className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{report.date}</span>
                    {report.date === todayDateStr && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-4">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {report.workers} workers</span>
                    <span className="flex items-center gap-1"><HardHat className="w-4 h-4" /> {report.submittedBy}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
                  View Details <ChevronLeft className="w-4 h-4 rotate-180 ml-1" />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

const ReportFormView = ({ user, onSubmit, onCancel } : any) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: today,
    workers: '',
    tasks: '',
    materials: '',
    attendancePhoto: null,
    progressPhotos: []
  });

  const handleImageUpload = (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // We use URL.createObjectURL for fake immediate preview in this demo.
    // In a real app, you'd upload these to a server/S3/Firebase.
    if (fieldName === 'attendancePhoto') {
      const url = URL.createObjectURL(files[0]);
      setFormData(prev => ({ ...prev, attendancePhoto: url }));
    } else if (fieldName === 'progressPhotos') {
      const urls = files.slice(0, 2).map(f => URL.createObjectURL(f));
      setFormData(prev => ({ ...prev, progressPhotos: urls }));
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const newReport = {
      ...formData,
      id: `r_${Date.now()}`,
      submittedBy: user.name,
      workers: parseInt(formData.workers, 10) || 0
    };
    onSubmit(newReport);
  };

  const removePhoto = (fieldName, index = -1) => {
    if (fieldName === 'attendancePhoto') {
      setFormData(prev => ({ ...prev, attendancePhoto: null }));
    } else {
      setFormData(prev => ({
        ...prev,
        progressPhotos: prev.progressPhotos.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onCancel} className="px-2">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </Button>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Submit Daily Report</h1>
      </div>

      <form onSubmit={submitForm}>
        <Card className="p-6 space-y-6">
          {/* Top Row: Date & Workers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              label="Report Date (Auto)" 
              id="date" 
              type="date" 
              value={formData.date}
              disabled
              className="bg-slate-50 dark:bg-slate-900 cursor-not-allowed text-slate-500 dark:text-slate-400 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg"
            />
            <Input 
              label="Number of Workers Present *" 
              id="workers" 
              type="number" 
              min="0"
              required
              value={formData.workers}
              onChange={e => setFormData(p => ({...p, workers: e.target.value}))}
              placeholder="e.g. 15"
            />
          </div>

          {/* Text Areas for Tasks & Materials */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <Textarea
              label="Tasks Completed Today *"
              id="tasks"
              required
              placeholder="Detail the work completed..."
              value={formData.tasks}
              onChange={e => setFormData(p => ({...p, tasks: e.target.value}))}
            />
            <Textarea
              label="Materials Used Today *"
              id="materials"
              required
              placeholder="e.g. 50 bags cement, 1 ton steel..."
              value={formData.materials}
              onChange={e => setFormData(p => ({...p, materials: e.target.value}))}
            />
          </div>

          {/* Photo Uploads */}
          <div className="space-y-6 pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Camera className="w-5 h-5 text-indigo-500" /> Photo Documentation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attendance Photo */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Attendance Photo (Optional)</label>
                {!formData.attendancePhoto ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-900/50">
                    <div className="space-y-1 text-center">
                      <Users className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                        <label htmlFor="attendance-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="attendance-upload" name="attendance-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'attendancePhoto')} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 group">
                    <img src={formData.attendancePhoto} alt="Attendance" className="w-full h-48 object-cover" />
                    <button type="button" onClick={() => removePhoto('attendancePhoto')} className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-full text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Progress Photos */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Progress Photos (Max 2)</label>
                {formData.progressPhotos.length < 2 && (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg hover:border-indigo-400 transition-colors bg-slate-50 dark:bg-slate-900/50 mb-4">
                    <div className="space-y-1 text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                      <div className="flex text-sm text-slate-600 dark:text-slate-400 justify-center">
                        <label htmlFor="progress-upload" className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-800 focus-within:ring-indigo-500">
                          <span>Upload photos</span>
                          <input id="progress-upload" name="progress-upload" type="file" multiple className="sr-only" accept="image/*" onChange={(e) => handleImageUpload(e, 'progressPhotos')} />
                        </label>
                      </div>
                      <p className="text-xs text-slate-500">Select up to 2 images</p>
                    </div>
                  </div>
                )}
                
                {formData.progressPhotos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {formData.progressPhotos.map((url, i) => (
                      <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 group">
                        <img src={url} alt={`Progress ${i+1}`} className="w-full h-24 object-cover" />
                        <button type="button" onClick={() => removePhoto('progressPhotos', i)} className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-slate-800/90 rounded-full text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit" className="gap-2">
              <CheckCircle2 className="w-4 h-4" /> Submit Report
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

const ReportDetailsView = ({ report, onBack } : any) => {
  if (!report) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="px-2">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back to Dashboard
        </Button>
        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 rounded-full text-sm font-medium">
          Report Details
        </span>
      </div>

      <Card className="overflow-hidden">
        {/* Header section */}
        <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Date</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {report.date}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Submitted By</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-slate-400" />
                {report.submittedBy}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Workers Present</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-slate-400" />
                {report.workers} Total
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Text Content */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Hammer className="w-4 h-4" /> Tasks Completed
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{report.tasks}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" /> Materials Used
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{report.materials}</p>
              </div>
            </div>
          </div>

          {/* Photos */}
          {(report.attendancePhoto || (report.progressPhotos && report.progressPhotos.length > 0)) && (
             <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-indigo-500" /> Attached Photos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {report.attendancePhoto && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Attendance</p>
                      <img src={report.attendancePhoto} alt="Attendance" className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm" />
                    </div>
                  )}
                  {report.progressPhotos && report.progressPhotos.map((url, idx) => (
                    <div key={idx} className="space-y-2">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Progress {idx + 1}</p>
                      <img src={url} alt={`Progress ${idx + 1}`} className="w-full h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm" />
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>
      </Card>
    </div>
  );
};


// --- APP ROOT ---

export default function ReportApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'new-report', 'view-report'
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view, reportId = null) => {
    setCurrentView(view);
    if (reportId) setSelectedReportId(reportId);
  };

  const handleSubmitReport = (newReport : any) => {
    setReports(prev => [newReport, ...prev]);
    setCurrentView('dashboard');
  };

  if (!currentUser) {
    return <LoginView onLogin={setCurrentUser} darkMode={darkMode} onToggleDark={toggleDarkMode} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView user={currentUser} reports={reports} onNavigate={handleNavigate} />;
      case 'new-report':
        return <ReportFormView user={currentUser} onSubmit={handleSubmitReport} onCancel={() => handleNavigate('dashboard')} />;
      case 'view-report':
        return <ReportDetailsView report={reports.find(r => r.id === selectedReportId)} onBack={() => handleNavigate('dashboard')} />;
      default:
        return <DashboardView user={currentUser} reports={reports} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigate('dashboard')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100 tracking-tight hidden sm:block">SiteManager</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <DarkModeToggle darkMode={darkMode} onToggle={toggleDarkMode} />
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{currentUser.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{currentUser.role} Role</div>
              </div>
              <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-800 sm:hidden">
                {currentUser.name.charAt(0)}
              </div>
              <button 
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}