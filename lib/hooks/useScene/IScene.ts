import { IObjects } from "../../components/DrawArea/useDrawing";
import { IndexCardColorTypes } from "../../components/IndexCard/IndexCardColor";
import { ICharacter } from "../../contexts/CharactersContext/CharactersContext";
import { IDiceRoll } from "../../domains/dice/IDiceRoll";
import { AspectType } from "./AspectType";

export interface IPlayer {
  id: string;
  playerName?: string;
  character?: ICharacter;
  rolls: Array<IDiceRoll>;
  playedDuringTurn: boolean;
  fatePoints: number;
  offline: boolean;
}

export interface IAspect {
  title: string;
  content: string;
  tracks: Array<{
    name: string;
    value: Array<{ checked?: boolean; label: string }>;
  }>;
  consequences: Array<{ name: string; value: string }>;
  color: IndexCardColorTypes;
  playedDuringTurn: boolean;
  type: AspectType;
}

export interface IScene {
  id: string;
  name: string;
  aspects: Record<string, IAspect>;
  gm: IPlayer;
  players: Array<IPlayer>;
  goodConfetti: number;
  badConfetti: number;
  sort: boolean;
  drawAreaObjects: IObjects;
  version: number;
  lastUpdated: number;
}
