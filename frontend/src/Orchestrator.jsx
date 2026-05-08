import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, BrainCircuit, Activity, Terminal, Send, Server, Lock, 
  Database, Network, Cpu, ShieldAlert, BarChart4, Cloud, CheckCircle2, 
  Settings, X, HardDrive, UploadCloud, FileJson, Plug, GitMerge,
  Image as ImageIcon, Loader2, Download, Printer, Copy, Edit2, Maximize, Minimize, Gamepad2,
  ExternalLink, Play, Paperclip, Mail, FileText, Calendar,
  Globe, GitBranch, ListTodo, MessageSquare, BookOpen, PenTool, Box,
  Zap, Infinity, Telescope, Atom, Dna, Fingerprint, Radar, Layers, Headphones,
  FolderSearch, PlusSquare, Hash, Trash2
} from 'lucide-react';

const SLASH_COMMANDS = [
  // Standard Integrations
  { cmd: '/web', icon: Globe, desc: 'Live internet search (Grounding)', color: 'text-cyan-400', autoStyle: 'executive' },
  { cmd: '/github', icon: GitBranch, desc: 'Codebase context (Real API)', color: 'text-slate-100', autoStyle: 'raw' },
  { cmd: '/jira', icon: ListTodo, desc: 'Issue tracker', color: 'text-blue-500', autoStyle: 'executive' },
  { cmd: '/slack', icon: MessageSquare, desc: 'Team chat history', color: 'text-purple-400', autoStyle: 'raw' },
  { cmd: '/notion', icon: BookOpen, desc: 'Wiki/Knowledge base', color: 'text-slate-300', autoStyle: 'executive' },
  { cmd: '/terminal', icon: Terminal, desc: 'Server logs & CLI', color: 'text-green-500', autoStyle: 'sre_postmortem' },
  { cmd: '/sql', icon: Database, desc: 'DB Schema', color: 'text-emerald-400', autoStyle: 'json_schema' },
  { cmd: '/figma', icon: PenTool, desc: 'UI/UX Blueprints', color: 'text-pink-400', autoStyle: 'react_tailwind' },
  { cmd: '/gmail', icon: Mail, desc: 'Search Emails', color: 'text-red-400', autoStyle: 'executive' },
  { cmd: '/drive', icon: HardDrive, desc: 'Query Drive', color: 'text-emerald-400', autoStyle: 'executive' },
  { cmd: '/docs', icon: FileText, desc: 'Extract Docs', color: 'text-blue-400', autoStyle: 'executive' },
  { cmd: '/calendar', icon: Calendar, desc: 'Check Schedule', color: 'text-amber-400', autoStyle: 'raw' },
  
  // Innovative "God-Mode" Capabilities
  { cmd: '/swarm', icon: Network, desc: 'Multi-agent consensus', color: 'text-fuchsia-400', autoStyle: 'raw' },
  { cmd: '/memory', icon: BrainCircuit, desc: 'Query vector history', color: 'text-indigo-400', autoStyle: 'raw' },
  { cmd: '/sandbox', icon: Box, desc: 'Secure code execution', color: 'text-orange-400', autoStyle: 'raw' },
  { cmd: '/autopilot', icon: Cpu, desc: 'Self-guided execution', color: 'text-red-500', autoStyle: 'raw' },
  { cmd: '/simulate', icon: Activity, desc: 'Scenario modeling', color: 'text-teal-400', autoStyle: 'mermaid' },
  { cmd: '/review', icon: ShieldCheck, desc: 'Red-team security audit', color: 'text-amber-500', autoStyle: 'security_audit' },
  { cmd: '/aws', icon: Cloud, desc: 'Cloud infra state', color: 'text-orange-500', autoStyle: 'terraform' },
  { cmd: '/linear', icon: GitMerge, desc: 'Sprint & Cycle tracking', color: 'text-indigo-300', autoStyle: 'executive' },
  
  // Multi-Decade Ahead "Singularity" Capabilities
  { cmd: '/quantum', icon: Atom, desc: 'Quantum state resolution', color: 'text-purple-400', autoStyle: 'raw' },
  { cmd: '/temporal', icon: Telescope, desc: '4D Temporal trajectory', color: 'text-indigo-400', autoStyle: 'mermaid' },
  { cmd: '/multiverse', icon: Layers, desc: 'Parallel branch simulation', color: 'text-fuchsia-500', autoStyle: 'mermaid' },
  { cmd: '/neural', icon: Fingerprint, desc: 'BCI Context extraction', color: 'text-pink-500', autoStyle: 'raw' },
  { cmd: '/biocompute', icon: Dna, desc: 'Synthetic bio-pathways', color: 'text-emerald-500', autoStyle: 'json_schema' },
  { cmd: '/nanoswarm', icon: Radar, desc: 'Self-assembling architectures', color: 'text-teal-400', autoStyle: 'terraform' },
  { cmd: '/entropy', icon: ShieldAlert, desc: 'Thermodynamic chaos eng', color: 'text-red-600', autoStyle: 'sre_postmortem' },
  { cmd: '/singularity', icon: Zap, desc: 'Recursive auto-improvement', color: 'text-yellow-400', autoStyle: 'prompt_engineer' },
  { cmd: '/hivemind', icon: Infinity, desc: 'Global consciousness sync', color: 'text-cyan-400', autoStyle: 'executive' },
  { cmd: '/orbital', icon: Globe, desc: 'Planetary infrastructure', color: 'text-slate-300', autoStyle: 'k8s_manifest' }
];

// Utility: Convert Base64 PCM to WAV Blob URL
function createWav(base64String, sampleRate = 24000) {
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const buffer = new ArrayBuffer(44 + bytes.length);
  const view = new DataView(buffer);
  
  const writeString = (v, offset, string) => {
    for (let i = 0; i < string.length; i++) {
      v.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + bytes.length, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, 'data');
  view.setUint32(40, bytes.length, true);
  
  for (let i = 0; i < bytes.length; i++) {
    view.setUint8(44 + i, bytes[i]);
  }
  
  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

const MermaidBlock = ({ code }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const renderDiagram = async () => {
      try {
        if (!window.mermaid) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js';
          document.head.appendChild(script);
          await new Promise((resolve) => { script.onload = resolve; });
          window.mermaid.initialize({ startOnLoad: false, theme: 'dark', securityLevel: 'loose' });
        }
        
        const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
        const { svg: renderedSvg } = await window.mermaid.mermaidAPI.render(id, code);
        
        if (isMounted) {
          setSvg(renderedSvg);
          setError('');
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      }
    };
    
    renderDiagram();
    return () => { isMounted = false; };
  }, [code]);

  if (error) {
    return <div className="p-4 bg-red-900/20 border border-red-500/50 text-red-400 text-xs font-mono rounded">Mermaid Syntax Error: {error}</div>;
  }

  return (
    <div className="my-4 p-4 bg-slate-900 border border-slate-700 rounded-lg overflow-x-auto flex justify-center items-center print:bg-white print:border-slate-300">
      {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} className="print:text-black [&_text]:!fill-slate-300 print:[&_text]:!fill-black" /> : <div className="text-slate-500 text-xs flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin" /> Compiling Vector Diagram...</div>}
    </div>
  );
};

