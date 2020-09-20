import { Datum, PartialDataType } from '../../Data/Datum';

export class Material extends Datum {
  public density = 1; // In g / cm3

  public hardness = 1; // In MPa (1e6 kg / (m s^2) ), bronze is about 400

  public value = 1;

  public hooter = 2;

  constructor(data: PartialDataType<Material>) {
    super();
    Object.assign(this, data);
    this.init(data);
  }
}
