import { Individual } from "../domain/individual";

export interface FamilyDetail {
    member: Individual
    spouce?: Individual
    children?: Individual[]
    father?: Individual
    mother?: Individual
}