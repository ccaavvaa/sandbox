export declare class MyServer {
    getPerson(id: number): Promise<Person>;
}
export interface Person {
    id: number;
    name: string;
    firstName: string;
}
