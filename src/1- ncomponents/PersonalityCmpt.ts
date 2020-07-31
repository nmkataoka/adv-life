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
  public traits: PersonalityArray = [1, 1, 1, 1, 1, 1];

  public setTraits(personality: PersonalityArray): void {
    this.traits = [...personality];
  }
}
