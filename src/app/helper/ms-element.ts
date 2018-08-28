export class MsElement {
  constructor(Intensity: number, MZ: number, RT: number, Index: number) {
    this.Intensity = Intensity;
    this.MZ = MZ;
    this.RT = RT;
    this.Index = Index;
  }

  Name: string;
  Intensity: number;
  MZ: number;
  RT: number;
  Index: number;
  Precursor: string;
}
