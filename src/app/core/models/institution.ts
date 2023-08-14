import {Zone} from "./Zone";
import {Contract} from "./contract";
import {InspectionUnit} from "./InspectionUnit";

export interface Institution {
  id: number;
  nom: string;
  adresse: string;
  nature: string;
  zone: Zone;
  inspectionUnits: InspectionUnit[];
  contrats: Contract[];
}

export interface CreateInstitutionDto {
  nom: string;
  adresse: string;
  nature: string;
  zoneId: number;
}

export interface UpdateInstitutionDto {
  nom?: string;
  adresse?: string;
  nature?: string;
}
