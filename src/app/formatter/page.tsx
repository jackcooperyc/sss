'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { UploadCloud, Download, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function FormatterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<Record<string, string>[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filename, setFilename] = useState('');
  const [pipeline, setPipeline] = useState('NWA Lead Gen. MT');

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
    // Auto-fill the export filename based on the input, appending "_formatted"
    const baseName = selectedFile.name.replace(/\.csv$/i, '');
    setFilename(`${baseName}_formatted.csv`);
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
            throw new Error("The uploaded CSV appears to be empty.");
          }

          // Format to GoHighLevel Requirements
          const formattedRows = rows.map((row) => {
            // Support either the old "Name" column or already "Business Name"
            const businessName = row['Name'] || row['Business Name'] || 'Unknown Business';
            
            return {
              'Business Name': businessName,
              'Phone': row['Phone'] || '',
              'Street Address': row['Address'] || row['Street Address'] || '',
              'City': row['City'] || '',
              'State': row['State'] || '',
              'Postal Code': row['Zip'] || row['Postal Code'] || '',
              'Pipeline': pipeline || 'NWA Lead Gen. MT',
              'Stage': 'New Lead',
              'Opportunity Name': `${businessName} Website Dev. Service`,
              'Opportunity Value': '500',
              'Opportunity Status': 'Open'
            };
          });

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
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
        setIsProcessing(false);
      }
    });
  };

  const downloadProcessedFile = () => {
    if (!processedData) return;

    // Convert back to CSV
    const csv = Papa.unparse(processedData, {
      quotes: true, // Force quotes around all fields to safely handle commas in business names
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Ensure .csv extension and use NWAGo branding
    const finalFilename = filename.trim() ? 
      (filename.trim().endsWith('.csv') ? filename.trim() : `${filename.trim()}.csv`) : 
      'formatted_nwago_leads.csv';

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", finalFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Upload older lead exports to automatically map their columns to the new <span className="font-semibold text-slate-800">GoHighLevel</span> Opportunity structure.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="p-8">
            
            {/* Upload Area */}
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
                          <p className="text-sm text-slate-500 mt-1">Accepts standard NWA format</p>
                        </>
                      )}
                    </div>
                  </label>
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
                  {isProcessing ? 'Processing data...' : 'Format for GoHighLevel'}
                </button>
              </div>
            )}

            {/* Success / Download Area */}
            {processedData && (
              <div className="text-center space-y-8 py-4">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-2">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Successfully Formatted</h3>
                  <p className="text-slate-600 mt-2">
                    Processed <span className="font-semibold">{processedData.length}</span> leads with GoHighLevel Pipeline and Opportunity standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
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

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2 text-left">
                        Target Pipeline:
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Download className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                          type="text"
                          value={pipeline}
                          onChange={(e) => setPipeline(e.target.value)}
                          className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        />
                      </div>
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

// Need to import Database for the header icon
import { Database } from 'lucide-react';
