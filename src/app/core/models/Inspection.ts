import {User} from "./User";
import {InspectionUnit} from "./InspectionUnit";
import {Evaluation} from "./Evaluation";

export interface Inspection {
  id: number;
  description: string;
  datePrevue: Date;
  dateInspection?: Date;
  statut: boolean;
  type: string;
  user: User;
  evaluations: Evaluation[];
  unitId: number;
  unit: InspectionUnit;
}

export interface CreateInspectionDto {
  description: string;
  datePrevue: string;
  type: string;
  inspecteurId: number;
  unitId: number;
}

export interface UpdateInspectionDto {
  description?: string;
  datePrevue?: Date;
  dateInspection?: Date;
  statut?: boolean;
  type?: string;
  userId?: number;
  unitId?: number;
}
