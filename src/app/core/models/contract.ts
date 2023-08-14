import {Institution} from "./institution";
import {Subcontractor} from "./Subcontractor";

export interface Contract{
  id: number;
  date_debut: Date;
  duree: number;
  institution?: Institution;
  sousTraitant?: Subcontractor;
}
export interface CreateContratDto {
  date_debut: Date;
  duree: number;
  institutionId: number;
  sousTraitantId: number;
}
export class UpdateContratDto {
  date_debut?: Date;
  duree?: number;
  institutionId?: number;
  sousTraitantId?: number;
}
