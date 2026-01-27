import mongoose, { Schema, Document, Types } from 'mongoose';
import { TestRun as ITestRun } from '../types';

export interface TestRunDocument
  extends Omit<ITestRun, '_id' | 'automationId'>,
    Document {
  automationId: Types.ObjectId;
}


/**
 * ----- TESTRUN  SCHEMA -----
 */

const testRunSchema = new Schema<TestRunDocument>({
  automationId: {
    type: Schema.Types.ObjectId,
    ref: 'Automation',
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending'
  },
  currentStep: String,
  startedAt: Date,
  completedAt: Date,
  logs: [{
    timestamp: Date,
    step: String,
    action: String,
    message: String
  }],
  error: String
}, {
  timestamps: true
});


/**
 * ----- TESTRUN MODEL -----
 */

export default mongoose.model<TestRunDocument>('TestRun', testRunSchema);