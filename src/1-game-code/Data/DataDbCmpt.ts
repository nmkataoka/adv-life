import { NComponent } from '0-engine';
import { Datum, DatumConstructor, PartialDataType } from './Datum';

export class DataDbCmpt<DataType extends Datum> implements NComponent {
  constructor(datumClass: DatumConstructor<DataType>) {
    this.DatumClass = datumClass;
  }

  /** Add a datum to the db
   * @returns {number} A number assigned to the datum, guaranteed not to change while the game is running.
   * Use this to access the datum whenever possible.
   */
  public addDatum = (partialDatum: PartialDataType<DataType>): number => {
    const datumName = partialDatum.name;
    if (this.datumIdFromName[datumName] != null) {
      throw new Error(`${this.DatumClass.name} ${datumName} already exists`);
    }

    const newId = this.datumNameFromId.length;
    const datum = new this.DatumClass(partialDatum);
    this.datumNameFromId.push(datumName);
    this.data.push(datum);
    this.datumIdFromName[datumName] = newId;
    return newId;
  };

  /** Performant way to get a datum */
  public get = (datumId: number): DataType => {
    const datum = this.data[datumId];
    if (datum == null) {
      throw new Error(`${this.DatumClass.name} datum not found with id: ${datumId}`);
    }
    return datum;
  };

  /** I'd like to remove this when react-ecs is created, if it makes sense */
  public getAll = (): DataType[] => {
    return this.data;
  };

  /** Get a datum by its permanent name */
  public getByName = (datumName: string): DataType => {
    const datumId = this.getIdFromName(datumName);
    return this.get(datumId);
  };

  /** Get the internal id from the permanent datum name */
  public getIdFromName = (datumName: string): number => {
    const id = this.datumIdFromName[datumName];
    if (id == null) {
      throw new Error(`${this.DatumClass.name} name not found: ${datumName}`);
    }
    return id;
  };

  /** Get the permanent datum name from the internal id */
  public getNameFromId = (datumId: number): string => {
    const datumName = this.datumNameFromId[datumId];
    if (datumName == null) {
      throw new Error(`${this.DatumClass.name} id not found: ${datumId}`);
    }
    return datumName;
  };

  /** Adds data from an array of DataType */
  public readFromArray = (dataArr: PartialDataType<DataType>[]): void => {
    dataArr.forEach((datum) => this.addDatum(datum));
  };

  private DatumClass: DatumConstructor<DataType>;

  private data: DataType[] = [];

  /** For performance, data is an array, so numeric indices are used
   * as ids for data instead of their name strings. This allows for conversion
   * from the data index back to the name string.
   */
  private datumNameFromId: string[] = [];

  /** Allows lookup of the data index from the datum name */
  private datumIdFromName: { [key: string]: number } = {};
}
