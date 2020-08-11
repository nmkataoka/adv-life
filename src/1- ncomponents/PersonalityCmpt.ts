import { NComponent } from '../0-engine/ECS/NComponent';

export enum PersonalityTraits {
  HonestyHumility,
  Emotionality,
  Extraversion,
  Agreeableness,
  Conscientiousness,
  OpennessToExperience,
}

export type PersonalityArray = [number, number, number, number, number, number];

export class PersonalityCmpt implements NComponent {
  public traits: PersonalityArray = [3, 3, 3, 3, 3, 3];

  public setTraits(personality: PersonalityArray): void {
    this.traits = [...personality];
  }
}
