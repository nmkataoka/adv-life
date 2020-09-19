import { NComponent } from '../../0-engine';
import { Datum, DatumConstructor, PartialDataType } from './Datum';

export class DataDbCmpt<DataType extends Datum> implements NComponent {
  constructor(datumClass: DatumConstructor<DataType>) {
    this.DatumClass = datumClass;
  }

  public addDatum = (datumName: string, partialDatum: PartialDataType<DataType>): number => {
    if (this.datumIdFromName[datumName] != null) {
      throw new Error(`${this.name} ${datumName} already exists`);
    }

    const newId = this.datumNameFromId.length;
    this.datumNameFromId.push(datumName);
    const datum = new this.DatumClass(partialDatum);
    this.data.push(datum);
    this.datumIdFromName[datumName] = newId;
    return newId;
  };

  public get = (datumId: number): DataType => {
    return this.data[datumId];
  };

  public getByName = (datumName: string): DataType => {
    const datumId = this.getIdFromName(datumName);
    return this.get(datumId);
  };

  public getIdFromName = (datumName: string): number => {
    return this.datumIdFromName[datumName];
  };

  public getNameFromId = (datumId: number): string => {
    return this.datumNameFromId[datumId];
  };

  /** Adds data from an data array */
  public readFromArray = (dataArr: PartialDataType<DataType>[]): void => {
    dataArr.forEach((datum) => this.addDatum(datum.name, datum));
  };

  /** Set the component name, which is used in debugging messages */
  public setName = (name: string): void => {
    this.name = name;
  };

  private DatumClass: DatumConstructor<DataType>;

  private data: DataType[] = [];

  private datumNameFromId: string[] = [];

  private datumIdFromName: { [key: string]: number } = {};

  private name = 'Datum';
}
