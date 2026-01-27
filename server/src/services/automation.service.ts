import Automation from "../models/automation.model";
import TestRun from "../models/testRun.model";
import { Edge, Node } from "../types";
import {
  validateAutomationName,
  validateFlow,
} from "../utils/validation/validator.util";

class AutomationService {
  private readonly automationRepository: typeof Automation;
  private readonly testRunRepository: typeof TestRun;

  constructor(
    automationRepository: typeof Automation = Automation,
    testRunRepository: typeof TestRun = TestRun,
  ) {
    this.automationRepository = automationRepository;
    this.testRunRepository = testRunRepository;
  }

  /**
   * CREATE NEW AUTOMATION
   * Validates node presence and automatically generates required edges.
   * @param name
   * @param nodes
   * @returns
   */
  public async createAutomation(name: string, nodes: Node[]) {
    try {
      // validate the name
      const { valid, error } = validateAutomationName(name);
      if (!valid) throw new Error(error);

      // Check uniqueness
      const existing = await this.automationRepository.findOne({ name });
      if (existing) throw new Error("Automation with this name already exists");

      const startNode = nodes.find((n) => n.type === "start");
      const endNode = nodes.find((n) => n.type === "end");

      if (!startNode || !endNode) {
        throw new Error("Automation must have start and end nodes");
      }

      // Define flow order logic
      const conditionNode = nodes.find((n) => n.type === "condition");
      const delayNode = nodes.find((n) => n.type === "delay");
      const actionNode = nodes.find((n) => n.type === "action");

      const orderedNodes: Node[] = [
        startNode,
        conditionNode!,
        delayNode!,
        actionNode!,
        endNode,
      ].filter(Boolean);

      // Dynamically generate edges
      const edges: Edge[] = [];
      for (let i = 0; i < orderedNodes.length - 1; i++) {
        const current = orderedNodes[i];
        const next = orderedNodes[i + 1];

        const edge: Edge = {
          id: `${current.id}-${next.id}`,
          source: current.id,
          target: next.id,
        };

        if (current.type === "condition") edge.sourceHandle = "true";
        edges.push(edge);
      }

      // validate the nodes and edges
      const { valid: validFlow, error: flowError } = validateFlow(nodes, edges);
      if (!validFlow) throw new Error(flowError);

      const automation = new this.automationRepository({
        name,
        nodes: orderedNodes,
        edges,
        status: "draft",
      });

      return await automation.save();
    } catch (error) {
      console.error(`Error in createAutomation service: ${error}`);
      throw error;
    }
  }

  /**
   * GET ALL AUTOMATIONS
   * @returns
   */
  public async findAll() {
    return await this.automationRepository.find().sort({ createdAt: -1 });
  }

  /**
   * GET AUTOMATION
   * @param id
   * @returns
   */
  public async findById(id: string) {
    return await this.automationRepository.findById(id);
  }

  /**
   * UPDATE AUTOMATION
   * @param id
   * @param updateData
   * @returns
   */
  public async updateAutomation(id: string, updateData: any) {
    if (updateData.name) {
      const existing = await this.automationRepository.findOne({
        name: updateData.name,
        _id: { $ne: id },
      });
      if (existing) throw new Error("Automation with this name already exists");
    }
    return await this.automationRepository.findByIdAndUpdate(id, updateData, {
      new: true,
    });
  }

  /**
   * DELETE AUTOMATION
   * @param id
   * @returns
   */
  public async deleteAutomation(id: string) {
    const deleted = await this.automationRepository.findByIdAndDelete(id);
    if (deleted) {
      await this.testRunRepository.deleteMany({ automationId: id });
    }
    return deleted;
  }
}

export default AutomationService;
