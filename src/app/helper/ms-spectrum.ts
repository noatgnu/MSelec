import {MsElement} from './ms-element';

export class MsSpectrum {
  Options?: {};

  constructor(Name: string, Values: MsElement[], Options?: {}) {
    this.Name = Name;
    this.Values = Values;
    this.Options = Options;
  }
  Name: string;
  Values: MsElement[];
}
