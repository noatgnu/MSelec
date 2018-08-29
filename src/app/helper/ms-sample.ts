import {MsProtein} from "./ms-protein";

export class MsSample {
  constructor(Name: string, Proteins: Map<string, MsProtein>) {
    this.Name = Name;
    this.Proteins = Proteins;
  }
  Name: string;
  Proteins: Map<string, MsProtein>;
}
