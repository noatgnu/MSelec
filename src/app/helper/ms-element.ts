export class MsElement {
  constructor(Name: string, Intensity: number, MZ: number, RT: number, Peptide: string, Protein: string, FragmentCharge: number, IonType: string, Residue: number) {
    this.Name = Name;
    this.Intensity = Intensity;
    this.MZ = MZ;
    this.RT = RT;
    this.Peptide = Peptide;
    this.Protein = Protein;
    this.FragmentCharge = FragmentCharge;
    this.IonType = IonType;
    this.Residue = Residue;
  }

  Name: string;
  Intensity: number;
  MZ: number;
  RT: number;
  Peptide: string;
  Protein: string;
  FragmentCharge: number;
  IonType: string;
  Residue: number;
}
