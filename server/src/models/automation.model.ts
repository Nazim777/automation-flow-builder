import mongoose, { Schema, Document, Types } from "mongoose";
import { Automation as IAutomation } from "../types";

export interface AutomationDocument extends Omit<IAutomation, "_id">, Document {
  _id: Types.ObjectId;
}

/**
 * ----- AUTOMATION  SCHEMA -----
 */
const automationSchema = new Schema<AutomationDocument>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    nodes: [
      {
        id: String,
        type: {
          type: String,
          enum: ["start", "end", "action", "delay", "condition"],
        },
        position: {
          x: Number,
          y: Number,
        },
        data: Schema.Types.Mixed,
      },
    ],
    edges: [
      {
        id: String,
        source: String,
        target: String,
        sourceHandle: String,
        targetHandle: String,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "paused"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

/**
 * ----- AUTOMATION  MODEL -----
 */

export default mongoose.model<AutomationDocument>(
  "Automation",
  automationSchema,
);
