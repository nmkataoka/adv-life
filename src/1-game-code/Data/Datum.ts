export class Datum {
  /** In es6, it is impossible to run a parent constructor before child field initializers
   * So in order to overwrite default values in the child object, children
   * must implement constructors that explicitly call this function
   */
  protected init = (partial: PartialDataType<Datum>): void => {
    Object.assign(this, partial);
  };

  public name = '';
}

export type PartialDataType<DataType extends Datum> = Partial<DataType> & Pick<DataType, 'name'>;

export type DatumConstructor<DataType extends Datum> = {
  new (partial: PartialDataType<DataType>): DataType;
};