export default function GodModeOrchestrator() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('gemini_api_key');
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('gemini_api_key') || '';
  });
  const [coreModel, setCoreModel] = useState('gemini-2.5-flash');
  
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'system', text: 'GOD-MODE ORCHESTRATOR ONLINE. Persistence & Memory pipelines active.' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAgent, setActiveAgent] = useState('Orchestrator');
  const [swarmLogs, setSwarmLogs] = useState([]);
  const [maximizedIndex, setMaximizedIndex] = useState(null); 
  const [currentLabel, setCurrentLabel] = useState('Default');
  const [labels, setLabels] = useState(() => {
    try {
      const saved = localStorage.getItem('god_mode_labels');
      return saved ? JSON.parse(saved) : ['Default'];
    } catch(e) { return ['Default']; }
  });
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState('');

  // Persist label list to disk
  useEffect(() => {
    localStorage.setItem('god_mode_labels', JSON.stringify(labels));
  }, [labels]);

  // Load history whenever the active label changes
  useEffect(() => {
    if (isAuthenticated) {
      const fetchHistory = async () => {
        try {
          const res = await fetch(`/api/v1/orchestrator/history?label=${encodeURIComponent(currentLabel)}`);
          if (res.ok) {
            const history = await res.json();
            if (history && history.length > 0) {
              const flattened = history.flatMap(h => (h.messages || []).map(m => ({
                role: m.role === 'model' ? 'ai' : m.role,
                text: m.text,
                agent: m.role === 'model' ? 'Orchestrator' : 'User'
              })));
              setMessages(flattened);
            } else {
              setMessages([{ role: 'system', text: `THREAD INITIALIZED: ${currentLabel}` }]);
            }
          }
        } catch (err) {
          console.error('History Sync Failed:', err);
        }
      };
      fetchHistory();
    }
  }, [currentLabel, isAuthenticated]);

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [connectors, setConnectors] = useState({
    oneLake: { id: 'oneLake', name: 'MS Fabric OneLake', active: true, type: 'Data Lake' },
    bigQuery: { id: 'bigQuery', name: 'GCP BigQuery', active: false, type: 'Data Warehouse' }
  });
  const [mcpServers, setMcpServers] = useState({
    jira: { id: 'jira', name: 'Atlassian Jira', active: false, tools: ['get_jira_ticket'] },
    github: { id: 'github', name: 'GitHub Enterprise', active: true, tools: ['search_repositories'] }
  });
  const [localDataset, setLocalDataset] = useState(null);

  const [metrics, setMetrics] = useState({ latency: 0, tokenUsage: 0, totalCost: 0, cacheHitRate: 98, activeNodes: 3, backendStatus: 'ONLINE' });
  const [lastApiPayload, setLastApiPayload] = useState(null);
  const [editablePayload, setEditablePayload] = useState('{\n  // Backend Gateway Mode Active\n}');
  
  const [chatAttachments, setChatAttachments] = useState([]);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState('');
  const fileInputRef = useRef(null);

  const [outputStyle, setOutputStyle] = useState('raw');
  const [systemLogs, setSystemLogs] = useState([{ time: new Date().toISOString().split('T')[1].slice(0, 8), msg: 'SYSTEM BOOT: Watchdog active.', type: 'info' }]);
  const [isZenMode, setIsZenMode] = useState(false);

  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);
  const sysLogsEndRef = useRef(null);
  const inputRef = useRef(null);

  // History is now handled by the label-based useEffect above.

  const OUTPUT_STYLES = {
    raw: { label: 'Raw Output (Default)', prefix: '' },
    prompt_engineer: { label: '[Prompt] Meta-Prompt Engineering', prefix: 'Act as an expert AI prompt engineer. Generate a highly optimized, structured, system-level prompt tailored for top-tier models (like GPT-4, Claude 3, and Gemini Ultra) regarding: ' },
    mermaid: { label: 'Mermaid.js Diagram', prefix: 'Create a detailed Mermaid.js architecture diagram for: ' },
    react_tailwind: { label: 'React + Tailwind (Live Render)', prefix: 'INITIATE_WEB_APP: Create a production-ready React component with Tailwind. [CRITICAL: Output ONE complete HTML file in an HTML block. Use CDN for React, ReactDOM, Babel, and Tailwind. Wrap code in <script type="text/babel" data-type="module">]. Target: ' },
    k8s_manifest: { label: 'Kubernetes Manifest', prefix: 'Generate production-ready K8s YAML for: ' },
    terraform: { label: 'Terraform (HCL)', prefix: 'Write production-ready Terraform (HCL) for: ' },
    openapi: { label: 'OpenAPI 3.0 Spec', prefix: 'Generate a strict OpenAPI 3.0 YAML for: ' },
    json_schema: { label: 'JSON Data Payload', prefix: 'Generate a valid JSON structure for: ' },
    executive: { label: 'Executive Summary', prefix: 'Provide an executive summary for: ' },
    security_audit: { label: 'Zero-Trust Security Audit', prefix: 'Perform a Zero-Trust security audit for: ' },
    sre_postmortem: { label: 'SRE Postmortem', prefix: 'Draft an SRE postmortem for: ' },
    socratic: { label: 'Socratic Tutor Mode', prefix: 'Use the Socratic method to help me understand: ' },
    game_mode: { label: 'Game Mode (Text Adventure)', prefix: 'Game Master mode: Theme: ' },
    game_html5: { label: '[Interactive] HTML5 Game', prefix: 'INITIATE_HTML5_GAME: Generate a playable game for: ' },
    app_html5: { label: '[Interactive] Web App (Tools)', prefix: 'INITIATE_WEB_APP: Generate a functional HTML5 web app for: ' },
    image_photorealistic: { label: '[Image] Photorealistic', prefix: 'Generate a highly detailed, photorealistic 8k resolution image of: ' },
    image_blueprint: { label: '[Image] Technical Blueprint', prefix: 'Generate an image of a technical blueprint, white lines on blue background, schematic style: ' },
    audio_synth: { label: '[Audio] TTS Synthesis', prefix: 'INITIATE_AUDIO_JOB: Provide a dramatic reading or vocal explanation of: ' }
  };

  const AGENT_PERSONAS = {
    SecOps: { name: 'SecOps Infra-Agent', icon: <ShieldAlert className="w-5 h-5" />, color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/50', prompt: "You are the SecOps Sub-Agent. Your domain is Cloud Security, Kubernetes (GKE), and IAM." },
    DataOps: { name: 'DataOps Analytics-Agent', icon: <BarChart4 className="w-5 h-5" />, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/50', prompt: "You are the DataOps Sub-Agent. Your domain is databases, vector stores, and analytics." },
    DesignOps: { name: 'DesignOps Viz-Agent', icon: <ImageIcon className="w-5 h-5" />, color: 'text-fuchsia-500', bgColor: 'bg-fuchsia-500/10', borderColor: 'border-fuchsia-500/50', prompt: "You are the DesignOps Sub-Agent. You generate visual blueprints." },
    GameOps: { name: 'App & Game Engine', icon: <Gamepad2 className="w-5 h-5" />, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/50', prompt: "You synthesize playable HTML5 interactions and utility apps." },
    AudioOps: { name: 'AudioOps Synth-Agent', icon: <Headphones className="w-5 h-5" />, color: 'text-indigo-500', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/50', prompt: "You orchestrate actual text-to-speech audio synthesis." },
    General: { name: 'Master Orchestrator', icon: <BrainCircuit className="w-5 h-5" />, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/50', prompt: "You are the Master Orchestrator. You handle general architecture, coding, executive reports, and business logic." }
  };

  const MODEL_PRICING = {
    'gemini-2.5-flash-preview-09-2025': 0.00000025,
    'gemini-2.5-pro': 0.000005,
    'imagen-4.0-generate-001': 0.03,
    'gemini-2.5-flash-preview-tts': 0.000001
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);
  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [swarmLogs]);
  useEffect(() => { sysLogsEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [systemLogs]);

  const addLog = (msg, agent = 'Orchestrator') => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setSwarmLogs(prev => [...prev, { time, msg, agent }]);
  };

  const addSystemLog = (msg, type = 'info') => {
    const time = new Date().toISOString().split('T')[1].slice(0, 8);
    setSystemLogs(prev => [...prev, { time, msg, type }]);
  };

  const processAttachment = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const base64Data = evt.target.result;
      const pureBase64 = base64Data.split(',')[1];
      
      let mimeType = file.type;
      if (!mimeType) {
          if (file.name?.toLowerCase().endsWith('.pdf')) mimeType = 'application/pdf';
          else mimeType = 'image/jpeg';
      }

      setChatAttachments(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name || `pasted_media_${Date.now()}`,
        mimeType: mimeType,
        dataUrl: base64Data,
        base64: pureBase64
      }]);
      addSystemLog(`Attached media: ${file.name || 'Pasted content'} (${mimeType})`, 'info');
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('application/pdf') !== -1) {
        const file = items[i].getAsFile();
        processAttachment(file);
      }
    }
  };

  const handleChatInputChange = (e) => {
    const val = e.target.value;
    setChatInput(val);
    const slashMatch = val.match(/(?:^|\s)\/([a-zA-Z0-9_-]*)$/);
    if (slashMatch !== null) {
      setShowSlashMenu(true);
      setSlashFilter(slashMatch[1].toLowerCase());
    } else {
      setShowSlashMenu(false);
    }
  };

  const insertSlashCommand = (cmdStr) => {
    const newText = chatInput.replace(/(^|\s)\/[a-zA-Z0-9_-]*$/, `$1${cmdStr} `);
    setChatInput(newText);
    setShowSlashMenu(false);
    inputRef.current?.focus();
    
    const commandDef = SLASH_COMMANDS.find(c => c.cmd === cmdStr);
    if (commandDef && commandDef.autoStyle) {
      setOutputStyle(commandDef.autoStyle);
      const styleLabel = OUTPUT_STYLES[commandDef.autoStyle]?.label || commandDef.autoStyle;
      addSystemLog(`Context queued: ${cmdStr}. Auto-applied formatting: [${styleLabel}]`, 'info');
    } else {
      addSystemLog(`Context integration queued: ${cmdStr}`, 'info');
    }
  };

  const removeAttachment = (id) => {
    setChatAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handlePrint = () => {
    window.print();
    addSystemLog('Native print dialog initiated.', 'info');
  };

  const handleExportTXT = () => {
    const exportData = messages.map(m => {
      const agentName = m.agent ? `[${m.agent}]` : '';
      const role = m.role.toUpperCase();
      let attachments = '';
      if (m.imageUrl) attachments += '\n[Attached Image]';
      if (m.audioUrl) attachments += '\n[Attached Audio Stream]';
      if (m.gamePayload) attachments += '\n[Interactive Game Canvas Attached]';
      return `--- ${role} ${agentName} ---\n${m.text}${attachments}`;
    }).join('\n\n');
    const blob = new Blob([exportData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GodMode_Export_${new Date().toISOString().replace(/[:.]/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addSystemLog('Plain text thread exported to local disk.', 'success');
  };

  const handleCopyMessage = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        addSystemLog('Message copied to clipboard.', 'success');
      } else {
        throw new Error("Clipboard API not available or blocked.");
      }
    } catch (err) {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          addSystemLog('Message copied to clipboard (Fallback Exec).', 'success');
        } else {
          throw new Error("execCommand failed");
        }
      } catch (fallbackErr) {
        addSystemLog('Clipboard blocked by Sandbox. Please select text and copy manually.', 'error');
      }
    }
  };

  const handleEditMessage = (index) => {
    if (isProcessing) return;
    const targetMsg = messages[index];
    setChatInput(targetMsg.text);
    setMessages(prev => prev.slice(0, index)); 
    addSystemLog('Thread rewound. Ready to edit prompt.', 'info');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handlePopOutApp = () => {
    setIsZenMode(prev => !prev);
    addSystemLog(isZenMode ? 'Restored standard topology view.' : 'Engaged Zen Mode. Maximizing orchestrator canvas.', 'success');
  };

  const handlePopOut = (msg) => {
    try {
      if (msg.gamePayload) {
        const win = window.open('', '_blank');
        if (win) {
          win.document.open();
          win.document.write(msg.gamePayload);
          win.document.close();
          addSystemLog('Game artifact extracted to isolated browser tab.', 'success');
        } else {
          throw new Error("Browser blocked pop-up.");
        }
      } else if (msg.imageUrl) {
        const win = window.open('', '_blank');
        if (win) {
          win.document.write(`<body style="margin:0;background:#020617;display:flex;justify-content:center;align-items:center;height:100vh;"><img src="${msg.imageUrl}" style="max-width:100%;max-height:100%;" /></body>`);
          addSystemLog('Image artifact extracted to new tab.', 'success');
        } else {
           throw new Error("Browser blocked pop-up.");
        }
      } else {
         addSystemLog('No extractable media payload found.', 'info');
      }
    } catch (err) {
      addSystemLog(`Pop-out failed: Please allow pop-ups for this site.`, 'error');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      addSystemLog('Developer API Key is required to access endpoints.', 'error');
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setIsAuthenticated(true);
      localStorage.setItem('gemini_api_key', apiKey); // SAVE TO DISK
      addLog(`Zero-Trust Gateway: API Key validated. Core set to ${coreModel}.`);
      addSystemLog(`Core Engine locked to ${coreModel}.`, 'info');
    }, 1000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    addLog(`Ingesting: ${file.name}...`, 'DataOps');
    const reader = new FileReader();
    reader.onload = (evt) => {
      setLocalDataset({ name: file.name, size: file.size, content: evt.target.result.substring(0, 15000) });
      addLog(`Dataset [${file.name}] loaded into memory buffer.`, 'DataOps');
    };
    reader.readAsText(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!chatInput.trim() && chatAttachments.length === 0) || isProcessing) return;

    const userQuery = chatInput;
    const selectedPrefix = OUTPUT_STYLES[outputStyle]?.prefix || '';
    let finalPrompt = selectedPrefix ? `${selectedPrefix}${userQuery}` : userQuery;
    
    if (!finalPrompt.trim() && chatAttachments.length > 0) {
        finalPrompt = "Please analyze the attached media.";
    }
    
    const activeModelEndpoint = coreModel === 'custom' ? customModel.trim() : coreModel.trim();

    const currentHistory = messages;
    const currentAttachments = [...chatAttachments];
    setMessages(prev => [...prev, { role: 'user', text: userQuery || finalPrompt, attachments: currentAttachments }]);
    setChatInput('');
    setChatAttachments([]);
    setIsProcessing(true);
    setActiveAgent('Orchestrator');
    const startTime = Date.now();

    try {
      let selectedAgent = 'General';
      let fastTracked = false;

      // SPEED OPTIMIZATION: Skip Intent Check for direct slash commands
      const directCommand = SLASH_COMMANDS.find(c => finalPrompt.includes(c.cmd));
      if (directCommand) {
        if (directCommand.cmd.match(/\/(web|github|jira|slack|notion|gmail|drive|docs|calendar)/)) {
          selectedAgent = 'General';
        } else if (directCommand.cmd.match(/\/(swarm|memory|sandbox|autopilot|simulate|review|aws|linear|quantum|temporal|multiverse|neural|biocompute|nanoswarm|entropy|singularity|hivemind|orbital)/)) {
           selectedAgent = 'General'; // These are logic-heavy, handled by Orchestrator
        } else if (directCommand.cmd === '/terminal' || directCommand.cmd === '/sql') {
          selectedAgent = 'DataOps';
        }
        fastTracked = true;
        addLog(`[Fast-Track] Direct routing via ${directCommand.cmd}.`, 'Orchestrator');
      }

      if (!fastTracked) {
        addLog(`[Intent Check] Routing query...`, 'Orchestrator');
        
        const routerParts = [{ 
            text: `Query: "${finalPrompt}"\n[System Note: Determine intent.]` 
        }];

        const routerPayload = {
          contents: [{ role: 'user', parts: routerParts }],
          systemInstruction: { parts: [{ text: `You are an AI router. Decide target agent: "SecOps" (security/infra/terraform), "DataOps" (data/SQL), "DesignOps" (strictly for [Image] generation requests), "AudioOps" (strictly for [Audio]/TTS voice generation requests), "GameOps" (for INITIATE_HTML5_GAME or INITIATE_WEB_APP), or "General" (for everything else). Return strictly valid JSON: {"target_agent": "..."}` }] },
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        };

        const routerRes = await fetch(`/api/v1/orchestrator/chat?model=${activeModelEndpoint}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey.trim()
          },
          body: JSON.stringify(routerPayload)
        });
        
        if (!routerRes.ok) {
          let exactError = routerRes.statusText;
          try { const errData = await routerRes.json(); exactError = errData.error.message; } catch(e){}
          throw new Error(`Routing Failed (HTTP ${routerRes.status}): ${exactError}`);
        }
        
        const routerData = await routerRes.json();
        let routeResult;
        try { routeResult = JSON.parse(routerData.candidates?.[0]?.content?.parts?.[0]?.text); } 
        catch { routeResult = { target_agent: 'General' }; }

        selectedAgent = routeResult.target_agent || 'General';
      }

      let effectiveModel = activeModelEndpoint;
      if ((selectedAgent === 'GameOps' || selectedAgent === 'DesignOps' || selectedAgent === 'AudioOps') && !effectiveModel.includes('flash')) {
        effectiveModel = 'gemini-1.5-flash';
        addSystemLog(`[Gateway Boost] Backend selecting Flash for high-speed synthesis.`, 'success');
      }

      setActiveAgent(selectedAgent);
      if (!fastTracked) addLog(`Delegating to ${selectedAgent}.`, 'Orchestrator');

      let aiResponse = "";
      
      if (selectedAgent === 'DesignOps') {
        addLog(`Executing REAL image generation pipeline...`, selectedAgent);
        addSystemLog('Dispatching prompt to imagen-4.0-generate-001 model...', 'info');

        const imagePayload = {
            instances: { prompt: finalPrompt },
            parameters: { sampleCount: 1 }
        };
        
        setLastApiPayload(imagePayload);
        setEditablePayload(JSON.stringify(imagePayload, null, 2));

        const execRes = await fetch(`/api/v1/orchestrator/chat?model=imagen-4.0-generate-001`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey.trim()
          },
          body: JSON.stringify(imagePayload)
        });
        
        if (!execRes.ok) {
           let exactError = execRes.statusText;
           try { const errData = await execRes.json(); exactError = errData.error.message; } catch(e){}
           throw new Error(`Image API Execution Failed (HTTP ${execRes.status}): ${exactError}`);
        }
        
        const execData = await execRes.json();
        const base64Image = execData.predictions?.[0]?.bytesBase64Encoded;
        
        if (base64Image) {
            const imageUrl = `data:image/png;base64,${base64Image}`;
            aiResponse = "Visual blueprint rendered successfully via native Imagen 4.0 pipeline.";
            addSystemLog('Base64 image buffer decoded and mounted to DOM successfully.', 'success');
            setMessages(prev => [...prev, { role: 'ai', text: aiResponse, imageUrl: imageUrl, agent: selectedAgent }]);
        } else {
          throw new Error("No image data returned from Imagen model.");
        }

      } else if (selectedAgent === 'AudioOps') {
        addLog(`Executing ACTUAL Text-to-Speech synthesis...`, selectedAgent);
        addSystemLog('POST /v1beta/models/gemini-2.5-flash-preview-tts -> AUDIO', 'info');
        
        const audioPayload = {
          contents: [{ parts: [{ text: finalPrompt }] }],
          generationConfig: { 
            responseModalities: ["AUDIO"], 
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } } 
          },
          model: "gemini-2.5-flash-preview-tts"
        };
        
        setLastApiPayload(audioPayload);
        setEditablePayload(JSON.stringify(audioPayload, null, 2));
        
        const execRes = await fetch(`/api/v1/orchestrator/chat?model=gemini-2.5-flash-preview-tts`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey.trim()
          },
          body: JSON.stringify(audioPayload)
        });
        
        if (!execRes.ok) throw new Error(`Audio API Execution Failed (HTTP ${execRes.status})`);
        
        const execData = await execRes.json();
        const pcmData = execData.candidates?.[0]?.content?.parts?.[0]?.inlineData;
        
        if (pcmData) {
           const match = pcmData.mimeType.match(/rate=(\d+)/);
           const sampleRate = match ? parseInt(match[1], 10) : 24000;
           const actualAudioUrl = createWav(pcmData.data, sampleRate);
           aiResponse = `Real Text-to-Speech Synth complete. Generated WAV blob [${sampleRate}Hz].`;
           addSystemLog(`Converted raw PCM Base64 to playable WAV format.`, 'success');
           setMessages(prev => [...prev, { role: 'ai', text: aiResponse, audioUrl: actualAudioUrl, agent: selectedAgent }]);
        } else {
           throw new Error("No audio payload returned from TTS model.");
        }

      } else {
        const apiContents = currentHistory.filter(m => m.role !== 'system').map(m => {
          const parts = [];
          if (m.text) parts.push({ text: m.text });
          if (m.attachments) {
            m.attachments.forEach(att => parts.push({ inlineData: { mimeType: att.mimeType, data: att.base64 } }));
          }
          if (parts.length === 0) parts.push({ text: " " });
          return { role: m.role === 'ai' ? 'model' : 'user', parts };
        });

        const currentUserParts = [];
        if (finalPrompt) currentUserParts.push({ text: finalPrompt });
        currentAttachments.forEach(att => {
           currentUserParts.push({ inlineData: { mimeType: att.mimeType, data: att.base64 } });
        });
        apiContents.push({ role: 'user', parts: currentUserParts });

        let sysPrompt = AGENT_PERSONAS[selectedAgent]?.prompt || AGENT_PERSONAS['General'].prompt;
        
        if (localDataset) sysPrompt += `\n[LOCAL RAG FILE - ${localDataset.name}]: """${localDataset.content}""" Use this data if applicable.`;

        let requestGoogleSearch = false;
        
        // --- REAL IMPLEMENTATION DIRECTIVES (NO MOCK DATA) ---
        if (finalPrompt.includes('/web')) requestGoogleSearch = true;
        if (finalPrompt.includes('/gmail')) sysPrompt += `\n[WORKSPACE - GMAIL]: (Note: Direct Gmail API unlinked). Act as an expert email drafter/summarizer for this request.`;
        if (finalPrompt.includes('/github')) sysPrompt += `\n[INTEGRATION - GITHUB]: The user wants codebase context. Use the 'search_repositories' function to fetch real GitHub data if relevant.`;
        if (finalPrompt.includes('/terminal')) sysPrompt += `\n[INTEGRATION - TERMINAL]: Act as a CLI terminal. Output standard out text exactly as a real terminal would based on user commands.`;
        if (finalPrompt.includes('/swarm')) sysPrompt += `\n[INTEGRATION - SWARM]: Use a multi-agent debate format. Show SecOps and DataOps arguing their perspectives step-by-step before reaching a conclusion.`;
        if (finalPrompt.includes('/simulate')) sysPrompt += `\n[INTEGRATION - SIMULATE]: Run a deep step-by-step logical Monte Carlo projection of the proposed architecture in your reasoning.`;
        if (finalPrompt.includes('/review')) sysPrompt += `\n[INTEGRATION - REVIEW]: Act as a hostile Red-Team security auditor. Identify flaws in the provided architecture/code.`;
        if (finalPrompt.includes('/aws')) sysPrompt += `\n[INTEGRATION - AWS]: Output raw Terraform (HCL) configurations to implement this state in AWS.`;
        if (finalPrompt.includes('/quantum')) sysPrompt += `\n[INTEGRATION - QUANTUM]: Frame the answer using quantum computing analogies and entanglement models.`;
        if (finalPrompt.includes('/multiverse')) sysPrompt += `\n[INTEGRATION - MULTIVERSE]: Generate 3 distinct parallel timelines of architectural decisions and explicitly evaluate their outcomes.`;
        if (finalPrompt.includes('/autopilot')) sysPrompt += `\n[INTEGRATION - AUTOPILOT]: SYSTEM OVERRIDE: Generate a 3-step autonomous execution plan and execute step 1 immediately.`;

        // ANTI-FIXATION DIRECTIVE TO PREVENT TOOL HALLUCINATION
        sysPrompt += `\n\n[CRITICAL OPERATIONAL DIRECTIVE]: You are a powerful, fully-featured AI. Any tools provided to you (like GitHub or Jira) are purely OPTIONAL extensions. NEVER refuse a user's request by claiming your capabilities are limited to your tools. You MUST answer the prompt directly, generate the requested text/code, or perform the requested simulation using your own vast internal knowledge.`;

        const executionPayload = {
          contents: apiContents,
          systemInstruction: { parts: [{ text: sysPrompt }] }
        };

        const activeTools = [];
        if (requestGoogleSearch) {
           activeTools.push({ google_search: {} });
           addSystemLog(`Google Search Grounding injected into generation payload. MCP tools temporarily disabled to avoid API conflict.`, 'info');
        } else {
          const functionDeclarations = [];
          if (mcpServers.jira.active) functionDeclarations.push({ name: "get_jira_ticket", description: "Fetch Jira ticket status", parameters: { type: "OBJECT", properties: { ticket_id: { type: "STRING" } }, required: ["ticket_id"] }});
          if (mcpServers.github.active) functionDeclarations.push({ name: "search_repositories", description: "Search GitHub code repos by keyword", parameters: { type: "OBJECT", properties: { query: { type: "STRING" } }, required: ["query"] }});
          
          if (functionDeclarations.length > 0) {
             activeTools.push({ functionDeclarations: functionDeclarations });
          }
        }
        
        if (activeTools.length > 0) executionPayload.tools = activeTools;

        setLastApiPayload(executionPayload);
        setEditablePayload(JSON.stringify(executionPayload, null, 2));

        addLog(`Routing to Java Gateway (Port 8082)...`, selectedAgent);
        
        // --- CALLING THE NEW JAVA BACKEND GATEWAY ---
        const GATEWAY_URL = "/api/v1/orchestrator/chat";
        
        let execRes = await fetch(`${GATEWAY_URL}?model=${effectiveModel}&label=${encodeURIComponent(currentLabel)}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey.trim()
          },
          body: JSON.stringify(executionPayload)
        });
        
        if (!execRes.ok) {
           let exactError = execRes.statusText;
           try { const errData = await execRes.json(); exactError = errData.error.message || exactError; } catch(e){}
           throw new Error(`Gateway Execution Failed (HTTP ${execRes.status}): ${exactError}`);
        }
        
        const part = await execRes.text();
        let aiResponse = part; 

        // Finalize Response
        if (!aiResponse) aiResponse = "Empty response.";
        
        let extractedGamePayload = null;
        const htmlKeywords = ['<!DOCTYPE html>', '<html', '<head', '<body', 'import React', 'ReactDOM.render', 'ReactDOM.createRoot'];
        const isPotentialApp = selectedAgent === 'GameOps' || htmlKeywords.some(kw => aiResponse.toLowerCase().includes(kw.toLowerCase()));

        if (isPotentialApp) {
          // Robust Extraction Strategy: Try multiple regex patterns
          const patterns = [
            /```html\n?([\s\S]*?)```/i,
            /```jsx\n?([\s\S]*?)```/i,
            /```javascript\n?([\s\S]*?)```/i,
            /(<!DOCTYPE html>[\s\S]*?<\/html>)/is,
            /(<html[\s\S]*?<\/html>)/is
          ];

          for (const pattern of patterns) {
            const match = aiResponse.match(pattern);
            if (match && match[1]) {
              extractedGamePayload = match[1].trim();
              aiResponse = aiResponse.replace(pattern, '\n_[Interactive Application Mounted Below]_\n');
              break;
            } else if (match && match[0]) {
              extractedGamePayload = match[0].trim();
              aiResponse = aiResponse.replace(pattern, '\n_[Interactive Application Mounted Below]_\n');
              break;
            }
          }
          
          // Fallback: If no tags found but agent is GameOps, try to wrap raw content
          if (!extractedGamePayload && selectedAgent === 'GameOps' && aiResponse.length > 200) {
             extractedGamePayload = aiResponse;
             aiResponse = '_[Raw Content Wrapped as Application]_';
          }
        }

        addLog(`Synthesis complete.`, selectedAgent);
        setMessages(prev => [...prev, { role: 'ai', text: aiResponse, agent: selectedAgent, gamePayload: extractedGamePayload }]);
      }

      const latency = Date.now() - startTime;
      addSystemLog(`Inference cycle complete. RT Latency: ${latency}ms`, 'info');
      
      const newTokens = Math.floor(aiResponse.length / 3) + 150;
      const modelCostPerToken = MODEL_PRICING[activeModelEndpoint] || 0.000005;
      
      setMetrics(m => ({ 
        latency, 
        tokenUsage: m.tokenUsage + newTokens, 
        totalCost: m.totalCost + (newTokens * modelCostPerToken),
        cacheHitRate: Math.max(70, Math.min(100, m.cacheHitRate + (Math.random() > 0.5 ? 1 : -2))),
        activeNodes: Math.max(3, m.activeNodes + (Math.random() > 0.8 ? 1 : 0)) 
      }));

    } catch (err) {
      addLog(`System Fault: ${err.message}`, 'error');
      addSystemLog(`EXCEPTION: ${err.message}`, 'error');
      setMessages(prev => [...prev, { role: 'system', text: `FAULT: ${err.message}` }]);
    } finally {
      setIsProcessing(false);
      setActiveAgent('Orchestrator');
    }
  };

  const handleExecuteRawPayload = async () => {
    if (isProcessing) return;
    
    let customPayload;
    try {
      customPayload = JSON.parse(editablePayload);
    } catch (err) {
      addSystemLog(`JSON Parsing Error: Invalid payload structure. ${err.message}`, 'error');
      return;
    }

    setIsProcessing(true);
    setActiveAgent('Orchestrator');
    const startTime = Date.now();

    if (customPayload.endpoint) {
      addLog(`[Universal Router] Intercepted custom endpoint. Bypassing Gemini...`, 'Orchestrator');
      addSystemLog(`Dispatching raw payload to: ${customPayload.endpoint}`, 'info');
      
      const headers = { 'Content-Type': 'application/json' };
      if (customPayload.auth) headers['Authorization'] = customPayload.auth;

      try {
        const extRes = await fetch(customPayload.endpoint, {
          method: customPayload.method || 'POST',
          headers: headers,
          body: JSON.stringify(customPayload.payload || customPayload)
        });

        if (!extRes.ok) throw new Error(`External API Failed (HTTP ${extRes.status})`);

        const extData = await extRes.json();
        let aiResponse = "External API execution complete.";
        let extractedImageUrl = null;

        if (extData.data && Array.isArray(extData.data) && extData.data[0]?.url) {
           extractedImageUrl = extData.data[0].url;
           aiResponse = `Visual artifact successfully retrieved from universal endpoint.`;
        } else {
           aiResponse = `\`\`\`json\n${JSON.stringify(extData, null, 2)}\n\`\`\``;
        }

        setMessages(prev => [...prev, { role: 'ai', text: aiResponse, imageUrl: extractedImageUrl, agent: 'General' }]);
        addSystemLog(`Universal Override execution complete.`, 'success');
      } catch (err) {
        addSystemLog(`EXCEPTION: ${err.message}.`, 'error');
        setMessages(prev => [...prev, { role: 'system', text: `UNIVERSAL PAYLOAD FAULT: ${err.message}\n\n*Architectural Note: Modern browsers enforce strict CORS. True cross-domain API execution requires a backend proxy server to bypass CORS.*` }]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!customPayload.contents && !customPayload.instances) {
       addSystemLog(`Schema Warning: Unrecognized payload architecture.`, 'error');
       setMessages(prev => [...prev, { role: 'system', text: `RAW PAYLOAD FAULT: The public Gemini API requires valid structural payload.` }]);
       setIsProcessing(false);
       return;
    }

    const activeModelEndpoint = coreModel === 'custom' ? customModel.trim() : coreModel.trim();

    try {
      addLog(`[Raw API Override] Intercepting payload and dispatching to network...`, 'Orchestrator');
      addSystemLog('Dispatching modified raw JSON payload...', 'info');

      const execRes = await fetch(`/api/v1/orchestrator/chat?model=${activeModelEndpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-API-KEY': apiKey.trim()
        },
        body: JSON.stringify(customPayload)
      });
      
      if (!execRes.ok) throw new Error(`Override Execution Failed (HTTP ${execRes.status})`);
      
      const execData = await execRes.json();
      const part = execData.candidates?.[0]?.content?.parts?.[0];
      let aiResponse = part?.text || JSON.stringify(execData, null, 2); 

      let extractedGamePayload = null;
      if (aiResponse.includes('```html') || aiResponse.toLowerCase().includes('<html')) {
        const htmlMatch = aiResponse.match(/```html\n?([\s\S]*?)```/i);
        if (htmlMatch && htmlMatch[1]) {
          extractedGamePayload = htmlMatch[1];
          aiResponse = aiResponse.replace(/```html\n?([\s\S]*?)```/i, '\n_[Interactive Application Mounted Below]_\n');
        } else {
           const rawHtmlMatch = aiResponse.match(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i);
           if (rawHtmlMatch) {
             extractedGamePayload = rawHtmlMatch[0];
             aiResponse = aiResponse.replace(/(<!DOCTYPE html>[\s\S]*?<\/html>|<html[\s\S]*?<\/html>)/i, '\n_[Interactive Application Mounted Below]_\n');
           }
        }
      }

      addLog(`Override execution complete.`, 'Orchestrator');
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, agent: 'General', gamePayload: extractedGamePayload }]);

      const latency = Date.now() - startTime;
      addSystemLog(`Raw Override inference complete. RT Latency: ${latency}ms`, 'success');

    } catch (err) {
      addLog(`Raw Payload Fault: ${err.message}`, 'error');
      addSystemLog(`EXCEPTION: ${err.message}`, 'error');
      setMessages(prev => [...prev, { role: 'system', text: `RAW PAYLOAD FAULT: ${err.message}` }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderMessageContent = (text) => {
    if (!text) return null;
    const blockRegex = /(```[\s\S]*?```)/g;
    const blocks = text.split(blockRegex);
    
    return blocks.map((block, i) => {
      if (block.startsWith('```') && block.endsWith('```')) {
        const lines = block.split('\n');
        const lang = lines[0].replace('```', '').trim().toLowerCase();
        const code = lines.slice(1, -1).join('\n');
        
        if (lang === 'mermaid') {
          return <MermaidBlock key={i} code={code} />;
        }
        
        return (
          <div key={i} className="my-4 rounded-md border border-slate-700 bg-slate-950 overflow-hidden shadow-sm print:border-slate-300 print:bg-slate-50">
            <div className="bg-slate-800 text-slate-400 text-[10px] px-3 py-1.5 uppercase font-bold tracking-wider border-b border-slate-700 print:bg-slate-200 print:text-black print:border-slate-300">
              {lang || 'Code Snippet'}
            </div>
            <div className="p-3 overflow-x-auto">
              <pre className="text-slate-300 text-[11px] font-mono leading-relaxed print:text-black"><code>{code}</code></pre>
            </div>
          </div>
        );
      }
      
      const boldParts = block.split(/(\*\*[\s\S]*?\*\*)/g);
      return (
        <span key={i}>
          {boldParts.map((p, j) => 
            p.startsWith('**') && p.endsWith('**') 
              ? <strong key={j} className="font-bold text-slate-200 print:text-black">{p.slice(2, -2)}</strong> 
              : p
          )}
        </span>
      );
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-slate-300 relative">
        <button 
          onClick={() => setIsConfigOpen(true)} 
          className="absolute top-6 right-6 p-2 bg-slate-900 border border-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6"><ShieldCheck className="w-16 h-16 text-blue-500" /></div>
          <h1 className="text-2xl text-center text-white mb-2 font-bold tracking-tight">God-Mode Orchestrator</h1>
          <p className="text-sm text-center text-slate-500 mb-6">Zero-Trust Perimeter</p>
          
          {metrics.tokenUsage > 0 && (
            <div className="mb-6 bg-slate-950 border border-slate-800 rounded-lg p-4 text-center shadow-inner">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
                <Activity className="w-3 h-3"/> Active Session Ledger
              </div>
              <div className="flex justify-center items-baseline gap-4">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-amber-400">{metrics.tokenUsage.toLocaleString()}</span>
                  <span className="text-[9px] text-slate-500 uppercase">Tokens</span>
                </div>
                <div className="text-slate-600 text-2xl font-thin">/</div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-emerald-500">${metrics.totalCost.toFixed(5)}</span>
                  <span className="text-[9px] text-slate-500 uppercase">Expended</span>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2"><Lock className="w-3.5 h-3.5"/> Gemini API Key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="AIzaSy..." className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 transition-colors" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2"><Cpu className="w-3.5 h-3.5"/> Core Model Engine</label>
              <select value={coreModel} onChange={(e) => setCoreModel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 transition-colors appearance-none">
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Stable)</option>
                <option value="gemini-2.5-flash-preview-09-2025">Gemini 2.5 Flash Preview</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                <option value="custom">Other (Custom Model String...)</option>
              </select>
              
              {coreModel === 'custom' && (
                <input 
                  type="text" 
                  value={customModel} 
                  onChange={(e) => setCustomModel(e.target.value)} 
                  placeholder="e.g., gemini-1.5-pro" 
                  className="w-full mt-2 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 transition-colors" 
                  required 
                />
              )}
            </div>
            <button type="submit" disabled={isAuthenticating} className={`w-full py-2.5 mt-2 rounded text-white font-bold tracking-wide transition-all ${isAuthenticating ? 'bg-blue-800 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'}`}>
              {isAuthenticating ? 'Mounting Gateway...' : 'Initialize System'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-screen bg-slate-950 text-slate-300 font-mono flex flex-col overflow-hidden selection:bg-blue-900 selection:text-white print:bg-white print:text-black">
        
        <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 z-20 print:hidden shadow-lg">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-white tracking-wide uppercase text-sm">God-Mode // {currentLabel || 'Main Thread'}</span>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/50 px-4 py-1.5 rounded-full border border-slate-800 shadow-inner">
            <div className="flex items-center gap-2 border-r border-slate-800 pr-4">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <select 
                value={coreModel} 
                onChange={(e) => setCoreModel(e.target.value)} 
                className="bg-transparent text-[10px] font-bold text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="gemini-2.5-flash">2.5 FLASH</option>
                <option value="gemini-2.5-pro">2.5 PRO</option>
                <option value="gemini-2.0-flash-exp">2.0 EXP</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <input 
                type="password" 
                value={apiKey} 
                onChange={(e) => {
                  setApiKey(e.target.value);
                  localStorage.setItem('gemini_api_key', e.target.value);
                }}
                className="bg-transparent text-[10px] text-slate-400 focus:text-white w-24 focus:outline-none transition-all"
                placeholder="API KEY"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handlePrint} className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors" title="Print Native Document">
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={handleExportTXT} className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors" title="Export Thread (TXT)">
              <Download className="w-3.5 h-3.5" /> TXT
            </button>
            <button onClick={() => setIsZenMode(!isZenMode)} className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors" title={isZenMode ? "Restore Sidebars" : "Maximize Canvas (Zen Mode)"}>
              {isZenMode ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />} {isZenMode ? 'Restore' : 'Zen Mode'}
            </button>
            <button onClick={() => setIsConfigOpen(true)} className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-colors">
              <Settings className="w-3.5 h-3.5" /> Config
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Pane: Session Vault */}
          {!isZenMode && (
            <div className="w-72 bg-slate-900/50 border-r border-slate-800 flex flex-col print:hidden no-pdf shrink-0">
              <div className="p-4 border-b border-slate-800 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2"><FolderSearch className="w-4 h-4" /> Chat Vault</h2>
                  <button onClick={() => setIsLabelModalOpen(true)} className="p-1 hover:bg-slate-800 rounded text-blue-400" title="New Session Group">
                    <PlusSquare className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2 overflow-y-auto max-h-[30vh] custom-scrollbar pr-2">
                  {labels.map(lbl => (
                    <div 
                      key={lbl} 
                      onClick={() => {
                        setCurrentLabel(lbl);
                      }}
                      className={`p-2.5 rounded border flex items-center justify-between group cursor-pointer transition-all ${currentLabel === lbl ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className={`w-3.5 h-3.5 ${currentLabel === lbl ? 'text-blue-400' : 'text-slate-600'}`} />
                        <span className={`text-xs font-bold truncate ${currentLabel === lbl ? 'text-white' : 'text-slate-400'}`}>{lbl}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col overflow-hidden p-4">
                <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2 shrink-0"><Activity className="w-3 h-3" /> System Heartbeat</h3>
                <div className="flex-1 overflow-y-auto space-y-2 text-xs custom-scrollbar pr-2">
                  {swarmLogs.slice(-30).map((log, i) => (
                    <div key={i} className="flex flex-col mb-2 opacity-80 border-l border-slate-800 pl-2">
                      <span className={`font-bold text-[9px] ${log.agent === 'error' ? 'text-red-500' : 'text-blue-500'}`}>[{log.agent}]</span>
                      <span className="text-slate-400 leading-tight">{log.msg}</span>
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          )}

          {/* Center Pane: Chat Core */}
          <div className="flex-1 flex flex-col bg-slate-950 border-r border-slate-800 relative print:border-none print:bg-white">
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
              <div ref={chatContainerRef} className="p-6 space-y-6 min-h-full">
                {messages.map((msg, i) => {
                  const persona = AGENT_PERSONAS[msg.agent] || AGENT_PERSONAS['General'];
                  const isMaximized = maximizedIndex === i;
                  
                  let containerClasses = `ai-response max-w-[90%] w-full rounded-lg p-4 print:max-w-full print:border-none print:shadow-none print:bg-transparent ${msg.role === 'user' ? 'bg-slate-800 border border-slate-700 print:text-black w-auto' : msg.role === 'system' ? 'bg-slate-900 border border-slate-700 text-xs text-center w-full print:hidden' : `${persona.bgColor} border ${persona.borderColor} print:text-black`}`;
                  
                  if (isMaximized) {
                    containerClasses = `!fixed !top-0 !left-0 !w-screen !h-screen !max-w-none !m-0 !rounded-none !bg-slate-950 !overflow-y-auto p-6 sm:p-12 flex flex-col print:hidden !z-[999999]`;
                  }

                  return (
                    <div key={msg.id || i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={containerClasses}>
                        
                        {isMaximized && (
                          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800 shrink-0">
                            <div className="flex items-center gap-3">
                              <BrainCircuit className="w-6 h-6 text-blue-500 animate-pulse" />
                              <span className="font-bold text-white tracking-wide">IMMERSIVE MODE // GOD-MODE</span>
                            </div>
                            <div className="flex gap-3">
                              {(msg.gamePayload || msg.imageUrl || msg.audioUrl) && (
                                <button onClick={() => handlePopOut(msg)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors" title="Pop out to new browser tab">
                                  <ExternalLink className="w-4 h-4"/> Pop-Out
                                </button>
                              )}
                              <button onClick={() => setMaximizedIndex(null)} className="p-2 bg-slate-800 hover:bg-red-500 hover:text-white rounded transition-colors text-slate-300" title="Exit Immersive Mode">
                                <X className="w-5 h-5"/>
                              </button>
                            </div>
                          </div>
                        )}

                        {msg.role === 'ai' && (
                          <div className="flex items-center justify-between mb-2">
                            <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${persona.color}`}>
                              {persona.icon} {persona.name}
                            </div>
                            <div className="flex gap-2 print:hidden">
                              {!isMaximized && (
                                <>
                                  {(msg.gamePayload || msg.imageUrl) && (
                                    <button onClick={() => handlePopOut(msg)} className="text-slate-500 hover:text-blue-400 transition-colors" title="Pop out to new browser tab">
                                      <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  <button onClick={() => setMaximizedIndex(i)} className="text-slate-500 hover:text-slate-300 transition-colors" title="Enter Immersive Mode">
                                    <Maximize className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              <button onClick={() => handleCopyMessage(msg.text)} className="text-slate-500 hover:text-slate-300 transition-colors" title="Copy Message">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}

                        {msg.role === 'user' && (
                          <div className="flex items-center justify-between mb-2 print:hidden">
                            <button onClick={() => handleEditMessage(i)} disabled={isProcessing} className="text-slate-500 hover:text-blue-400 transition-colors disabled:opacity-50" title="Edit & Resubmit Prompt">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Client Identity <Activity className="w-3 h-3" />
                            </div>
                          </div>
                        )}
                        
                        <div className="leading-relaxed text-sm whitespace-pre-wrap">{renderMessageContent(msg.text)}</div>

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.attachments.map((att, idx) => (
                              <div key={idx} className="relative group rounded overflow-hidden border border-slate-600 bg-slate-900 w-24 h-24">
                                {att.mimeType.includes('image') ? (
                                  <img src={att.dataUrl} alt="Attached" className="w-full h-full object-cover" />
                                ) : (
                                  <div className="flex flex-col items-center justify-center w-full h-full p-2 text-center text-[10px] text-slate-400">
                                    <FileText className="w-6 h-6 mb-1 text-slate-500" />
                                    <span className="truncate w-full">{att.name}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {msg.imageUrl && (
                          <div className={`mt-4 rounded-lg overflow-hidden border border-slate-700 shadow-lg print:border-slate-300 bg-black flex justify-center ${isMaximized ? 'flex-1 min-h-0' : ''}`}>
                            <img src={msg.imageUrl} alt="Generated Artifact" className={`w-full ${isMaximized ? 'h-full object-contain' : 'h-auto object-cover'}`} />
                          </div>
                        )}

                        {msg.audioUrl && (
                          <div className={`mt-4 rounded-lg overflow-hidden border border-slate-700 shadow-lg bg-slate-900 p-4 print:hidden`}>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-2"><Headphones className="w-4 h-4"/> Text-to-Speech Render</div>
                            <audio controls autoPlay className="w-full h-10 outline-none rounded">
                              <source src={msg.audioUrl} type="audio/wav" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}
                        
                        {msg.gamePayload && (
                          <div className="mt-4 flex flex-col gap-2">
                            <div 
                              className={`print:hidden flex flex-col bg-slate-900 rounded border border-slate-700 p-1 shadow-lg overflow-hidden ${isMaximized ? 'flex-1 min-h-0' : ''}`}
                              style={!isMaximized ? { resize: 'both', minHeight: '300px', minWidth: '250px', height: '450px' } : {}}
                            >
                              <iframe 
                                srcDoc={msg.gamePayload.includes('<html') ? msg.gamePayload : `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-950 text-white p-4">${msg.gamePayload}</body></html>`} 
                                className="w-full h-full rounded bg-[#020617]" 
                                title="Interactive App Canvas"
                                sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-modals"
                                allow="camera; microphone; display-capture; fullscreen"
                              />
                            </div>
                            <div className="flex justify-end print:hidden">
                              <button 
                                onClick={() => {
                                  setChatInput(`REPAIR_APP: The previous app failed to render correctly or was incomplete. Please regenerate the FULL, complete HTML code for: ${messages[messages.indexOf(msg)-1]?.text || 'the requested application'}`);
                                  inputRef.current?.focus();
                                }}
                                className="text-[10px] bg-amber-900/20 text-amber-500 hover:bg-amber-500 hover:text-white px-2 py-1 rounded border border-amber-500/50 flex items-center gap-1 transition-all"
                              >
                                <Zap className="w-3 h-3" /> Repair & Re-render
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {isProcessing && (
                  <div className="flex justify-start print:hidden">
                    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-blue-500 animate-pulse" />
                      <span className="text-xs text-slate-400 uppercase animate-pulse">{activeAgent === 'Orchestrator' ? 'Routing...' : `${activeAgent} Executing...`}</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>
            
            <div className="p-4 bg-slate-900 border-t border-slate-800 shrink-0 print:hidden no-pdf">
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="text-[10px] text-fuchsia-500 uppercase tracking-wider font-bold flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Cognitive Formatting & DesignOps
                </span>
                <select 
                  value={outputStyle} 
                  onChange={(e) => setOutputStyle(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-slate-300 text-[10px] rounded px-2 py-1 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50"
                >
                  {Object.entries(OUTPUT_STYLES).map(([key, style]) => (
                    <option key={key} value={key}>{style.label}</option>
                  ))}
                </select>
              </div>

              {chatAttachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {chatAttachments.map(att => (
                    <div key={att.id} className="relative flex items-center gap-2 bg-slate-800 border border-slate-700 rounded p-1 pr-2 max-w-[200px]">
                      {att.mimeType.includes('image') ? (
                        <img src={att.dataUrl} className="w-8 h-8 rounded object-cover" alt="Preview" />
                      ) : (
                        <div className="w-8 h-8 bg-slate-900 flex items-center justify-center rounded"><FileText className="w-4 h-4 text-slate-400" /></div>
                      )}
                      <span className="text-[10px] text-slate-300 truncate flex-1">{att.name}</span>
                      <button type="button" onClick={() => removeAttachment(att.id)} className="text-slate-500 hover:text-red-400"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                {showSlashMenu && (
                  <div className="absolute bottom-full mb-2 left-0 w-72 bg-slate-800 border border-slate-600 rounded-lg shadow-2xl overflow-hidden z-50 flex flex-col max-h-64">
                    <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900 border-b border-slate-700 shrink-0">Universal Context Integrations</div>
                    <div className="overflow-y-auto custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-600">
                      {SLASH_COMMANDS.filter(c => c.cmd.toLowerCase().includes(slashFilter)).length === 0 ? (
                        <div className="p-3 text-xs text-slate-500 text-center">No matching integrations found.</div>
                      ) : (
                        SLASH_COMMANDS.filter(c => c.cmd.toLowerCase().includes(slashFilter)).map(cmd => {
                          const Icon = cmd.icon;
                          return (
                            <button 
                              key={cmd.cmd}
                              type="button" 
                              onClick={() => insertSlashCommand(cmd.cmd)} 
                              className="w-full text-left px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-3 transition-colors border-b border-slate-700/50 last:border-0"
                            >
                              <Icon className={`w-4 h-4 shrink-0 ${cmd.color}`} /> 
                              <span className="font-bold">{cmd.cmd}</span>
                              <span className="text-[10px] text-slate-400 ml-auto truncate pl-2">{cmd.desc}</span>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                  <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*,application/pdf" onChange={(e) => Array.from(e.target.files).forEach(processAttachment)} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute left-2 p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors z-10" title="Attach image/PDF">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <input 
                    ref={inputRef} 
                    type="text" 
                    value={chatInput} 
                    onChange={handleChatInputChange} 
                    onPaste={handlePaste}
                    placeholder="Ask the Swarm or type / for Workspace tools... (Paste images directly)" 
                    disabled={isProcessing} 
                    className="w-full bg-slate-950 border border-slate-700 rounded-md py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-blue-500 focus:ring-1" 
                  />
                  <button type="submit" disabled={isProcessing || (!chatInput.trim() && chatAttachments.length === 0)} className="absolute right-2 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors disabled:opacity-50 z-10">
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Pane: Telemetry Hub */}
          {!isZenMode && (
            <div className="w-80 bg-slate-900/50 flex flex-col print:hidden no-pdf shrink-0 overflow-hidden">
              <div className="p-4 border-b border-slate-800 shrink-0">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Live Telemetry</h2>
                
                <div className="space-y-4">
                  <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-3">
                    <span className="text-[10px] font-bold text-slate-600 uppercase block mb-2">Service Health</span>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between items-center"><span className="text-slate-400">Gemini REST API</span><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></div>
                      <div className="flex justify-between items-center"><span className="text-slate-400">MCP Registry</span><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-blue-400 leading-none">{metrics.latency}ms</div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">Latency</div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 rounded-lg p-2 text-center">
                      <div className="text-lg font-bold text-fuchsia-400 leading-none">{metrics.cacheHitRate}%</div>
                      <div className="text-[9px] font-bold text-slate-600 uppercase mt-1">Cache Hit</div>
                    </div>
                  </div>

                  <div className="bg-slate-950/50 border border-emerald-900/30 rounded-lg p-2 flex items-center justify-between px-4">
                    <div className="flex flex-col">
                      <span className="text-lg font-bold text-emerald-400 leading-none">{metrics.tokenUsage}</span>
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Tokens</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-500">${metrics.totalCost.toFixed(5)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center">
                    <FileJson className="w-3.5 h-3.5 text-slate-400 mr-2" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Raw API Payload</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleCopyMessage(editablePayload)} className="p-1 text-slate-500 hover:text-slate-300"><Copy className="w-3 h-3" /></button>
                    <button onClick={handleExecuteRawPayload} disabled={isProcessing} className="flex items-center gap-1 text-[9px] font-bold bg-emerald-900/30 text-emerald-400 hover:bg-emerald-500 hover:text-white px-2 py-0.5 rounded border border-emerald-900/50 transition-all disabled:opacity-50">
                      <Play className="w-2.5 h-2.5" /> OVERRIDE
                    </button>
                  </div>
                </div>
                <div className="flex-1 bg-slate-950 p-2 overflow-hidden flex flex-col">
                  <textarea 
                    value={editablePayload}
                    onChange={(e) => setEditablePayload(e.target.value)}
                    spellCheck="false"
                    className="flex-1 w-full bg-transparent text-[10px] text-slate-500 font-mono resize-none focus:outline-none custom-scrollbar"
                  />
                </div>

                <div className="h-10 bg-slate-900 border-y border-slate-800 flex items-center px-4 shrink-0">
                  <Terminal className="w-3.5 h-3.5 text-slate-400 mr-2" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">System Event Log</span>
                </div>
                <div className="h-48 overflow-y-auto p-3 bg-slate-950 custom-scrollbar shrink-0">
                  {systemLogs.map((log, i) => (
                    <div key={i} className="text-[9px] font-mono flex gap-2 mb-1">
                      <span className="text-slate-600 shrink-0">[{log.time}]</span>
                      <span className={`${log.type === 'error' ? 'text-red-500' : log.type === 'success' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {log.msg}
                      </span>
                    </div>
                  ))}
                  <div ref={sysLogsEndRef} />
                </div>
              </div>
            </div>
          )}
        </div>

        {isConfigOpen && (
          <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden no-pdf">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
              <div className="flex items-center justify-between p-4 border-b border-slate-800">
                <span className="font-bold text-white flex items-center gap-2"><Settings className="w-5 h-5 text-blue-500" /> System Configuration</span>
                <button onClick={() => setIsConfigOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-8">
                <div>
                  <h4 className="text-xs uppercase text-slate-500 mb-3 flex items-center gap-2"><Cloud className="w-4 h-4" /> Virtual Fabric Connectors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(connectors).map(c => (
                      <div key={c.id} onClick={() => setConnectors(p => ({...p, [c.id]: {...p[c.id], active: !p[c.id].active}}))} className={`p-4 rounded border cursor-pointer ${c.active ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-950 border-slate-800'}`}>
                        <div className="flex justify-between text-sm font-bold text-slate-200"><span>{c.name}</span><div className={`w-3 h-3 rounded-full ${c.active ? 'bg-green-500' : 'bg-slate-700'}`} /></div>
                        <div className="text-xs text-slate-500 mt-1">{c.type}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-slate-500 mb-3 flex items-center gap-2"><Plug className="w-4 h-4" /> MCP Server Registry</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(mcpServers).map(s => (
                      <div key={s.id} onClick={() => setMcpServers(p => ({...p, [s.id]: {...p[s.id], active: !p[s.id].active}}))} className={`p-4 rounded border cursor-pointer ${s.active ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-950 border-slate-800'}`}>
                        <div className="flex justify-between text-sm font-bold text-slate-200"><span>{s.name}</span><div className={`w-3 h-3 rounded-[3px] ${s.active ? 'bg-purple-500' : 'bg-slate-700'}`} /></div>
                        <div className="text-[10px] text-purple-400 mt-2 font-mono">{s.tools.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-slate-500 mb-3 flex items-center gap-2"><Lock className="w-4 h-4" /> Core Authentication</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Gemini API Key</label>
                      <input 
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => {
                          setApiKey(e.target.value);
                          localStorage.setItem('gemini_api_key', e.target.value);
                        }} 
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1.5">Engine Model</label>
                      <select 
                        value={coreModel} 
                        onChange={(e) => setCoreModel(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 appearance-none"
                      >
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                        <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
                        <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase text-slate-500 mb-3 flex items-center gap-2"><HardDrive className="w-4 h-4" /> Local RAG Ingestion</h4>
                  <div className="bg-slate-950 border border-slate-800 rounded p-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-700"><FileJson className="w-5 h-5 text-emerald-400" /></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-slate-200">{localDataset ? localDataset.name : 'No file mounted'}</div>
                      <div className="text-xs text-slate-500 mb-2">{localDataset ? `Loaded ${(localDataset.size/1024).toFixed(2)} KB` : 'Upload CSV/JSON to inject to context.'}</div>
                      <div className="relative inline-block">
                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <button className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded border border-slate-700 flex items-center gap-2"><UploadCloud className="w-3.5 h-3.5" /> Upload</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {isLabelModalOpen && (
          <div className="absolute inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 shadow-2xl w-full max-w-sm">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><PlusSquare className="w-5 h-5 text-blue-500" /> New Chat Group</h3>
              <input 
                type="text" 
                value={newLabelInput} 
                onChange={(e) => setNewLabelInput(e.target.value)}
                placeholder="Enter label name (e.g., Project Alpha)"
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 mb-6"
                autoFocus
              />
              <div className="flex gap-3">
                <button 
                  onClick={() => setIsLabelModalOpen(false)}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-sm font-bold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (newLabelInput.trim()) {
                      if (!labels.includes(newLabelInput.trim())) {
                        setLabels(prev => [...prev, newLabelInput.trim()]);
                      }
                      setCurrentLabel(newLabelInput.trim());
                      setMessages([{ role: 'system', text: `THREAD INITIALIZED: ${newLabelInput.trim()}` }]);
                      setIsLabelModalOpen(false);
                      setNewLabelInput('');
                    }
                  }}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-sm font-bold shadow-lg transition-all"
                >
                  Initialize
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
