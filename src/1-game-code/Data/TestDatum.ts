import { Datum, PartialDataType } from './Datum';

export class TestDatum extends Datum {
  public value = '';

  constructor(data: PartialDataType<TestDatum>) {
    super();
    Object.assign(this, data);
    this.init(data);
  }
}
