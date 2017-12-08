export class MyServer {
    public async getPerson(id: number): Promise<Person> {
        throw new Error('not implemented');
    }

    public async getName(id: number): Promise<string> {
        return (await this.getPerson(id)).name;
    }
}

export interface Person {
    id: number;
    name: string;
    firstName: string;
}
