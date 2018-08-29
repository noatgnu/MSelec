import {MsPeptide} from './ms-peptide';

export class MsProtein {
  constructor(Peptides:  Map<string, MsPeptide>, Name: string) {
    this.Peptides = Peptides;
    this.Name = Name;
  }
  Peptides: Map<string, MsPeptide>;
  Name: string;
}
