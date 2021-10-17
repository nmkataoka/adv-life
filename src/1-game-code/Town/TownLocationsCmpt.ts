import { NComponent } from '0-engine';

/** @deprecated Please refactor to a `belongsTo` pattern */
export class TownLocationsCmpt extends NComponent {
  public locationIds: number[] = [];

  public getChildren = (): number[] => this.locationIds;
}
