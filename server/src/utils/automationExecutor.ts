import { Automation, Node, ConditionRule } from "../types";
import TestRun from "../models/testRun.model";
import { sendEmail } from "./email.util";

export default class AutomationExecutor {
  private automation: Automation;
  private testEmail: string;
  private testRunId: string;
  private currentNodeId: string = "start";
  private visitedNodes: Set<string> = new Set();
  private lastConditionResult: boolean = false;
  private socketIo: any;

  constructor(
    automation: Automation,
    testEmail: string,
    testRunId: string,
    io: any,
  ) {
    this.automation = automation;
    this.testEmail = testEmail;
    this.testRunId = testRunId;
    this.socketIo = io;
  }

  async execute(): Promise<void> {
    try {
      await this.updateTestRunStatus("running");
      await this.log("start", "Starting automation execution");
      // notify start
      this.socketIo.emit(`test-status-update:${this.testRunId}`, {
        status: "running",
        message: "Starting automation...",
      });

      while (this.currentNodeId !== "end") {
        if (this.visitedNodes.has(this.currentNodeId)) {
          throw new Error(
            `Infinite loop detected at node: ${this.currentNodeId}`,
          );
        }
        this.visitedNodes.add(this.currentNodeId);

        const currentNode = this.automation.nodes.find(
          (n) => n.id === this.currentNodeId,
        );
        if (!currentNode) {
          throw new Error(`Node not found: ${this.currentNodeId}`);
        }

        // notify progress
        this.socketIo.emit(`test-status-update:${this.testRunId}`, {
          status: "running",
          message: `Processing ${currentNode.type} node...`,
          currentNodeId: currentNode.id,
        });

        await this.executeNode(currentNode);

        const nextNodeId = await this.getNextNode(currentNode);

        if (!nextNodeId) {
          throw new Error(`No path forward from node: ${this.currentNodeId}`);
        }

        this.currentNodeId = nextNodeId || "end";
      }

      await this.log("end", "Automation completed successfully");
      await this.updateTestRunStatus("completed");

      // notify finished
      this.socketIo.emit(`test-status-update:${this.testRunId}`, {
        status: "completed",
        message: "Automation finished successfully",
      });
    } catch (error: any) {
      await this.log("error", `Execution failed: ${error.message}`);
      await this.updateTestRunStatus("failed", error.message);
      this.socketIo.emit(`test-status-update:${this.testRunId}`, {
        status: "failed",
        message: error.message || "Failed to run the test automation",
      });
      throw error;
    }
  }

  private async executeNode(node: Node) {
    await this.updateCurrentStep(node.id);

    switch (node.type) {
      case "start":
        await this.log(node.id, "Started automation");
        break;

      case "action":
        await this.log(node.id, "Action automation started");
        await this.executeActionNode(node);
        break;

      case "delay":
        await this.log(node.id, "Delay automation started");
        await this.executeDelayNode(node);
        break;

      case "condition":
        await this.log(node.id, "Condition automation started");
        await this.executeConditionNode(node);
        break;

      case "end":
        await this.log(node.id, "Reached end node");
        break;

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }
  }

  private async executeActionNode(node: Node) {
    const message = node.data.message || "No message provided";
    await this.log(node.id, `Sending email: "${message.substring(0, 50)}..."`);

    const result = await sendEmail(
      this.testEmail,
      "Automation Test - Action Step",
      message,
    );

    if (!result.success)
      throw new Error(`Failed to send email: ${result.error}`);
    await this.log(node.id, `Email sent successfully to ${this.testEmail}`);
  }

  private async executeDelayNode(node: Node) {
    const { delayType, duration, unit, specificDateTime } = node.data;

    let ms = 0;

    if (delayType === "specific" && specificDateTime) {
      const targetDate = new Date(specificDateTime);
      ms = targetDate.getTime() - new Date().getTime();
      if (ms > 0) await this.delay(ms);
    } else {
      const multipliers: Record<string, number> = {
        minutes: 60 * 1000,
        hours: 60 * 60 * 1000,
        days: 24 * 60 * 60 * 1000,
      };
      ms =
        (duration || 1) *
        (multipliers[unit || "minutes"] || multipliers.minutes);
      await this.delay(ms);
    }

    await this.log(node.id, `Delay of ${duration} ${unit} completed`);
  }

  private async executeConditionNode(node: Node) {
    const rules = node.data.rules || [];
    const result = this.evaluateCondition(rules, this.testEmail);
    this.lastConditionResult = result;
    await this.log(
      node.id,
      `Condition evaluated to: ${result ? "TRUE" : "FALSE"}`,
    );
  }

  private evaluateCondition(rules: ConditionRule[], email: string): boolean {
    if (!rules || rules.length === 0) return true;

    let result = this.evaluateRule(rules[0], email);
    for (let i = 1; i < rules.length; i++) {
      const rule = rules[i];
      const ruleResult = this.evaluateRule(rule, email);
      result =
        rule.joinType === "AND" ? result && ruleResult : result || ruleResult;
    }
    return result;
  }

  private evaluateRule(rule: ConditionRule, email: string): boolean {
    const value = rule.value.toLowerCase();
    const emailLower = email.toLowerCase();

    switch (rule.operator) {
      case "equals":
        return emailLower === value;
      case "not_equals":
        return emailLower !== value;
      case "includes":
        return emailLower.includes(value);
      case "starts_with":
        return emailLower.startsWith(value);
      case "ends_with":
        return emailLower.endsWith(value);
      default:
        return false;
    }
  }

  

  private async getNextNode(currentNode: any): Promise<string> {
    const edges = this.automation.edges.filter(
      (e) => e.source === currentNode.id,
    );

    // Handle Condition Nodes specifically
    if (currentNode.type === "condition") {
      const result = this.lastConditionResult ? "true" : "false";
      const edge = edges.find((e) => e.sourceHandle === result);

      // If the specific handle (true/false) isn't connected, finish gracefully
      if (!edge) {
        await this.log(
          currentNode.id,
          `No path connected for condition: ${result}. Finishing flow.`,
        );
        return "end";
      }
      return edge.target;
    }

    // Handle standard nodes (Action/Delay/Start)
    if (edges.length === 0) {
      return "end"; // Instead of throwing error, we just finish
    }

    // If there are multiple edges but it's not a condition, take the first one
    return edges[0].target;
  }

  private async delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async log(step: string, message: string) {
    await TestRun.findByIdAndUpdate(this.testRunId, {
      $push: {
        logs: {
          timestamp: new Date(),
          step,
          action: "execute",
          message,
        },
      },
    });
    console.log(`[${step}] ${message}`);
  }

  private async updateTestRunStatus(
    status: "pending" | "running" | "completed" | "failed",
    error?: string,
  ) {
    const update: any = { status };
    if (status === "running") update.startedAt = new Date();
    if (status === "completed" || status === "failed")
      update.completedAt = new Date();
    if (error) update.error = error;
    await TestRun.findByIdAndUpdate(this.testRunId, update);
  }

  private async updateCurrentStep(stepId: string) {
    await TestRun.findByIdAndUpdate(this.testRunId, { currentStep: stepId });
  }
}
