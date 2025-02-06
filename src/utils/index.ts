import { Machine, Room, Space } from "../types";

export function instanceOfMachine(
  entity: Space | Machine | Room,
): entity is Machine {
  return entity.type === "Máquina";
}

export const instanceOfSpace = (entity: Space | Machine): entity is Space =>
  entity.type === "Espaço";

export const instanceOfRoom = (entity: Room | Machine): entity is Room =>
  entity.type === "Quarto";
