import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Mail } from "lucide-react";

const ActionNode = ({ data, selected }: NodeProps) => (
  <div
    className={`w-64 bg-white rounded-lg shadow-md border-2 transition-all duration-500 ${
      data.isActive
        ? "border-blue-500 ring-4 ring-blue-300 animate-pulse scale-105 shadow-xl"
        : selected
        ? "border-blue-500"
        : "border-gray-200"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-gray-400"
    />
    <div
      className={`flex items-center p-3 border-b rounded-t-lg ${
        data.isActive ? "bg-blue-100" : "bg-blue-50 border-gray-100"
      }`}
    >
      <div className="p-2 bg-blue-100 rounded-md mr-3">
        <Mail className="w-4 h-4 text-blue-600" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800">Send Email</h3>
        <p className="text-[10px] text-gray-500">Action</p>
      </div>
    </div>
    <div className="p-3 bg-gray-50">
      <p className="text-xs text-gray-600 line-clamp-2">
        {data.message || "No message configured..."}
      </p>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-gray-400"
    />
  </div>
);

export default ActionNode;
