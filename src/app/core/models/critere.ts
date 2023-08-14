export interface Critere{
  id: number;
  description: string;
  type: string;
}

export interface AddEvaluationPointDto{
  description: string;
  type: string;
}
export interface UpdateEvaluationPointDto {
  description: string;
  type?: string;
}
