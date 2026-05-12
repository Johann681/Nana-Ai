'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getReports, generateReportPdf } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { handleNavigation, handleFeatureNotReady } from '@/actions/uiActions';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock,
  ShieldCheck,
  MoreVertical,
  Activity
} from 'lucide-react';

interface Report {
  _id: string;
  title?: string;
  doctorName: string;
  createdAt: string;
  content?: {
    symptoms?: string;
  };
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchReports = useCallback(async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      toast('Failed to load reports', 'error');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleDownload = async (report: { _id: string }) => {
    try {
      toast(`Generating PDF for ${report._id.slice(-8).toUpperCase()}...`, 'info');
      const blob = await generateReportPdf(report);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `clinical-summary-${report._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      toast('PDF Downloaded successfully', 'success');
    } catch (err) {
      console.error('Download failed:', err);
      toast('Failed to download PDF', 'error');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-medical-secondary mb-1">Clinical Archives</h1>
          <p className="text-slate-500 text-sm">
            Access and manage your authorized medical consultation summaries and diagnostic exports.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => handleFeatureNotReady('Report Filtering', toast)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button 
            onClick={() => handleFeatureNotReady('Batch Export', toast)}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        </div>
      </section>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search clinical records by specialist or condition..." 
            className="input-enterprise pl-12"
          />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-[1px] bg-slate-200 mx-2 hidden md:block" />
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-medical-border rounded-sm text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer hover:border-medical-primary transition-all">
            <Clock className="w-3.5 h-3.5" />
            Last 30 Days
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 border-2 border-medical-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accessing Clinical Node...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="card-enterprise p-24 text-center bg-white flex flex-col items-center">
          <div className="w-20 h-20 bg-medical-surface flex items-center justify-center rounded-full mb-8">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-base font-bold text-medical-secondary mb-2">No Clinical Records Detected</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Your clinical summaries will appear here once consultations are finalized, validated, and authorized by the specialist node.
          </p>
          <button 
            onClick={() => handleNavigation('/home', router)}
            className="mt-8 btn-primary"
          >
            Start First Consultation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="card-enterprise group bg-white flex flex-col">
              <div className="p-6 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-medical-primary/5 text-medical-primary flex items-center justify-center rounded-sm group-hover:bg-medical-primary group-hover:text-white transition-all duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <button 
                    onClick={() => handleFeatureNotReady('Report Options', toast)}
                    className="p-1 hover:bg-slate-50 rounded-sm transition-colors text-slate-400"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="font-bold text-medical-secondary text-sm group-hover:text-medical-primary transition-colors">
                    {report.title || 'Clinical Summary Report'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-medical-accent uppercase tracking-wider">
                      Dr. {report.doctorName}
                    </span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span className="text-[10px] text-slate-400 font-medium">
                      ID: #{report._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-medical-surface border border-medical-border space-y-4 rounded-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Clinical Data</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-sm">SECURE</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                      {report.content?.symptoms ? `Patient presented with ${report.content.symptoms.toLowerCase()}.` : 'Diagnostic analysis and care plan finalized.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-medical-border bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
                <button 
                  onClick={() => handleDownload(report)}
                  className="flex items-center gap-2 text-[11px] font-bold text-medical-primary hover:text-medical-secondary transition-all uppercase tracking-widest"
                >
                  Download PDF
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Security Footer */}
      <div className="mt-20 p-8 border border-medical-border bg-white rounded-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-16 h-16 bg-emerald-50 flex items-center justify-center rounded-full shrink-0">
          <ShieldCheck className="w-8 h-8 text-emerald-500" />
        </div>
        <div className="flex-1 space-y-2 text-center md:text-left">
          <h4 className="text-sm font-bold text-medical-secondary">Data Encryption & Privacy Compliance</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            All clinical reports are encrypted using industry-standard protocols. Nana Health adheres to HIPAA and GDPR standards for medical data handling. Your reports are only accessible by you and authorized healthcare providers.
          </p>
        </div>
        <button 
          onClick={() => handleFeatureNotReady('Privacy Settings', toast)}
          className="btn-secondary whitespace-nowrap"
        >
          Privacy Settings
        </button>
      </div>
    </div>
  );
}
