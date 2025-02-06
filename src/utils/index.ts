import { Machine, Space } from "../types";

export const instanceOfMachine = (entity: Space | Machine): entity is Machine =>
  entity.type === "Máquina";

export const instanceOfSpace = (entity: Space | Machine): entity is Space =>
  entity.type === "Espaço";
