import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { Clock } from "lucide-react";

const DelayNode = ({ data, selected }: NodeProps) => (
  <div
    className={`w-48 bg-white rounded-lg shadow-md border-2 transition-all duration-500 ${
      data.isActive
        ? "border-amber-500 ring-4 ring-amber-300 animate-pulse scale-105 shadow-xl"
        : selected
        ? "border-amber-500"
        : "border-gray-200"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-gray-400"
    />
    <div
      className={`flex items-center p-2 rounded-lg ${
        data.isActive ? "bg-amber-100" : "bg-amber-50"
      }`}
    >
      <div className="p-2 bg-amber-100 rounded-md mr-3">
        <Clock className="w-4 h-4 text-amber-600" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-gray-800">Delay</h3>
        <p className="text-xs text-gray-600">
          {data.duration || 0} {data.unit || "minutes"}
        </p>
      </div>
    </div>
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-gray-400"
    />
  </div>
);

export default DelayNode;
