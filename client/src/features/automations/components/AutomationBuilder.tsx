"use client";

import { useState } from "react";
import { AutomationList } from "./AutomationList.";
import { FlowEditor } from "./FlowEditor";
import { TestDialog } from "./TestDialog";
import { useAutomations } from "../hooks/useAutomations";
import { useFlowEditor } from "../hooks/useFlowEditor";
import { Automation } from "../types";
import { validateAutomationName, validateFlow } from "../utils/validation";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

const socket = io(socketURL);

export default function AutomationFlowBuilder() {
  const [view, setView] = useState<"list" | "editor">("list");
  const [currentAutomation, setCurrentAutomation] = useState<Automation | null>(
    null,
  );
  const [automationName, setAutomationName] = useState("");
  const [showTestDialog, setShowTestDialog] = useState(false);
  const [testAutomationId, setTestAutomationId] = useState<string | null>(null);

  const {
    automations,
    loading,
    error,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    testAutomation,
  } = useAutomations();

  const {
    nodes,
    edges,
    initializeFlow,
    addNode,
    updateNode,
    deleteNode,
    addEdge,
    loadFlow,
  } = useFlowEditor();

  const handleCreateNew = () => {
    setCurrentAutomation(null);
    setAutomationName("");
    initializeFlow();
    setView("editor");
  };

  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);

  const [isReadOnly, setIsReadOnly] = useState(false);

  const handleEdit = (automation: Automation) => {
    setCurrentAutomation(automation);
    setAutomationName(automation.name);
    loadFlow(automation.nodes, automation.edges);
    setView("editor");
  };

  const handleSave = async () => {
    const nameResult = validateAutomationName(automationName);
    if (!nameResult.valid) {
      toast.error(nameResult.error!);
      return;
    }

    const flowResult = validateFlow(nodes, edges);
    if (!flowResult.valid) {
      toast.error(flowResult.error!);
      return;
    }

    try {
      if (currentAutomation?._id) {
        await updateAutomation(currentAutomation._id, {
          name: automationName,
          nodes,
          edges,
        });
        toast.success("Automation updated successfully!");
      } else {
        await createAutomation({
          name: automationName,
          nodes,
          edges,
        });
        toast.success("Automation created successfully!");
      }

      setView("list");
      setCurrentAutomation(null);
      setAutomationName("");
    } catch (err: any) {
      toast.error(`Failed to save automation: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;

    try {
      await deleteAutomation(id);
    } catch (err: any) {
      toast.error(`Failed to delete automation: ${err.message}`);
    }
  };

  const handleTest = (id: string) => {
    const automation = automations.find((a) => a._id === id);
    if (automation) {
      setCurrentAutomation(automation);
      setAutomationName(automation.name);
      loadFlow(automation.nodes, automation.edges);
      setTestAutomationId(id);
      setIsReadOnly(true); // Enable Read Only mode
      setView("editor");
    }
  };

  const handleTestSubmit = async (email: string) => {
    if (!testAutomationId) return;

    try {
      const result = await testAutomation(testAutomationId, email);
      alert(
        `${result.message}\n\nTest Run ID: ${result.testRunId}\n\nThe automation will execute in the background and send emails to ${email}`,
      );

      const toastId = toast.loading("Initializing test...");

      socket.on(`test-status-update:${result.testRunId}`, (data: any) => {
        const currentStatus = data?.status.toLowerCase();

        // Update the active node for the canvas glow
        if (data.currentNodeId) {
          setActiveNodeId(data.currentNodeId);
        }

        if (currentStatus === "running") {
          // Updates the same toast instead of making a new one
          toast.loading(data.message, {
            id: toastId,
            style: {
              backgroundColor: "#3b82f6",
              color: "#fff",
              fontWeight: "bold",
            },
          });
        } else if (currentStatus === "completed") {
          toast.success(data.message, { id: toastId });
          setActiveNodeId(null); // Clear highlight when done
          socket.off(`test-status-update:${result.testRunId}`);
        } else if (currentStatus === "failed") {
          toast.error(data.message, { id: toastId });
          setActiveNodeId(null);
          socket.off(`test-status-update:${result.testRunId}`);
        }
      });
      setShowTestDialog(false);
      // setTestAutomationId(null);
    } catch (err: any) {
      toast.error(`Failed to start test: ${err.message}`);
    }
  };

  const handleBack = () => {
    setView("list");
    setCurrentAutomation(null);
    setAutomationName("");
    setIsReadOnly(false); // Reset mode
    setActiveNodeId(null);
    setTestAutomationId(null); // reset the id
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {view === "list" ? (
        <AutomationList
          automations={automations}
          loading={loading}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTest={handleTest}
        />
      ) : (
        <FlowEditor
          automationName={automationName}
          nodes={nodes}
          edges={edges}
          loading={loading}
          onNameChange={setAutomationName}
          onAddNode={addNode}
          onUpdateNode={updateNode}
          onDeleteNode={deleteNode}
          onConnect={addEdge}
          onSave={handleSave}
          onBack={handleBack}
          activeNodeId={activeNodeId!}
          // New:
          isReadOnly={isReadOnly}
          onRunTest={() => setShowTestDialog(true)}
        />
      )}

      {showTestDialog && (
        <TestDialog
          isOpen={showTestDialog}
          loading={loading}
          onClose={() => {
            setShowTestDialog(false);
            setTestAutomationId(null);
          }}
          onSubmit={handleTestSubmit}
        />
      )}
    </div>
  );
}
