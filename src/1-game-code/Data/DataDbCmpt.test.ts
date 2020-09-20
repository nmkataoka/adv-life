import { DataDbCmpt } from './DataDbCmpt';
import { Datum, PartialDataType } from './Datum';
import testData from './Datum.test.json';

const [firstDatum, secondDatum] = testData;

class TestDatum extends Datum {
  public value = '';

  constructor(data: PartialDataType<TestDatum>) {
    super();
    Object.assign(this, data);
    this.init(data);
  }
}

describe('DataDbCmpt', () => {
  let dataDbCmpt: DataDbCmpt<TestDatum>;
  beforeEach(() => {
    dataDbCmpt = new DataDbCmpt(TestDatum);
  });

  it('adds datum', () => {
    const firstDatumId = dataDbCmpt.addDatum(firstDatum);
    expect(dataDbCmpt.get(firstDatumId)).toMatchObject(firstDatum);
    expect(() => dataDbCmpt.getByName(secondDatum.name)).toThrowError();
    const secondDatumId = dataDbCmpt.addDatum(secondDatum);
    expect(dataDbCmpt.get(secondDatumId)).toMatchObject(secondDatum);
  });

  it('reads in data from json array', () => {
    dataDbCmpt.readFromArray(testData);
    expect(dataDbCmpt.getByName(firstDatum.name)).toMatchObject(firstDatum);
    expect(dataDbCmpt.getByName(secondDatum.name)).toMatchObject(secondDatum);
  });

  it('throws correct error when trying to add a datum with a name that already exists', () => {
    dataDbCmpt.addDatum(firstDatum);
    expect(() => dataDbCmpt.addDatum(firstDatum)).toThrowError(
      'TestDatum testDatum1 already exists',
    );
  });

  it('links up id and name properly', () => {
    const firstDatumId = dataDbCmpt.addDatum(firstDatum);
    const secondDatumId = dataDbCmpt.addDatum(secondDatum);
    expect(firstDatumId).not.toEqual(secondDatumId);
    expect(dataDbCmpt.getNameFromId(firstDatumId)).toEqual(firstDatum.name);
    expect(dataDbCmpt.getNameFromId(secondDatumId)).toEqual(secondDatum.name);
    expect(dataDbCmpt.getIdFromName(firstDatum.name)).toEqual(firstDatumId);
    expect(dataDbCmpt.getIdFromName(secondDatum.name)).toEqual(secondDatumId);
  });
});
