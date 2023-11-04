export class InvalidEntitySpecError extends Error {
    constructor(type: string, message: string) {
        super(`${type}${message}`);
        this.name = `Invalid${type}SpecError`;
    }
}
