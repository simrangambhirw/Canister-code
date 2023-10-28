// Student Token Canister
class StudentTokenCanister {
    private students: Map<string, number>;
    private events: Map<string, number>;

    constructor() {
        this.students = new Map();
        this.events = new Map();
    }

    // for adding students with initial tokens
    addStudent(name: string, initialTokens: number) {
        this.students.set(name, initialTokens);
    }

    //to award tokens to a student
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
}

// Example for its Usage
const tokenCanister = new StudentTokenCanister();
tokenCanister.addStudent("Alice", 100);
tokenCanister.addStudent("Bob", 50);
tokenCanister.createEvent("Hackathon");
tokenCanister.awardTokensToStudent("Alice", 50);
tokenCanister.awardTokensForEvent("Hackathon", 30);
tokenCanister.tradeTokens("Alice", "Bob", 20);

// Output
console.log(tokenCanister);
