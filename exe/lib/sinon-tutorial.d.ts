export declare class MyServer {
    getPerson(id: number): Promise<Person>;
    getName(id: number): Promise<string>;
}
export interface Person {
    id: number;
    name: string;
    firstName: string;
}
