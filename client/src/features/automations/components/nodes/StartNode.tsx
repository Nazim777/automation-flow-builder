import { Handle, Position, NodeProps } from "reactflow";
import "reactflow/dist/style.css";
import { PlayCircle } from "lucide-react";

const StartNode = ({ data }: NodeProps) => (
  <div
    className={`flex flex-col items-center justify-center w-16 h-16 bg-green-100 border-2 rounded-full transition-all duration-500 ${
      data.isActive
        ? "border-green-600 ring-4 ring-green-400 animate-pulse scale-110 shadow-lg"
        : "border-green-500 shadow-sm"
    }`}
  >
    <PlayCircle className="w-8 h-8 text-green-600" />
    <Handle
      type="source"
      position={Position.Bottom}
      className="w-3 h-3 bg-green-500"
    />
  </div>
);

export default StartNode;
