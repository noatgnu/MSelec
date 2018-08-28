import {MsElement} from './ms-element';

export class MsSpectrum {
  constructor(Name: string, Values: MsElement[]) {
    this.Name = Name;
    this.Values = Values;
  }
  Name: string;
  Values: MsElement[];
}
