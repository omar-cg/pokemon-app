import { Timestamp } from "@angular/fire/firestore";

export interface Profile {
    id?: string,
    name?: string | null | undefined,
    hobbie?: string | null | undefined,
    birthday?: any,
    document?: string | null | undefined,
    years?: number
}