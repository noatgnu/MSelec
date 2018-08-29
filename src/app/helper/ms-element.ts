export class MsElement {
  constructor(Intensity: number, MZ: number, RT: number, Peptide: string, Protein: string, FragmentCharge: number, IonType: string, Residue: number, PrecursorMZ: number, PrecursorCharge: number, Sample: string) {
    this.Intensity = Intensity;
    this.MZ = MZ;
    this.RT = RT;
    this.Peptide = Peptide;
    this.Protein = Protein;
    this.FragmentCharge = FragmentCharge;
    this.IonType = IonType;
    this.Residue = Residue;
    this.PrecursorMZ = PrecursorMZ;
    this.PrecursorCharge = PrecursorCharge;
    this.Sample = Sample;
  }


  Intensity: number;
  MZ: number;
  RT: number;
  Peptide: string;
  Protein: string;
  FragmentCharge: number;
  IonType: string;
  Residue: number;
  PrecursorMZ: number;
  PrecursorCharge: number;
  Sample: string;
}
