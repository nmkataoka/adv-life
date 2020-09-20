export class Datum {
  constructor(partial: PartialDataType<Datum>) {
    this.name = partial.name;
    Object.assign(this, partial);
  }

  public name: string;
}

export type PartialDataType<DataType extends Datum> = Partial<DataType> & Pick<DataType, 'name'>;

export type DatumConstructor<DataType extends Datum> = {
  new (partial: PartialDataType<DataType>): DataType;
};
