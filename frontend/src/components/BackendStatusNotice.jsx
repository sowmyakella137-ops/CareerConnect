import React, { useState } from 'react';
import { Server, CheckCircle2, AlertTriangle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import api, { API_BASE_URL } from '../api/api.js';

export default function BackendStatusNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null); // 'online', 'offline', or null
  const [copied, setCopied] = useState(false);

  const checkConnection = async () => {
    setTesting(true);
    setStatus(null);
    try {
      // Test basic connectivity to base URL or public auth endpoint
      await api.get('/api/auth/login', { timeout: 4000 }).catch((err) => {
        // If server responds with 400, 401, 405 etc., it means the server IS alive and responding!
        if (err.response) return { alive: true };
        throw err;
      });
      setStatus('online');
    } catch {
      setStatus('offline');
    } finally {
      setTesting(false);
    }
  };

  const copyCorsConfig = () => {
    const corsCode = `@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}`;
    navigator.clipboard.writeText(corsCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-b border-slate-200 bg-slate-100/80 text-xs text-slate-700">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5 sm:px-6">
        <div className="flex items-center gap-2">
          <Server className="h-3.5 w-3.5 text-slate-500" />
          <span>Backend Target:</span>
          <code className="font-mono font-medium text-blue-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
            {API_BASE_URL}
          </code>
          {status === 'online' && (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          )}
          {status === 'offline' && (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <AlertTriangle className="h-3 w-3" /> Unreachable
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={checkConnection}
            disabled={testing}
            className="hover:text-blue-600 transition-colors font-medium text-slate-600 underline underline-offset-2 disabled:opacity-50"
          >
            {testing ? 'Checking...' : 'Ping Backend'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 hover:text-slate-900 transition-colors font-medium text-slate-600"
            aria-expanded={isOpen}
          >
            Spring Boot Setup
            {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 text-slate-600">
          <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-slate-800">1. Spring Boot Port Verification</p>
              <p className="mt-1">
                Ensure your <code className="text-slate-800">application.properties</code> or <code className="text-slate-800">application.yml</code> sets:
              </p>
              <pre className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono text-[11px]">
server.port=1234
              </pre>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-800">2. Spring Boot CORS Configuration</p>
                <button
                  type="button"
                  onClick={copyCorsConfig}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy Java CORS'}
                </button>
              </div>
              <p className="mt-1">
                If the browser blocks calls, add a <code className="text-slate-800">WebMvcConfigurer</code> allowing <code className="text-slate-800">http://localhost:3000</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
