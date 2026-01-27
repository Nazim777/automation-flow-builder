import { Trash2, X } from "lucide-react";

import { Node } from "../../types";

const NodeConfigPanel = ({
  node,
  onUpdate,
  onClose,
  onDelete,
  onAddRule, 
  onUpdateRule, 
  onRemoveRule,
}: {
  node: Node;
  onUpdate: (field: string, val: any) => void;
  onClose: () => void;
  onDelete: () => void;
  onAddRule: (op: "AND" | "OR") => void;
  onUpdateRule: (index: number, updates: any) => void;
  onRemoveRule: (index: number) => void;
}) => {
  if (!node) return null;

  return (
    <div className="w-80 border-l border-gray-200 bg-white h-full overflow-y-auto absolute right-0 top-0 bottom-0 z-20 shadow-xl flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wider">
          Edit {node.type}
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 space-y-6">
        {node.type === "action" && (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Email Message
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 min-h-[150px] text-sm"
              value={node.data.message || ""}
              onChange={(e) => onUpdate("message", e.target.value)}
              placeholder="Enter the email content here..."
            />
            <p className="text-xs text-gray-500">
              This message will be sent to the user.
            </p>
          </div>
        )}

        {node.type === "delay" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Delay Type
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                value={node.data.delayType || "relative"}
                onChange={(e) => onUpdate("delayType", e.target.value)}
              >
                <option value="relative">Wait for duration</option>
                <option value="specific">Wait until date</option>
              </select>
            </div>

            {node.data.delayType === "specific" ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  value={node.data.specificDateTime || ""}
                  onChange={(e) => onUpdate("specificDateTime", e.target.value)}
                />
              </div>
            ) : (
              <div className="flex space-x-2">
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Duration
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={node.data.duration || 1}
                    onChange={(e) =>
                      onUpdate("duration", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    value={node.data.unit || "minutes"}
                    onChange={(e) => onUpdate("unit", e.target.value)}
                  >
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                    <option value="days">Days</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {node.type === "condition" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3">
              {(node?.data?.rules || []).map((rule: any, index: number) => (
                <div
                  key={index}
                  className="p-3 border rounded-md bg-gray-50 relative"
                >
                  {index > 0 && (
                    <div className="absolute -top-3 left-4 px-2 bg-purple-600 text-white text-[10px] rounded-full font-bold">
                      {rule.joinType}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <select
                      value={rule.operator}
                      className="text-xs p-1 border rounded"
                      onChange={(e) =>
                        onUpdateRule(index, { operator: e.target.value })
                      }
                    >
                      <option value="equals">equals</option>
                      <option value="not_equals">not equals</option>
                      <option value="includes">includes</option>
                      <option value="starts_with">starts with</option>
                      <option value="ends_with">ends with</option>
                    </select>
                    <input
                      type="text"
                      className="text-xs p-1 border rounded"
                      placeholder="Value..."
                      value={rule.value}
                      onChange={(e) =>
                        onUpdateRule(index, { value: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={() => onRemoveRule(index)}
                    className="text-red-500 text-[10px] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAddRule("AND")}
                className="flex-1 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded hover:bg-purple-200"
              >
                + AND
              </button>
              <button
                onClick={() => onAddRule("OR")}
                className="flex-1 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded hover:bg-purple-200"
              >
                + OR
              </button>
            </div>
          </div>
        )}

        {(node.type === "start" || node.type === "end") && (
          <div className="text-gray-500 text-sm italic text-center mt-10">
            This node cannot be configured.
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={onDelete}
          className="w-full flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={node.type === "start" || node.type === "end"}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default NodeConfigPanel;
