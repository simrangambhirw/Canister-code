// Student Token Canister
class StudentTokenCanister {
    private students: Map<string, number>;
    private events: Map<string, number>;
    private contractBalance: number;

    constructor() {
        this.students = new Map();
        this.events = new Map();
        this.contractBalance = 0;
    }

    // for adding students with initial tokens
    addStudent(name: string, initialTokens: number) {
        this.students.set(name, initialTokens);
    }

    // to award tokens to a student
    awardTokensToStudent(name: string, tokens: number) {
        if (this.students.has(name)) {
            const currentTokens = this.students.get(name)!;
            this.students.set(name, currentTokens + tokens);
        }
    }

    // to create a new campus event
    createEvent(eventName: string) {
        this.events.set(eventName, 0);
    }

    // Award tokens for participation in an event
    awardTokensForEvent(eventName: string, tokens: number) {
        if (this.events.has(eventName)) {
            const currentTokens = this.events.get(eventName)!;
            this.events.set(eventName, currentTokens + tokens);
        }
    }

    // Trade tokens between students
    tradeTokens(sender: string, receiver: string, tokens: number) {
        if (this.students.has(sender) && this.students.has(receiver)) {
            const senderTokens = this.students.get(sender)!;
            const receiverTokens = this.students.get(receiver)!;
            if (senderTokens >= tokens) {
                this.students.set(sender, senderTokens - tokens);
                this.students.set(receiver, receiverTokens + tokens);
            }
        }
    }

    // 1. Get student's token balance
    getStudentTokens(name: string): number | undefined {
        return this.students.get(name);
    }

    // 2. Get event's token balance
    getEventTokens(eventName: string): number | undefined {
        return this.events.get(eventName);
    }

    // 3. Get total tokens in the canister
    getTotalTokens(): number {
        return this.contractBalance;
    }

    // 4. Allow a student to transfer tokens to the contract
    transferTokensToContract(sender: string, tokens: number): boolean {
        if (this.students.has(sender) && this.students.get(sender)! >= tokens) {
            this.students.set(sender, this.students.get(sender)! - tokens);
            this.contractBalance += tokens;
            return true;
        }
        return false;
    }

    // 5. Allow a student to withdraw tokens from the contract
    withdrawTokensFromContract(receiver: string, tokens: number): boolean {
        if (this.contractBalance >= tokens) {
            this.students.set(receiver, (this.students.get(receiver) || 0) + tokens);
            this.contractBalance -= tokens;
            return true;
        }
        return false;
    }

    // 6. Get contract's token balance
    getContractBalance(): number {
        return this.contractBalance;
    }

    // 7. Get total number of registered students
    getStudentCount(): number {
        return this.students.size;
    }

    // 8. Get total number of registered events
    getEventCount(): number {
        return this.events.size;
    }
}

// Example for its Usage
const tokenCanister = new StudentTokenCanister();
tokenCanister.addStudent("Alice", 100);
tokenCanister.addStudent("Bob", 50);
tokenCanister.createEvent("Hackathon");
tokenCanister.awardTokensToStudent("Alice", 50);
tokenCanister.awardTokensForEvent("Hackathon", 30);
tokenCanister.tradeTokens("Alice", "Bob", 20);

// Additional example usage
tokenCanister.transferTokensToContract("Alice", 25);
tokenCanister.withdrawTokensFromContract("Bob", 10);

// Output
console.log(tokenCanister);
