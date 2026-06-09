"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader, Save, Trash2, Plus, Workflow, Mail, MessageSquare,
  Bell, Tag, UserPlus, Clock, GitBranch, Split, Shuffle,
  MousePointerClick, Webhook, ToggleLeft, ToggleRight, AlertTriangle,
  GripVertical, X, Zap,
} from "lucide-react";
import type {
  Funnel, FunnelNode, FunnelEdge, FunnelSteps,
  TriggerType, ActionType, LogicType, NodeType,
  TriggerConfig, ActionNodeConfig, LogicNodeConfig,
} from "@/lib/atlas/funnels/types";
import {
  TRIGGER_LABELS, TRIGGER_DESCRIPTIONS,
  ACTION_LABELS, ACTION_DESCRIPTIONS,
  LOGIC_LABELS, LOGIC_DESCRIPTIONS,
  NODE_COLORS, TIER_OPTIONS,
} from "@/lib/atlas/funnels/types";

/* ─── Constants ─── */
const NODE_W = 200;
const NODE_H = 80;
const NODE_GAP_Y = 40;
const PORT_SIZE = 10;
const CANVAS_PADDING = 60;
const INITIAL_POS_OFFSET = 40;

/* ─── Helpers ─── */
function nodeCenterBottom(n: FunnelNode) {
  return { x: n.position.x + NODE_W / 2, y: n.position.y + NODE_H };
}
function nodeCenterTop(n: FunnelNode) {
  return { x: n.position.x + NODE_W / 2, y: n.position.y };
}
function svgPath(x1: number, y1: number, x2: number, y2: number) {
  const cy = (y1 + y2) / 2;
  return `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;
}

const TRIGGER_ICONS: Record<TriggerType, any> = {
  tier_change: UserPlus, tag_added: Tag, tag_removed: Tag,
  purchase_made: MousePointerClick, new_fan: UserPlus,
  time_based: Clock, inactivity: Clock,
  form_submitted: Shuffle, webhook_received: Webhook,
};
const ACTION_ICONS: Record<ActionType, any> = {
  send_email: Mail, send_sms: MessageSquare, send_push: Bell,
  add_tag: Tag, remove_tag: Tag, update_field: Workflow,
  change_tier: UserPlus, notify_creator: Bell,
  wait: Clock, webhook_call: Webhook,
};
const LOGIC_ICONS: Record<LogicType, any> = {
  if_else: GitBranch, split_test: Split, random: Shuffle, wait_until: Clock,
};

function getNodeIcon(node: FunnelNode) {
  if (node.type === "trigger" && node.trigger_type) return TRIGGER_ICONS[node.trigger_type] || Zap;
  if (node.type === "action" && node.action_type) return ACTION_ICONS[node.action_type] || Zap;
  if (node.type === "logic" && node.logic_type) return LOGIC_ICONS[node.logic_type] || GitBranch;
  return Zap;
}

/* ─── Palette entries ─── */
interface PaletteEntry { type: NodeType; subType: string; label: string; description: string; }
const PALETTE_TRIGGERS: PaletteEntry[] = [
  { type: "trigger", subType: "new_fan", label: "Nouveau fan", description: "Se déclenche quand un nouveau fan est capté" },
  { type: "trigger", subType: "tier_change", label: "Changement tier", description: "Quand le tier d'un fan change" },
  { type: "trigger", subType: "tag_added", label: "Tag ajouté", description: "Quand un tag est ajouté" },
  { type: "trigger", subType: "purchase_made", label: "Achat", description: "Quand un achat est effectué" },
  { type: "trigger", subType: "inactivity", label: "Inactivité", description: "Fan inactif depuis X jours" },
  { type: "trigger", subType: "time_based", label: "Date/répétition", description: "Anniversaire, date fixe, etc." },
  { type: "trigger", subType: "webhook_received", label: "Webhook", description: "Webhook externe reçu" },
];
const PALETTE_ACTIONS: PaletteEntry[] = [
  { type: "action", subType: "send_email", label: "Email", description: "Envoie un email" },
  { type: "action", subType: "send_sms", label: "SMS", description: "Envoie un SMS" },
  { type: "action", subType: "send_push", label: "Push", description: "Notification push" },
  { type: "action", subType: "add_tag", label: "Ajouter tag", description: "Ajoute un tag au fan" },
  { type: "action", subType: "remove_tag", label: "Retirer tag", description: "Retire un tag du fan" },
  { type: "action", subType: "change_tier", label: "Changer tier", description: "Change le tier du fan" },
  { type: "action", subType: "update_field", label: "Modifier champ", description: "Met à jour un champ personnalisé" },
  { type: "action", subType: "notify_creator", label: "Notifier", description: "Notifie le créateur" },
  { type: "action", subType: "wait", label: "Attendre", description: "Pause la séquence" },
  { type: "action", subType: "webhook_call", label: "Webhook", description: "Appelle un webhook externe" },
];
const PALETTE_LOGIC: PaletteEntry[] = [
  { type: "logic", subType: "if_else", label: "Si/Sinon", description: "Branche conditionnelle" },
  { type: "logic", subType: "split_test", label: "Test A/B", description: "Sépare en deux branches" },
  { type: "logic", subType: "random", label: "Aléatoire", description: "Aiguillage aléatoire" },
  { type: "logic", subType: "wait_until", label: "Attendre condition", description: "Attend qu'une condition soit remplie" },
];

/* ─── Status styles ─── */
const STATUS_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  active:    { label: "Actif",     color: "#10B981", bg: "rgba(16,185,129,0.1)" },
  paused:    { label: "En pause",  color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  draft:     { label: "Brouillon", color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.05)" },
  completed: { label: "Terminé",   color: "#5B8FA8", bg: "rgba(91,143,168,0.1)" },
};

/* ═══════════════════════════════════════════════════════════
   PAGE — Funnel Editor
   ═══════════════════════════════════════════════════════════ */
export default function FunnelEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [id, setId] = useState<string | null>(null);

  useEffect(() => { params.then((p) => setId(p.id)); }, [params]);

  if (!id) return null;
  return <FunnelEditor funnelId={id} router={router} />;
}

function FunnelEditor({ funnelId, router }: { funnelId: string; router: ReturnType<typeof useRouter> }) {
  /* ─── State ─── */
  const [funnel, setFunnel] = useState<Funnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nodes, setNodes] = useState<FunnelNode[]>([]);
  const [edges, setEdges] = useState<FunnelEdge[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [dragging, setDragging] = useState<{
    nodeId: string; startX: number; startY: number; origX: number; origY: number;
  } | null>(null);
  const [connecting, setConnecting] = useState<{ sourceId: string } | null>(null);
  const [hoveredPort, setHoveredPort] = useState<string | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const [configOpen, setConfigOpen] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  const canvasRef = useRef<HTMLDivElement>(null);
  const nodeIdCounter = useRef(100);
  const edgeIdCounter = useRef(100);

  /* ─── Load ─── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/dashboard/atlas/funnels/${funnelId}`);
        if (!res.ok) { setError("Funnel introuvable"); setLoading(false); return; }
        const d = await res.json();
        const f: Funnel = d.funnel;
        setFunnel(f);
        const steps = f.steps || { nodes: [], edges: [] };
        setNodes(steps.nodes || []);
        setEdges(steps.edges || []);
        setNameInput(f.name);
      } catch { setError("Erreur de chargement"); }
      finally { setLoading(false); }
    })();
  }, [funnelId]);

  /* ─── Save ─── */
  async function handleSave() {
    setSaving(true);
    setSaveMsg(null);
    try {
      const body: Record<string, any> = { steps: { nodes, edges } };
      if (editingName && nameInput.trim()) body.name = nameInput.trim();

      const res = await fetch(`/api/dashboard/atlas/funnels/${funnelId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { setSaveMsg({ type: "error", text: "Erreur de sauvegarde" }); return; }
      const d = await res.json();
      if (d.funnel) setFunnel(d.funnel);
      setSaveMsg({ type: "success", text: "Sauvegardé" });
      setTimeout(() => setSaveMsg(null), 2500);
    } catch { setSaveMsg({ type: "error", text: "Erreur réseau" }); }
    finally { setSaving(false); }
  }

  /* ─── Status toggle ─── */
  async function handleToggleStatus() {
    if (!funnel) return;
    const newStatus = funnel.status === "active" ? "paused" : funnel.status === "draft" ? "active" : "active";
    try {
      const res = await fetch(`/api/dashboard/atlas/funnels/${funnelId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) setFunnel((prev) => prev ? { ...prev, status: newStatus as Funnel["status"] } : prev);
    } catch {}
  }

  /* ─── Node management ─── */
  function addNode(entry: PaletteEntry) {
    const col = nodes.length % 3;
    const row = Math.floor(nodes.length / 3);
    const newNode: FunnelNode = {
      id: `n${++nodeIdCounter.current}`,
      type: entry.type,
      label: entry.label,
      position: {
        x: CANVAS_PADDING + col * (NODE_W + 40),
        y: CANVAS_PADDING + row * (NODE_H + NODE_GAP_Y),
      },
      config: getDefaultConfig(entry),
    };
    if (entry.type === "trigger") newNode.trigger_type = entry.subType as TriggerType;
    if (entry.type === "action") newNode.action_type = entry.subType as ActionType;
    if (entry.type === "logic") newNode.logic_type = entry.subType as LogicType;
    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newNode.id);
    setSelectedEdgeId(null);
    setConfigOpen(true);
  }

  function getDefaultConfig(entry: PaletteEntry): any {
    if (entry.type === "trigger") return { trigger_type: entry.subType };
    if (entry.type === "action") {
      const base: any = { action_type: entry.subType };
      if (entry.subType === "wait") { base.wait_days = 1; base.wait_hours = 0; }
      if (entry.subType === "send_email") { base.subject = ""; base.content = ""; }
      if (entry.subType === "send_sms") { base.content = ""; }
      if (entry.subType === "change_tier") { base.target_tier = "engaged"; }
      if (entry.subType === "add_tag" || entry.subType === "remove_tag") { base.tag = ""; }
      return base;
    }
    if (entry.type === "logic") {
      const base: any = { logic_type: entry.subType };
      if (entry.subType === "if_else") { base.field = ""; base.operator = "eq"; base.compare_value = ""; }
      if (entry.subType === "split_test") { base.split_a_percent = 50; }
      return base;
    }
    return {};
  }

  function deleteSelected() {
    if (selectedNodeId) {
      setNodes((prev) => prev.filter((n) => n.id !== selectedNodeId));
      setEdges((prev) => prev.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges((prev) => prev.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
  }

  /* ─── Drag within canvas ─── */
  function handleNodeMouseDown(e: React.MouseEvent, nodeId: string) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;
    setDragging({
      nodeId,
      startX: e.clientX,
      startY: e.clientY,
      origX: node.position.x,
      origY: node.position.y,
    });
  }

  const dragRef = useRef(dragging);
  dragRef.current = dragging;

  useEffect(() => {
    if (!dragging) return;
    function onMove(e: MouseEvent) {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      setNodes((prev) => prev.map((n) =>
        n.id === d.nodeId
          ? { ...n, position: { x: Math.max(0, d.origX + dx), y: Math.max(0, d.origY + dy) } }
          : n
      ));
    }
    function onUp() { setDragging(null); }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  /* ─── Connection creation ─── */
  function handlePortClick(e: React.MouseEvent, nodeId: string, portType: "output" | "input") {
    e.stopPropagation();
    if (portType === "output") {
      setConnecting(connecting?.sourceId === nodeId ? null : { sourceId: nodeId });
    } else if (connecting) {
      if (connecting.sourceId !== nodeId) {
        const exists = edges.some((ed) => ed.source === connecting.sourceId && ed.target === nodeId);
        if (!exists) {
          const newEdge: FunnelEdge = {
            id: `e${++edgeIdCounter.current}`,
            source: connecting.sourceId,
            target: nodeId,
          };
          setEdges((prev) => [...prev, newEdge]);
        }
      }
      setConnecting(null);
    }
  }

  /* ─── Select node / deselect ─── */
  function handleCanvasClick(e: React.MouseEvent) {
    if (e.target === canvasRef.current || (e.target as HTMLElement).classList.contains("canvas-bg")) {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setConnecting(null);
    }
  }

  /* ─── Edge click ─── */
  function handleEdgeClick(e: React.MouseEvent, edgeId: string) {
    e.stopPropagation();
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
  }

  /* ─── Update config ─── */
  function updateNodeConfig(nodeId: string, patch: Partial<any>) {
    setNodes((prev) => prev.map((n) =>
      n.id === nodeId ? { ...n, config: { ...n.config, ...patch } } : n
    ));
  }
  function updateNodeLabel(nodeId: string, label: string) {
    setNodes((prev) => prev.map((n) => n.id === nodeId ? { ...n, label } : n));
  }

  /* ─── Keyboard shortcuts ─── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "Delete" || e.key === "Backspace") { deleteSelected(); }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); handleSave(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNodeId, selectedEdgeId, nodes, edges]);

  /* ─── Render helpers ─── */
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  /* ─── Loading / Error ─── */
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <Loader size={16} className="animate-spin" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    );
  }

  if (error || !funnel) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center gap-3">
        <AlertTriangle size={28} style={{ color: "rgba(255,255,255,0.1)" }} />
        <p style={{ color: "rgba(255,255,255,0.3)" }}>{error || "Funnel introuvable"}</p>
        <Link href="/dashboard/atlas/funnels" className="text-xs px-3 py-1.5 rounded-sm" style={{ background: "rgba(199,91,57,0.1)", color: "#C75B39" }}>
          Retour aux funnels
        </Link>
      </div>
    );
  }

  const st = STATUS_STYLES[funnel.status] || STATUS_STYLES.draft;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in">
      {/* ═══ Top bar ═══ */}
      <div className="flex items-center justify-between px-4 py-2 shrink-0 border-b" style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#1A1614" }}>
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard/atlas/funnels" className="p-1 transition-opacity hover:opacity-70 shrink-0">
            <ArrowLeft size={16} style={{ color: "var(--color-ink-tertiary)" }} />
          </Link>

          {editingName ? (
            <input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => { if (e.key === "Enter") setEditingName(false); }}
              className="bg-transparent text-sm font-medium outline-none px-1 py-0.5 rounded-sm"
              style={{ color: "#F5F0EB", border: "1px solid rgba(199,91,57,0.3)" }}
            />
          ) : (
            <button onClick={() => setEditingName(true)} className="hover:opacity-70 transition-opacity text-left">
              <h1 className="text-sm font-medium truncate max-w-[300px]" style={{ color: "#F5F0EB" }}>{funnel.name}</h1>
            </button>
          )}

          <span className="text-[9px] px-1.5 py-0.5 rounded-sm font-medium" style={{ background: st.bg, color: st.color }}>
            {st.label}
          </span>

          {funnel.description && (
            <span className="text-[10px] hidden md:block truncate max-w-[200px]" style={{ color: "var(--color-ink-tertiary)" }}>
              {funnel.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className="flex items-center gap-1 px-2 py-1 text-[10px] rounded-sm transition-colors hover:bg-white/5"
            style={{ border: "1px solid rgba(245,240,235,0.08)", color: funnel.status === "active" ? "#F59E0B" : "#10B981" }}
          >
            {funnel.status === "active" ? <ToggleLeft size={12} /> : <ToggleRight size={12} />}
            {funnel.status === "active" ? "Pause" : "Activer"}
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-medium rounded-sm transition-opacity hover:opacity-80 disabled:opacity-30"
            style={{ background: "#C75B39", color: "#FFFFFF" }}
          >
            {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>

          {saveMsg && (
            <span className="text-[10px] flex items-center gap-1" style={{ color: saveMsg.type === "success" ? "#10B981" : "#C44536" }}>
              {saveMsg.text}
            </span>
          )}
        </div>
      </div>

      {/* ═══ Body ═══ */}
      <div className="flex flex-1 min-h-0">
        {/* ─── Left palette ─── */}
        <div
          className="w-52 shrink-0 overflow-y-auto border-r custom-scrollbar transition-all"
          style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#1A1614" }}
        >
          <div className="p-3 space-y-4">
            {/* Triggers */}
            <div>
              <h3 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "var(--color-ink-tertiary)" }}>Déclencheurs</h3>
              <div className="space-y-1">
                {PALETTE_TRIGGERS.map((entry) => (
                  <PaletteItem key={entry.subType} entry={entry} onClick={() => addNode(entry)} />
                ))}
              </div>
            </div>
            {/* Actions */}
            <div>
              <h3 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "var(--color-ink-tertiary)" }}>Actions</h3>
              <div className="space-y-1">
                {PALETTE_ACTIONS.map((entry) => (
                  <PaletteItem key={entry.subType} entry={entry} onClick={() => addNode(entry)} />
                ))}
              </div>
            </div>
            {/* Logic */}
            <div>
              <h3 className="text-[9px] uppercase tracking-wider mb-2" style={{ color: "var(--color-ink-tertiary)" }}>Logique</h3>
              <div className="space-y-1">
                {PALETTE_LOGIC.map((entry) => (
                  <PaletteItem key={entry.subType} entry={entry} onClick={() => addNode(entry)} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── Canvas ─── */}
        <div
          ref={canvasRef}
          className="flex-1 relative overflow-auto custom-scrollbar canvas-bg"
          style={{ backgroundColor: "#1A1614", backgroundImage: "radial-gradient(rgba(245,240,235,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          onClick={handleCanvasClick}
        >
          {/* Empty drop zone hint */}
          {nodes.length === 0 && !connecting && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <Workflow size={40} style={{ color: "rgba(255,255,255,0.04)" }} />
                <p className="text-xs mt-3" style={{ color: "rgba(255,255,255,0.1)" }}>Clique sur un élément de la palette pour commencer</p>
              </div>
            </div>
          )}

          {/* SVG connections */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%", zIndex: 1 }}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="rgba(245,240,235,0.2)" />
              </marker>
              <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#C75B39" />
              </marker>
            </defs>
            {edges.map((edge) => {
              const src = nodes.find((n) => n.id === edge.source);
              const tgt = nodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;
              const from = nodeCenterBottom(src);
              const to = nodeCenterTop(tgt);
              const isSelected = selectedEdgeId === edge.id;
              return (
                <g key={edge.id} onClick={(e) => handleEdgeClick(e, edge.id)} className="cursor-pointer">
                  <path
                    d={svgPath(from.x, from.y, to.x, to.y)}
                    fill="none"
                    stroke={isSelected ? "#C75B39" : "rgba(245,240,235,0.15)"}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    markerEnd={isSelected ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                    style={{ transition: "stroke 0.15s" }}
                  />
                  <path
                    d={svgPath(from.x, from.y, to.x, to.y)}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={12}
                  />
                </g>
              );
            })}
            {/* Preview connection line when connecting */}
            {connecting && (() => {
              const src = nodes.find((n) => n.id === connecting.sourceId);
              if (!src) return null;
              const from = nodeCenterBottom(src);
              const to = hoveredPort ? (() => {
                const tgt = nodes.find((n) => n.id === hoveredPort);
                return tgt ? nodeCenterTop(tgt) : from;
              })() : { x: from.x + 50, y: from.y + 100 };
              return (
                <path
                  d={svgPath(from.x, from.y, to.x, to.y)}
                  fill="none"
                  stroke="rgba(199,91,57,0.5)"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  markerEnd="url(#arrowhead)"
                />
              );
            })()}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = NODE_COLORS[node.type];
            const isSelected = selectedNodeId === node.id;
            const icon = getNodeIcon(node);
            const Icon = icon;
            return (
              <div
                key={node.id}
                className="absolute rounded-sm cursor-pointer select-none"
                style={{
                  left: node.position.x,
                  top: node.position.y,
                  width: NODE_W,
                  zIndex: isSelected || dragging?.nodeId === node.id ? 20 : 10,
                  border: `1.5px solid ${isSelected ? "#C75B39" : colors.border}`,
                  backgroundColor: colors.bg,
                  boxShadow: isSelected ? "0 0 0 2px rgba(199,91,57,0.15)" : "none",
                  transition: dragging?.nodeId === node.id ? "none" : "box-shadow 0.15s",
                }}
                onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); setSelectedEdgeId(null); setConfigOpen(true); }}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
              >
                {/* Input port */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-10 transition-all ${connecting ? "cursor-pointer hover:scale-150" : ""}`}
                  style={{
                    top: 0, width: PORT_SIZE, height: PORT_SIZE,
                    backgroundColor: connecting && connecting.sourceId !== node.id ? "rgba(199,91,57,0.6)" : "rgba(245,240,235,0.1)",
                    border: `2px solid ${connecting && connecting.sourceId !== node.id ? "#C75B39" : "rgba(245,240,235,0.2)"}`,
                  }}
                  onMouseEnter={() => setHoveredPort(node.id)}
                  onMouseLeave={() => setHoveredPort(null)}
                  onClick={(e) => handlePortClick(e, node.id, "input")}
                />

                {/* Body */}
                <div className="flex items-center gap-2 px-3 py-2" style={{ minHeight: NODE_H - 4 }}>
                  <div className="flex items-center justify-center w-7 h-7 rounded-sm shrink-0" style={{ background: colors.bg }}>
                    <Icon size={13} style={{ color: colors.text }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-medium block leading-tight truncate" style={{ color: "#F5F0EB" }}>
                      {node.label}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider" style={{ color: colors.text }}>
                      {node.type === "trigger" ? "DÉCLENCHEUR" : node.type === "action" ? "ACTION" : "LOGIGUE"}
                    </span>
                  </div>
                  {isSelected && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
                      className="p-0.5 rounded-sm hover:bg-white/10"
                    >
                      <GripVertical size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </button>
                  )}
                </div>

                {/* Output port */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full z-10 transition-all ${connecting?.sourceId === node.id ? "bg-[#C75B39] scale-125" : ""} ${!connecting ? "cursor-crosshair hover:scale-125" : "cursor-pointer"}`}
                  style={{
                    bottom: 0, width: PORT_SIZE, height: PORT_SIZE,
                    backgroundColor: connecting?.sourceId === node.id ? "#C75B39" : "rgba(245,240,235,0.15)",
                    border: `2px solid ${connecting?.sourceId === node.id ? "#C75B39" : "rgba(245,240,235,0.3)"}`,
                  }}
                  onMouseEnter={() => setHoveredPort(node.id)}
                  onMouseLeave={() => setHoveredPort(null)}
                  onClick={(e) => handlePortClick(e, node.id, "output")}
                />
              </div>
            );
          })}
        </div>

        {/* ─── Config panel ─── */}
        {configOpen && selectedNode && (
          <div
            className="w-72 shrink-0 overflow-y-auto border-l custom-scrollbar"
            style={{ borderColor: "rgba(245,240,235,0.06)", backgroundColor: "#1A1614" }}
          >
            <NodeConfigPanel
              node={selectedNode}
              onUpdateConfig={(patch) => updateNodeConfig(selectedNode.id, patch)}
              onUpdateLabel={(label) => updateNodeLabel(selectedNode.id, label)}
              onDelete={() => deleteSelected()}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Palette Item
   ═══════════════════════════════════════════════════════════ */
function PaletteItem({ entry, onClick }: { entry: PaletteEntry; onClick: () => void }) {
  const colors = NODE_COLORS[entry.type];
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-sm text-left transition-colors hover:bg-white/5"
      style={{ border: "1px solid transparent" }}
    >
      <div className="flex items-center justify-center w-6 h-6 rounded-sm shrink-0" style={{ background: colors.bg }}>
        <Plus size={10} style={{ color: colors.text }} />
      </div>
      <div className="min-w-0">
        <span className="text-[10px] font-medium block leading-tight truncate" style={{ color: "#F5F0EB" }}>{entry.label}</span>
        <span className="text-[8px]" style={{ color: "var(--color-ink-tertiary)" }}>{entry.type === "trigger" ? "DÉCLENCHEUR" : entry.type === "action" ? "ACTION" : "LOGIGUE"}</span>
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   Node Config Panel
   ═══════════════════════════════════════════════════════════ */
function NodeConfigPanel({
  node, onUpdateConfig, onUpdateLabel, onDelete,
}: {
  node: FunnelNode;
  onUpdateConfig: (patch: any) => void;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
}) {
  const colors = NODE_COLORS[node.type];
  const icon = getNodeIcon(node);
  const Icon = icon;
  const cfg = node.config as any;

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-sm" style={{ background: colors.bg }}>
            <Icon size={13} style={{ color: colors.text }} />
          </div>
          <div>
            <span className="text-[10px] font-medium block" style={{ color: "#F5F0EB" }}>{node.label}</span>
            <span className="text-[8px] uppercase" style={{ color: colors.text }}>
              {node.type === "trigger" ? "DÉCLENCHEUR" : node.type === "action" ? "ACTION" : "LOGIGUE"}
            </span>
          </div>
        </div>
        <button onClick={onDelete} className="p-1 rounded-sm hover:bg-white/5" style={{ color: "#C44536" }}>
          <Trash2 size={12} />
        </button>
      </div>

      {/* Label */}
      <div>
        <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-ink-tertiary)" }}>Étiquette</label>
        <input
          value={node.label}
          onChange={(e) => onUpdateLabel(e.target.value)}
          className="w-full px-2 py-1 text-[10px] bg-transparent rounded-sm outline-none"
          style={{ border: "1px solid rgba(245,240,235,0.08)", color: "#F5F0EB" }}
        />
      </div>

      {/* ── Trigger config ── */}
      {node.type === "trigger" && (
        <>
          {node.trigger_type === "tier_change" && (
            <SelectField label="Tier cible" value={cfg.value || ""} onChange={(v) => onUpdateConfig({ value: v })} options={TIER_OPTIONS} />
          )}
          {node.trigger_type === "tag_added" && (
            <TextField label="Nom du tag" value={cfg.value || ""} onChange={(v) => onUpdateConfig({ value: v })} placeholder="ex: vip, whale" />
          )}
          {node.trigger_type === "purchase_made" && (
            <SelectField label="Type d'achat" value={cfg.value || "any"} onChange={(v) => onUpdateConfig({ value: v })} options={[{ value: "any", label: "Tout achat" }, { value: "ppv", label: "PPV" }, { value: "subscription", label: "Abonnement" }, { value: "tip", label: "Tip" }]} />
          )}
          {node.trigger_type === "inactivity" && (
            <NumberField label="Jours d'inactivité" value={cfg.days_threshold || 30} onChange={(v) => onUpdateConfig({ days_threshold: v })} min={1} max={365} />
          )}
          {node.trigger_type === "time_based" && (
            <SelectField label="Événement" value={cfg.time_event || "birthday"} onChange={(v) => onUpdateConfig({ time_event: v })} options={[{ value: "birthday", label: "Anniversaire" }, { value: "anniversary", label: "Date anniversaire abonnement" }, { value: "custom", label: "Date personnalisée" }]} />
          )}
        </>
      )}

      {/* ── Action config ── */}
      {node.type === "action" && (
        <>
          {node.action_type === "send_email" && (
            <>
              <TextField label="Objet" value={cfg.subject || ""} onChange={(v) => onUpdateConfig({ subject: v })} placeholder="Objet de l'email" />
              <TextAreaField label="Contenu" value={cfg.content || ""} onChange={(v) => onUpdateConfig({ content: v })} placeholder="Contenu de l'email..." />
            </>
          )}
          {node.action_type === "send_sms" && (
            <TextAreaField label="Message SMS" value={cfg.content || ""} onChange={(v) => onUpdateConfig({ content: v })} placeholder="Contenu du SMS..." />
          )}
          {node.action_type === "add_tag" && (
            <TextField label="Tag à ajouter" value={cfg.tag || ""} onChange={(v) => onUpdateConfig({ tag: v })} placeholder="ex: vip" />
          )}
          {node.action_type === "remove_tag" && (
            <TextField label="Tag à retirer" value={cfg.tag || ""} onChange={(v) => onUpdateConfig({ tag: v })} placeholder="ex: prospect" />
          )}
          {node.action_type === "change_tier" && (
            <SelectField label="Nouveau tier" value={cfg.target_tier || "engaged"} onChange={(v) => onUpdateConfig({ target_tier: v })} options={TIER_OPTIONS} />
          )}
          {node.action_type === "notify_creator" && (
            <TextField label="Message notification" value={cfg.message || ""} onChange={(v) => onUpdateConfig({ message: v })} placeholder="ex: Nouveau whale !" />
          )}
          {node.action_type === "wait" && (
            <>
              <NumberField label="Jours" value={cfg.wait_days || 1} onChange={(v) => onUpdateConfig({ wait_days: v })} min={0} max={365} />
              <NumberField label="Heures" value={cfg.wait_hours || 0} onChange={(v) => onUpdateConfig({ wait_hours: v })} min={0} max={23} />
            </>
          )}
          {node.action_type === "webhook_call" && (
            <>
              <TextField label="URL du webhook" value={cfg.webhook_url || ""} onChange={(v) => onUpdateConfig({ webhook_url: v })} placeholder="https://..." />
              <SelectField label="Méthode" value={cfg.method || "POST"} onChange={(v) => onUpdateConfig({ method: v })} options={[{ value: "POST", label: "POST" }, { value: "GET", label: "GET" }, { value: "PUT", label: "PUT" }]} />
            </>
          )}
          {node.action_type === "update_field" && (
            <>
              <TextField label="Nom du champ" value={cfg.field_name || ""} onChange={(v) => onUpdateConfig({ field_name: v })} placeholder="ex: custom_note" />
              <TextField label="Valeur" value={cfg.field_value || ""} onChange={(v) => onUpdateConfig({ field_value: v })} placeholder="Nouvelle valeur" />
            </>
          )}
        </>
      )}

      {/* ── Logic config ── */}
      {node.type === "logic" && (
        <>
          {node.logic_type === "if_else" && (
            <>
              <TextField label="Champ" value={cfg.field || ""} onChange={(v) => onUpdateConfig({ field: v })} placeholder="ex: total_spent" />
              <SelectField label="Opérateur" value={cfg.operator || "eq"} onChange={(v) => onUpdateConfig({ operator: v })} options={[
                { value: "eq", label: "=" }, { value: "neq", label: "≠" }, { value: "gt", label: ">" },
                { value: "gte", label: "≥" }, { value: "lt", label: "<" }, { value: "lte", label: "≤" },
                { value: "contains", label: "Contient" },
              ]} />
              <TextField label="Valeur" value={cfg.compare_value || ""} onChange={(v) => onUpdateConfig({ compare_value: v })} placeholder="Valeur de comparaison" />
            </>
          )}
          {node.logic_type === "split_test" && (
            <NumberField label="% branche A" value={cfg.split_a_percent || 50} onChange={(v) => onUpdateConfig({ split_a_percent: v })} min={1} max={99} suffix="%" />
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Field helpers
   ═══════════════════════════════════════════════════════════ */
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-[10px] bg-transparent rounded-sm outline-none"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "#F5F0EB" }}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full px-2 py-1 text-[10px] bg-transparent rounded-sm outline-none resize-none"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "#F5F0EB" }}
      />
    </div>
  );
}

function NumberField({ label, value, onChange, min, max, suffix }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; suffix?: string }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          min={min}
          max={max}
          className="w-full px-2 py-1 text-[10px] bg-transparent rounded-sm outline-none"
          style={{ border: "1px solid rgba(245,240,235,0.08)", color: "#F5F0EB" }}
        />
        {suffix && <span className="text-[9px]" style={{ color: "var(--color-ink-tertiary)" }}>{suffix}</span>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="text-[9px] uppercase tracking-wider block mb-1" style={{ color: "var(--color-ink-tertiary)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1 text-[10px] bg-transparent rounded-sm outline-none appearance-none cursor-pointer"
        style={{ border: "1px solid rgba(245,240,235,0.08)", color: "#F5F0EB" }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ backgroundColor: "#1A1614" }}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
