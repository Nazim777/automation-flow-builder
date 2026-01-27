import { useState, useCallback } from "react";
import { Node, Edge } from "../types";

interface UseFlowEditorOptions {
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export const useFlowEditor = (options: UseFlowEditorOptions = {}) => {
  const [nodes, setNodes] = useState<Node[]>(options.initialNodes || []);
  const [edges, setEdges] = useState<Edge[]>(options.initialEdges || []);

  const initializeFlow = useCallback(() => {
    const startNode: Node = {
      id: "start",
      type: "start",
      position: { x: 250, y: 50 },
      data: {},
    };
    const endNode: Node = {
      id: "end",
      type: "end",
      position: { x: 250, y: 400 },
      data: {},
    };
    const edge: Edge = {
      id: "start-end",
      source: "start",
      target: "end",
    };

    setNodes([startNode, endNode]);
    setEdges([edge]);
  }, []);

  const addNode = useCallback((type: "action" | "delay" | "condition") => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: 250, y: 200 },
      data: {
        ...(type === "action" ? { message: "" } : {}),
        ...(type === "delay"
          ? {
              delayType: "relative" as const,
              duration: 1,
              unit: "minutes" as const,
            }
          : {}),
        ...(type === "condition"
          ? {
              rules: [
                {
                  field: "email" as const,
                  operator: "equals" as const,
                  value: "",
                },
              ],
            }
          : {}),
      },
    };
    setNodes((prev) => [...prev, newNode]);
  }, []);

  const updateNode = useCallback(
    (nodeId: string, field: string, value: any) => {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeId
            ? field === "position"
              ? { ...node, position: value }
              : { ...node, data: { ...node.data, [field]: value } }
            : node,
        ),
      );
    },
    [],
  );

  const deleteNode = useCallback((nodeId: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) =>
      prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
    );
  }, []);

  const addEdge = useCallback(
    (connection: {
      source: string;
      target: string;
      sourceHandle?: string;
      targetHandle?: string;
    }) => {
      const edgeId = `${connection.source}-${connection.target}-${Date.now()}`;
      setEdges((prev) => [...prev, { ...connection, id: edgeId }]);
    },
    [],
  );

  const loadFlow = useCallback((flowNodes: Node[], flowEdges: Edge[]) => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, []);

  const clearFlow = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, []);

  return {
    nodes,
    edges,
    initializeFlow,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    loadFlow,
    clearFlow,
  };
};
