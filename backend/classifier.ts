import { Category, Priority } from './models';

export class IssueClassifier {
  /**
   * Classifies an issue based on keywords in the description.
   */
  static classify(description: string): { category: Category; priority: Priority } {
    const desc = description.toLowerCase();
    let category: Category = Category.GENERAL;
    let priority: Priority = Priority.LOW;

    if (desc.includes('password') || desc.includes('login') || desc.includes('access')) {
      category = Category.ACCESS;
      priority = Priority.MEDIUM;
    } else if (desc.includes('vpn') || desc.includes('network') || desc.includes('internet') || desc.includes('wifi')) {
      category = Category.NETWORK;
      priority = Priority.HIGH;
    } else if (desc.includes('email') || desc.includes('outlook') || desc.includes('teams')) {
      category = Category.COMMUNICATION;
      priority = Priority.LOW;
    } else if (desc.includes('laptop') || desc.includes('hardware') || desc.includes('monitor') || desc.includes('keyboard')) {
      category = Category.HARDWARE;
      priority = Priority.MEDIUM;
    }

    return { category, priority };
  }
}
