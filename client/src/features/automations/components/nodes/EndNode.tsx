import { Handle, Position } from "reactflow";
import { StopCircle } from "lucide-react";
const EndNode = () => (
  <div className="flex flex-col items-center justify-center w-16 h-16 bg-red-100 border-2 border-red-500 rounded-full shadow-sm">
    <Handle
      type="target"
      position={Position.Top}
      className="w-3 h-3 bg-red-500"
    />
    <StopCircle className="w-8 h-8 text-red-600" />
    <span className="text-[10px] font-bold text-red-700 mt-1">END</span>
  </div>
);

export default EndNode;
