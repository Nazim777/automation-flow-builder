import TestRun from "../models/testRun.model";
import Automation from "../models/automation.model";
import { AutomationExecutor } from "../utils";
import { validateEmail } from "../utils/validation/validator.util";

class TestRunService {
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
   * CREATE AND START TEST RUN
   * Initiates the background executor and returns the run ID.
   * @param automationId
   * @param email
   * @returns
   */
  public async startTestRun(automationId: string, email: string, io: any) {
    try {
      // validate the email
      const { valid, error } = validateEmail(email);
      if (!valid) throw new Error(error);

      // 1. Verify automation exists
      const automation = await this.automationRepository.findById(automationId);
      if (!automation) throw new Error("Automation not found");

      // 2. Create the record
      const testRun = new this.testRunRepository({
        automationId: automation._id,
        email,
        status: "pending",
      });
      await testRun.save();

      // 3. Trigger Background Execution
      setImmediate(async () => {
        try {
          const executor = new AutomationExecutor(
            automation.toObject(),
            email,
            testRun._id.toString(),
            io,
          );
          await executor.execute();
        } catch (error) {
          console.error(
            `Background execution error for run ${testRun._id}:`,
            error,
          );
        }
      });

      return testRun;
    } catch (error) {
      console.error(`Error in startTestRun service: ${error}`);
      throw error;
    }
  }

  /**
   * GET TEST RUN HISTORY
   * Fetches the last 50 runs for a specific automation
   * @param automationId
   * @returns
   */
  public async getHistoryByAutomation(automationId: string) {
    try {
      return await this.testRunRepository
        .find({ automationId })
        .sort({ createdAt: -1 })
        .limit(50);
    } catch (error) {
      console.error(`Error fetching history: ${error}`);
      throw error;
    }
  }
}

export default TestRunService;
