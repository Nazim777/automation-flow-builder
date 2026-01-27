import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { GitFork } from "lucide-react";

const ConditionNode = ({ data, selected }: NodeProps) => (
  <div
    className={`w-56 bg-white rounded-lg shadow-md border-2 transition-all duration-500 ${
      data.isActive
        ? "border-purple-500 ring-4 ring-purple-300 animate-pulse scale-105 shadow-xl"
        : selected
        ? "border-purple-500"
        : "border-gray-200"
    }`}
  >
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-gray-400"
    />
    <div
      className={`p-3 rounded-t-lg border-b ${
        data.isActive ? "bg-purple-100" : "bg-purple-50 border-purple-100"
      }`}
    >
      <div className="flex items-center justify-center mb-2">
        <GitFork className="w-5 h-5 text-purple-600 mr-2" />
        <span className="font-bold text-sm text-gray-800">Check Condition</span>
      </div>
    </div>
    <div className="flex justify-between items-center px-4 py-2 bg-white rounded-b-lg">
      <div className="text-xs font-semibold text-green-600">True</div>
      <div className="text-xs font-semibold text-red-600">False</div>
    </div>
    <Handle
      id="true"
      type="source"
      position={Position.Bottom}
      className="!left-[25%] w-3 h-3 bg-green-500"
    />
    <Handle
      id="false"
      type="source"
      position={Position.Bottom}
      className="!left-[75%] w-3 h-3 bg-red-500"
    />
  </div>
);

export default ConditionNode;
