"use client";

import React, { useState, useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge as FlowEdge,
  Node as FlowNode,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import {
  Save,
  ArrowLeft,
  Mail,
  Clock,
  GitFork,
  PlayCircle,
} from "lucide-react";

import { Node, Edge } from "../types";

import { EndNode } from "./nodes";
import { NodeConfigPanel } from "./nodes";
import { StartNode } from "./nodes";
import { ActionNode } from "./nodes";
import { DelayNode } from "./nodes";
import { ConditionNode } from "./nodes";
// --- Props Interface ---
interface FlowEditorProps {
  automationName: string;
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  onNameChange: (name: string) => void;
  onAddNode: (type: "action" | "delay" | "condition") => void;
  onUpdateNode: (nodeId: string, field: string, value: any) => void;
  onDeleteNode: (nodeId: string) => void;
  onConnect: (connection: any) => void;
  onSave: () => void;
  onBack: () => void;
  activeNodeId: string;
  isReadOnly?: boolean;
  onRunTest: () => void; // Function to trigger the Test Dialog
}

export function FlowEditor({
  automationName,
  nodes,
  edges,
  loading,
  onNameChange,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  onConnect,
  onSave,
  onBack,
  activeNodeId,
  // new
  isReadOnly = false,
  onRunTest,
}: FlowEditorProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // --- Enhance nodes with the active state ---
  const nodesWithActiveState = useMemo(() => {
    return nodes.map((node) => ({
      ...node,
      data: {
        ...node.data,
        isActive: node.id === activeNodeId, // Inject the glow state
      },
    }));
  }, [nodes, activeNodeId]);

  // Memoize custom node types for ReactFlow
  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      end: EndNode,
      action: ActionNode,
      delay: DelayNode,
      condition: ConditionNode,
    }),
    [],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: FlowNode) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const handleDragStop = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      onUpdateNode(node.id, "position", node.position);
    },
    [onUpdateNode],
  );

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  // Inside FlowEditor.tsx
  const addRule = (logicalOperator: "AND" | "OR") => {
    if (!selectedNode) return;

    const currentRules = selectedNode.data.rules || [];
    const newRule = {
      id: crypto.randomUUID(),
      field: "email",
      operator: "equals",
      value: "",
      // Changed to joinType to match your backend evaluateCondition loop
      joinType: currentRules.length > 0 ? logicalOperator : undefined,
    };

    onUpdateNode(selectedNode.id, "rules", [...currentRules, newRule]);
  };

  const updateRule = (index: number, updates: any) => {
    if (!selectedNode) return;

    const newRules = [...(selectedNode.data.rules || [])];
    newRules[index] = { ...newRules[index], ...updates };

    onUpdateNode(selectedNode.id, "rules", newRules);
  };

  const removeRule = (index: number) => {
    if (!selectedNode) return;

    // Use 'any' or your specific ConditionRule type
    let newRules = [...(selectedNode.data.rules || [])];
    newRules.splice(index, 1);

    // If rules remain, ensure the new first rule has no joinType
    if (newRules.length > 0) {
      newRules[0] = {
        ...newRules[0],
        joinType: undefined,
      };
    }

    onUpdateNode(selectedNode.id, "rules", newRules);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-8 w-px bg-gray-300 mx-2" />
          <input
            type="text"
            disabled={isReadOnly}
            value={automationName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Name your automation..."
            className="text-lg font-semibold text-gray-800 placeholder-gray-400 border-none focus:ring-0 focus:outline-none bg-transparent w-64"
          />
        </div>

        <div className="flex items-center space-x-3">
          {!isReadOnly ? (
            <>
              <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
                <button
                  onClick={() => onAddNode("action")}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                >
                  <Mail className="w-3 h-3 mr-1.5" /> Action
                </button>
                <button
                  onClick={() => onAddNode("delay")}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                >
                  <Clock className="w-3 h-3 mr-1.5" /> Delay
                </button>
                <button
                  onClick={() => onAddNode("condition")}
                  className="flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white hover:shadow-sm rounded-md transition-all"
                >
                  <GitFork className="w-3 h-3 mr-1.5" /> Condition
                </button>
              </div>

              <button
                onClick={onSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Automation"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onRunTest}
                className="flex items-center px-6 py-2 bg-green-600 text-white text-sm font-bold rounded-md hover:bg-green-700 shadow-lg animate-bounce-subtle"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                Run Live Test
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 relative flex">
        {/* Canvas */}
        <div className="flex-1 h-full bg-gray-50">
          <ReactFlowProvider>
            <ReactFlow
              // nodes={nodes as FlowNode[]}
              nodes={nodesWithActiveState as FlowNode[]}
              edges={edges as FlowEdge[]}
              nodeTypes={nodeTypes}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onNodeDragStop={handleDragStop}
              defaultEdgeOptions={{
                type: "smoothstep",
                animated: true,
                style: { stroke: "#64748b", strokeWidth: 2 },
              }}
              minZoom={0.5}
              maxZoom={1.5}
              fitView
            >
              <Background color="#94a3b8" gap={16} size={1} />
              <Controls />
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Configuration Sidebar */}
        {!isReadOnly && selectedNode && (
          <NodeConfigPanel
            node={selectedNode}
            onUpdate={(field, value) =>
              onUpdateNode(selectedNode.id, field, value)
            }
            onDelete={() => {
              onDeleteNode(selectedNode.id);
              setSelectedNodeId(null);
            }}
            onClose={() => setSelectedNodeId(null)}
            // new
            onAddRule={addRule}
            onUpdateRule={updateRule}
            onRemoveRule={removeRule}
          />
        )}
      </div>
    </div>
  );
}
