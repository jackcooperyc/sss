import { MapPin, Phone, ShieldCheck } from "lucide-react";

export interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string | null;
  description: string;
  location: {
    city: string;
    state: string;
    postalCode: string;
  };
}

export function BusinessCard({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-slate-800 leading-tight pr-2">
            {business.name}
          </h3>
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-100 flex-shrink-0">
            <ShieldCheck size={14} className="text-indigo-600" />
            NWAGo Verified
          </span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-slate-600">
            <Phone size={16} className="mt-0.5 text-slate-400 shrink-0" />
            <span className="text-sm">{business.phone}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-600">
            <MapPin size={16} className="mt-0.5 text-slate-400 shrink-0" />
            <span className="text-sm">{business.address}</span>
          </div>
        </div>

        <div className="mb-4">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
            {business.location.city ? `${business.location.city}, ` : ''}
            {business.location.state} {business.location.postalCode}
          </span>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-500 line-clamp-3">
            {business.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
