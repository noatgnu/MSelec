import {MsElement} from './ms-element';

export class MsPeptide {
  constructor(Sequence: string, Ions: MsElement[]) {
    this.Sequence = Sequence;
    this.Ions = Ions;
  }
  Sequence: string;
  Ions: MsElement[];
}
