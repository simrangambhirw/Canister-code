import { Principal } from 'axle';
import { Insert, Remove, Update, Init } from 'axle';

type StudentToken = Record<string, number>;

// Student Token Canister
class StudentTokenCanister {
    private students: StudentToken;
    private events: Map<string, number>;
    private owner: Principal;

    constructor() {
        this.students = {};
        this.events = new Map();
        this.owner = caller;
    }

    // Initialize the contract with the owner
    @Init
    init(owner: Principal) {
        if (caller !== owner) {
            // Only the owner can initialize the contract
            throw new Error('Only the owner can initialize the contract');
        }
        this.owner = owner;
    }

    // Add a student with initial tokens
    @Insert
    addStudent(name: string, initialTokens: number) {
        if (caller !== this.owner) {
            throw new Error('Only the owner can add students');
        }
        this.students[name] = initialTokens;
    }

    // Award tokens to a student
    @Update
    awardTokensToStudent(name: string, tokens: number) {
        if (caller !== this.owner) {
            throw new Error('Only the owner can award tokens');
        }
        if (!this.students[name]) {
            throw new Error('Student not found');
        }
        this.students[name] += tokens;
    }

    // Create a new campus event
    @Insert
    createEvent(eventName: string) {
        if (caller !== this.owner) {
            throw new Error('Only the owner can create events');
        }
        this.events.set(eventName, 0);
    }

    // Award tokens for participation in an event
    @Update
    awardTokensForEvent(eventName: string, tokens: number) {
        if (caller !== this.owner) {
            throw new Error('Only the owner can award event tokens');
        }
        if (!this.events.has(eventName)) {
            throw new Error('Event not found');
        }
        this.events.set(eventName, this.events.get(eventName)! + tokens);
    }

    // Trade tokens between students
    @Update
    tradeTokens(sender: string, receiver: string, tokens: number) {
        if (caller !== this.owner) {
            throw new Error('Only the owner can trade tokens');
        }
        if (!this.students[sender] || !this.students[receiver]) {
            throw new Error('Invalid sender or receiver');
        }
        if (this.students[sender] < tokens) {
            throw new Error('Insufficient tokens');
        }
        this.students[sender] -= tokens;
        this.students[receiver] += tokens;
    }
}

// Example for its Usage
const tokenCanister = new StudentTokenCanister();
tokenCanister.init(Principal.selfAuthenticating("owner_principal")); // Initialize with owner
tokenCanister.addStudent("Alice", 100);
tokenCanister.addStudent("Bob", 50);
tokenCanister.createEvent("Hackathon");
tokenCanister.awardTokensToStudent("Alice", 50);
tokenCanister.awardTokensForEvent("Hackathon", 30);
tokenCanister.tradeTokens("Alice", "Bob", 20);
