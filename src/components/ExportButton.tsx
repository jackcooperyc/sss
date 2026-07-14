import { Download, FileText } from "lucide-react";
import { Business } from "./BusinessCard";
import { useState } from "react";
import Papa from 'papaparse';

export function ExportButton({ businesses }: { businesses: Business[] }) {
  const [filename, setFilename] = useState("");
  const [pipeline, setPipeline] = useState('NWA Lead Gen. MT');

  const handleExport = () => {
    if (businesses.length === 0) return;

    // Map data to rows with standard GoHighLevel headers and stage support
    const dataToExport = businesses.map(b => {
      return {
        'Business Name': b.name,
        'Phone': b.phone,
        'Street Address': b.address,
        'City': b.location.city,
        'State': b.location.state,
        'Postal Code': b.location.postalCode,
        'Pipeline': pipeline || 'NWA Lead Gen. MT',
        'Stage': 'New Lead', // Default stage for GHL import
        'Opportunity Name': `${b.name} Website Dev. Service`,
        'Opportunity Value': '500',
        'Opportunity Status': 'Open'
      };
    });

    // Use PapaParse for robust CSV conversion (handles quotes, commas, etc. correctly)
    const csvContent = Papa.unparse(dataToExport, {
      quotes: true,
      header: true
    });

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Updated default filename to NWAGo
    const finalFilename = filename.trim() ? 
      (filename.trim().endsWith('.csv') ? filename.trim() : `${filename.trim()}.csv`) : 
      `nwago_leads_${new Date().getTime()}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", finalFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Filename</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileText className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
            placeholder="nwago_leads.csv"
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48 bg-white"
            disabled={businesses.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pipeline</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Download className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={pipeline}
            onChange={(e) => setPipeline(e.target.value)}
            placeholder="NWA Lead Gen. MT"
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48 bg-white"
            disabled={businesses.length === 0}
          />
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={businesses.length === 0}
        className="inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:mt-5 shadow-sm"
      >
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );
}
