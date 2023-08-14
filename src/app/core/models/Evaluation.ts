import {Critere} from "./critere";
import {Inspection} from "./Inspection";
import {Bloc} from "./Bloc";

export interface Evaluation {
  id: number;
  score: number;
  pieceJointe?: string;
  inspectionId: number;
  inspection: Inspection;
  evaluationPointId: number;
  evaluationPoint: Critere;
  blocId: number;
  bloc: Bloc;
}

export interface CreateEvaluationDto {
  score: number;
  pieceJointe?: string;
  inspectionId: number;
  evaluationPointId: number;
  blocId: number;
}

export interface UpdateEvaluationDto {
  score?: number;
  pieceJointe?: string;
  inspectionId?: number;
  evaluationPointId?: number;
  blocId?: number;
}
