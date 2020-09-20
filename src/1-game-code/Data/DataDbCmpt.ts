import { NComponent } from '../../0-engine';
import { Datum, DatumConstructor, PartialDataType } from './Datum';

export class DataDbCmpt<DataType extends Datum> implements NComponent {
  constructor(datumClass: DatumConstructor<DataType>) {
    this.DatumClass = datumClass;
  }

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

  public get = (datumId: number): DataType => {
    const datum = this.data[datumId];
    if (datum == null) {
      throw new Error(`${this.DatumClass.name} datum not found with id: ${datumId}`);
    }
    return datum;
  };

  public getByName = (datumName: string): DataType => {
    const datumId = this.getIdFromName(datumName);
    return this.get(datumId);
  };

  public getIdFromName = (datumName: string): number => {
    const id = this.datumIdFromName[datumName];
    if (id == null) {
      throw new Error(`${this.DatumClass.name} name not found: ${datumName}`);
    }
    return id;
  };

  public getNameFromId = (datumId: number): string => {
    const datumName = this.datumNameFromId[datumId];
    if (datumName == null) {
      throw new Error(`${this.DatumClass.name} id not found: ${datumId}`);
    }
    return datumName;
  };

  /** Adds data from an data array */
  public readFromArray = (dataArr: PartialDataType<DataType>[]): void => {
    dataArr.forEach((datum) => this.addDatum(datum));
  };

  private DatumClass: DatumConstructor<DataType>;

  private data: DataType[] = [];

  private datumNameFromId: string[] = [];

  private datumIdFromName: { [key: string]: number } = {};
}
