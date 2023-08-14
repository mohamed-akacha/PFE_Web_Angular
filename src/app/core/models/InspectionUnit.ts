import {Institution} from "./institution";
import {Bloc} from "./Bloc";
import {Inspection} from "./Inspection";

export interface InspectionUnit {
  id: number;
  nom: string;
  code: string;
  inspections: Inspection[];
  institutionId: number;
  institution: Institution;
  blocs: Bloc[];
}

export interface CreateInspectionUnitDto {
  nom: string;
  code: string;
  institutionId: number;
}

export interface UpdateInspectionUnitDto {
  nom?: string;
  code?: string;
  institutionId?: number;
}
