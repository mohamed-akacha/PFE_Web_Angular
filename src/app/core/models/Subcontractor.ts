export interface Subcontractor{
  id: number;
  nom_contact: string;
  tel_contact: string;
  email_contact: string;
  raison_sociale: string;
}
export interface CreateSousTraitantDto{
  nom_contact: string;
  tel_contact: string;
  email_contact: string;
  raison_sociale: string;
}
export interface UpdateSousTraitantDto{
  nom_contact?: string;
  tel_contact?: string;
  email_contact?: string;
  raison_sociale?: string;
}
