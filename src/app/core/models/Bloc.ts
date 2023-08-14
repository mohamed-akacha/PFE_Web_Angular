import {InspectionUnit} from "./InspectionUnit";

export interface Bloc {
  id: number;
  code: string;
  nom: string;
  etage: number;
  inspectionUnitId: number;
  inspectionUnit: InspectionUnit;
}

export interface CreateBlocDto {
  code: string;
  nom: string;
  etage: number;
  inspectionUnitId: number;
}

export interface UpdateBlocDto {
  code?: string;
  nom?: string;
  etage?: number;
  inspectionUnitId?: number;
}
