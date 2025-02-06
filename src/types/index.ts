export interface Machine {
  id: string;
  name: string;
  type: "Máquina";
}

export const ItemTypeEnum = {
  ROOM: "Quarto",
  SPACE: "Espaço",
  MACHINE: "Máquina",
  FLOOR: "Piso",
} as const;

export type ItemType = (typeof ItemTypeEnum)[keyof typeof ItemTypeEnum];

export interface Space {
  id: string;
  name: string;
  machines: Machine[];
  type: "Espaço";
}

export interface Room {
  id: string;
  spaces: (Space | Machine)[];
  type: "Quarto";
  name: string;
}

export interface Floor {
  id: string;
  rooms: (Room | Machine)[];
  type: "Piso";
  name: string;
}

export interface Hotel {
  floors: Floor[];
}
