import { Download, FileText, Tag } from "lucide-react";
import { Business } from "./BusinessCard";
import { useState } from "react";
import {
  downloadAsCSV,
  businessToCuprOsLead,
  CuprOsSegment,
} from "@/lib/csv-utils";

export function ExportButton({ businesses, defaultFilename, defaultSegment }: {
  businesses: Business[];
  defaultFilename?: string;
  defaultSegment?: CuprOsSegment;
}) {
  const [filename, setFilename] = useState(defaultFilename || "");
  const [source, setSource] = useState("Cold Calling");
  const [segment, setSegment] = useState<CuprOsSegment>(defaultSegment || "Dispensary");

  const handleExport = () => {
    if (businesses.length === 0) return;

    const dataToExport = businesses.map((b) =>
      businessToCuprOsLead(b, { source, segment })
    );

    downloadAsCSV(dataToExport, filename.trim());
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
            placeholder="cupros_leads.csv"
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-48 bg-white"
            disabled={businesses.length === 0}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Source</label>
        <input
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="Cold Calling"
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-40 bg-white"
          disabled={businesses.length === 0}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Segment</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Tag className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={segment}
            onChange={(e) => setSegment(e.target.value as CuprOsSegment)}
            className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-40 bg-white appearance-none"
            disabled={businesses.length === 0}
          >
            <option value="Dispensary">Dispensary</option>
            <option value="Smoke Shop">Smoke Shop</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleExport}
        disabled={businesses.length === 0}
        className="inline-flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:mt-5 shadow-sm"
      >
        <Download size={16} />
        Export Cupr.os CSV
      </button>
    </div>
  );
}
