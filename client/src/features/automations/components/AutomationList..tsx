"use client";

import React from "react";
import { Plus, Edit, Play, Trash2 } from "lucide-react";
import { Automation } from "../types";
import { Button } from "../../../components/Button";
import { Badge } from "../../../components/Badge";
import { EmptyState } from "../../../components/EmptyState";
import { LoadingSpinner } from "../../../components/LoadingSpinner";

interface AutomationListProps {
  automations: Automation[];
  loading: boolean;
  onCreateNew: () => void;
  onEdit: (automation: Automation) => void;
  onDelete: (id: string) => void;
  onTest: (id: string) => void;
}

export const AutomationList: React.FC<AutomationListProps> = ({
  automations,
  loading,
  onCreateNew,
  onEdit,
  onDelete,
  onTest,
}) => {
  const getStatusVariant = (status?: string) => {
    switch (status) {
      case "active":
        return "success";
      case "paused":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Automation Flows</h1>
          <Button
            icon={Plus}
            onClick={onCreateNew}
            disabled={loading}
            size="lg"
          >
            Create New Automation
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner text="Loading automations..." />
            </div>
          ) : automations.length === 0 ? (
            <EmptyState
              title="No automations yet"
              description="Create your first automation to get started"
              action={{
                label: "Create Automation",
                onClick: onCreateNew,
              }}
            />
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Updated
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {automations.map((automation) => (
                  <tr key={automation._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {automation.name}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge variant={getStatusVariant(automation.status)}>
                        {automation.status?.toUpperCase() || "DRAFT"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {automation.createdAt
                        ? new Date(automation.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {automation.updatedAt
                        ? new Date(automation.updatedAt).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Edit}
                          onClick={() => onEdit(automation)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          icon={Play}
                          onClick={() => onTest(automation._id!)}
                        >
                          Test
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onDelete(automation._id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
