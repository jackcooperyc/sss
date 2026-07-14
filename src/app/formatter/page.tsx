'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Download, FileText, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import {
  downloadAsCSV,
  businessToCuprOsLead,
  CuprOsLeadExport,
  CuprOsSegment,
} from '@/lib/csv-utils';
import type { Business } from '@/components/BusinessCard';

function pick(row: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    const val = row[key];
    if (val != null && String(val).trim() !== '') return String(val).trim();
  }
  return '';
}

export default function FormatterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<CuprOsLeadExport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [source, setSource] = useState('Cold Calling');
  const [segment, setSegment] = useState<CuprOsSegment>('Dispensary');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setProcessedData(null);
    const baseName = selectedFile.name.replace(/\.csv$/i, '');
    setFilename(`${baseName}_cupros.csv`);
  };

  const processFile = () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data as Record<string, string>[];

          if (rows.length === 0) {
            throw new Error('The uploaded CSV appears to be empty.');
          }

          const formattedRows: CuprOsLeadExport[] = rows.map((row) => {
            // Skip Cupr.os summary / blank spacer rows
            const companyName = pick(row, [
              'Company Name',
              'Business Name',
              'Company',
              'Name',
              'Lead Name',
            ]);
            if (!companyName || companyName === 'Lead Name' || companyName === 'Company Name') {
              return null;
            }

            const city = pick(row, ['City']);
            const state = pick(row, ['State']);
            const phone = pick(row, ['Phone', 'Mobile No', 'Mobile']);
            const website = pick(row, ['Website']);
            const street = pick(row, ['Address Line 1', 'Street Address', 'Address']);
            const existingNotes = pick(row, ['Notes']);
            const existingSource = pick(row, ['Source']);
            const existingStatus = pick(row, ['Status']);
            const existingLeadType = pick(row, ['Lead Type']);
            const existingLeadName = pick(row, ['Lead Name']);

            const business: Business = {
              id: crypto.randomUUID(),
              name: companyName,
              address: street,
              streetAddress: street,
              phone,
              website: website || null,
              description: existingNotes,
              location: { city, state, postalCode: pick(row, ['Postal Code', 'Zip']) },
            };

            const mapped = businessToCuprOsLead(business, {
              source: existingSource || source,
              status: existingStatus || 'New',
              leadType: existingLeadType || 'Client',
              segment,
              notes: existingNotes || undefined,
            });

            if (existingLeadName) {
              mapped['Lead Name'] = existingLeadName;
            }

            return mapped;
          }).filter((row): row is CuprOsLeadExport => row !== null);

          if (formattedRows.length === 0) {
            throw new Error('No valid lead rows found. Check that Company Name / Business Name columns exist.');
          }

          setProcessedData(formattedRows);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || 'An error occurred while formatting the file.');
          } else {
            setError('An unknown error occurred.');
          }
        } finally {
          setIsProcessing(false);
        }
      },
      error: (parseError) => {
        setError(`Failed to parse CSV: ${parseError.message}`);
        setIsProcessing(false);
      },
    });
  };

  const downloadProcessedFile = () => {
    if (!processedData) return;
    downloadAsCSV(processedData, filename.trim() || 'formatted_cupros_leads.csv');
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-3">
            <Database className="h-8 w-8 text-indigo-600" />
            CSV Formatter
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Upload lead CSVs to map columns into the{' '}
            <span className="font-semibold text-slate-800">Cupr.os CRM</span> outreach tracker format.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8">
            {!processedData && (
              <div className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    file ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-4"
                  >
                    <div className="bg-white p-4 rounded-full shadow-sm">
                      <UploadCloud className={`h-8 w-8 ${file ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      {file ? (
                        <p className="text-lg font-medium text-indigo-900">{file.name}</p>
                      ) : (
                        <>
                          <p className="text-lg font-medium text-slate-700">Click to upload a CSV file</p>
                          <p className="text-sm text-slate-500 mt-1">Accepts NWA or Cupr.os-style columns</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Source</label>
                    <input
                      type="text"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Default Segment</label>
                    <select
                      value={segment}
                      onChange={(e) => setSegment(e.target.value as CuprOsSegment)}
                      className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    >
                      <option value="Dispensary">Dispensary</option>
                      <option value="Smoke Shop">Smoke Shop</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={processFile}
                  disabled={!file || isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isProcessing ? 'Processing data...' : 'Format for Cupr.os CRM'}
                </button>
              </div>
            )}

            {processedData && (
              <div className="text-center space-y-8 py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-2">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Successfully Formatted</h3>
                  <p className="text-slate-600 mt-2">
                    Processed <span className="font-semibold">{processedData.length}</span> leads into Cupr.os CRM columns.
                  </p>
                </div>

                <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-xl p-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                    Export Filename:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <button
                    onClick={() => {
                      setFile(null);
                      setProcessedData(null);
                      setError(null);
                    }}
                    className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Format Another File
                  </button>
                  <button
                    onClick={downloadProcessedFile}
                    className="px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-colors flex justify-center items-center gap-2 shadow-md"
                  >
                    <Download className="h-5 w-5" />
                    Download CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
