import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";

const generateShortId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  6,
);

interface Machine {
  id: string;
  name: string;
}

export const SpaceNameEnum = {
  KITCHEN: "Cozinha",
  LIVING_ROOM: "Sala",
  BEDROOM: "Quarto",
  BATHROOM: "Casa de Banho",
} as const;

interface Space {
  id: string;
  name: string;
  machines: Machine[];
  type: (typeof SpaceNameEnum)[keyof typeof SpaceNameEnum];
}

interface Room {
  id: string;
  spaces: Space[];
  type: "Quarto";
}

interface Floor {
  id: string;
  rooms: Room[];
  type: "Piso";
}

interface Hotel {
  floors: Floor[];
}

interface HotelStore {
  hotel: Hotel;
  addFloor: (name: string) => void;
  addRoom: (floorId: string, name: string) => void;
  addSpace: (roomId: string, name: string) => void;
  addMachine: (spaceId: string, name: string) => void;
  deleteFloor: (floorId: string) => void;
  deleteRoom: (roomId: string) => void;
  deleteSpace: (spaceId: string) => void;
  deleteMachine: (machineId: string) => void;
  renameEntity: (
    entityType: "floor" | "room" | "space" | "machine",
    id: string,
    newName: string,
  ) => void;
  importData: (data: Hotel) => void;
  exportData: () => void;
}

export const useHotelStore = create(
  persist<HotelStore>(
    (set) => ({
      hotel: { floors: [] },

      addFloor: () =>
        set((state) => ({
          hotel: {
            floors: [
              ...state.hotel.floors,
              {
                id: (state.hotel.floors.length + 1).toString(),
                rooms: [],
                type: "Piso",
              },
            ],
          },
        })),

      addRoom: (floorId) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) =>
              floor.id === floorId
                ? {
                    ...floor,
                    rooms: [
                      ...floor.rooms,
                      {
                        id:
                          floorId +
                          (floor.rooms.length + 1 > 9 ? "" : "0") +
                          (floor.rooms.length + 1),
                        spaces: [],
                        type: "Quarto",
                      },
                    ],
                  }
                : floor,
            ),
          },
        })),

      addSpace: (roomId, name) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) =>
                room.id === roomId
                  ? {
                      ...room,
                      spaces: [
                        ...room.spaces,
                        {
                          id: generateShortId(),
                          name,
                          machines: [],
                          type: name as (typeof SpaceNameEnum)[keyof typeof SpaceNameEnum],
                        },
                      ],
                    }
                  : room,
              ),
            })),
          },
        })),

      addMachine: (spaceId, name) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => ({
                ...room,
                spaces: room.spaces.map((space) =>
                  space.id === spaceId
                    ? {
                        ...space,
                        machines: [
                          ...space.machines,
                          {
                            id: generateShortId(),
                            name,
                          },
                        ],
                      }
                    : space,
                ),
              })),
            })),
          },
        })),

      deleteFloor: (floorId) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.filter((floor) => floor.id !== floorId),
          },
        })),

      deleteRoom: (roomId) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.filter((room) => room.id !== roomId),
            })),
          },
        })),

      deleteSpace: (spaceId) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => ({
                ...room,
                spaces: room.spaces.filter((space) => space.id !== spaceId),
              })),
            })),
          },
        })),

      deleteMachine: (machineId) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => ({
                ...room,
                spaces: room.spaces.map((space) => ({
                  ...space,
                  machines: space.machines.filter(
                    (machine) => machine.id !== machineId,
                  ),
                })),
              })),
            })),
          },
        })),

      renameEntity: (entityType, id, newName) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => {
              if (entityType === "floor" && floor.id === id) {
                return { ...floor, name: newName };
              }
              return {
                ...floor,
                rooms: floor.rooms.map((room) => {
                  if (entityType === "room" && room.id === id) {
                    return { ...room, name: newName };
                  }
                  return {
                    ...room,
                    spaces: room.spaces.map((space) => {
                      if (entityType === "space" && space.id === id) {
                        return { ...space, name: newName };
                      }
                      return {
                        ...space,
                        machines: space.machines.map((machine) =>
                          machine.id === id && entityType === "machine"
                            ? { ...machine, name: newName }
                            : machine,
                        ),
                      };
                    }),
                  };
                }),
              };
            }),
          },
        })),

      importData: (data) => set({ hotel: data }),

      exportData: () => {
        const data = useHotelStore.getState().hotel;
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "hotel-structure.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
    }),
    {
      name: "hotel-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
