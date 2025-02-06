import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { customAlphabet } from "nanoid";
import { Floor, Hotel } from "../types";
import { instanceOfMachine, instanceOfRoom, instanceOfSpace } from "../utils";

const generateShortId = customAlphabet(
  "abcdefghijklmnopqrstuvwxyz0123456789",
  6,
);

interface Store {
  hotel: Hotel;
  addFloor: (name: string) => void;
  addRoom: (floorId: string, name: string) => void;
  addSpace: (roomId: string, name: string) => void;
  addMachineToSpace: (spaceId: string, name: string) => void;
  addMachineToRoom: (roomId: string, name: string) => void;
  addMachineToFloor: (floorId: string, name: string) => void;
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
  updateRoomOrder: (
    floorId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  updateFloorOrder: (fromIndex: number, toIndex: number) => void;
  updateSpaceMachineOrder: (
    spaceId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  updateSpaceOrder: (
    roomId: string,
    fromIndex: number,
    toIndex: number,
  ) => void;
  deleteAll: () => void;
}

export const useHotelStore = create(
  persist<Store>(
    (set) => ({
      hotel: { floors: [] },

      addFloor: () =>
        set((state) => ({
          hotel: {
            floors: [
              ...state.hotel.floors,
              {
                id: getNewFloorId(state.hotel),
                rooms: [],
                type: "Piso",
                name: `Piso ${getNewFloorId(state.hotel)}`,
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
                        id: getNewRoomId(floor),
                        spaces: [],
                        type: "Quarto",
                        name: `Quarto ${getNewRoomId(floor)}`,
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
                room.id === roomId && instanceOfRoom(room)
                  ? {
                      ...room,
                      spaces: [
                        ...room.spaces,
                        {
                          id: generateShortId(),
                          name,
                          machines: [],
                          type: "Espaço",
                        },
                      ],
                    }
                  : room,
              ),
            })),
          },
        })),

      addMachineToSpace: (spaceId, name) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => ({
                ...room,
                ...(instanceOfRoom(room) && {
                  spaces: room.spaces.map((space) =>
                    space.id === spaceId && instanceOfSpace(space)
                      ? {
                          ...space,
                          machines: [
                            ...space.machines,
                            {
                              id: generateShortId(),
                              name,
                              type: "Máquina",
                            },
                          ],
                        }
                      : space,
                  ),
                }),
              })),
            })),
          },
        })),

      addMachineToRoom: (roomId, name) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => ({
              ...floor,
              rooms: floor.rooms.map((room) => {
                if (room.id === roomId && instanceOfRoom(room)) {
                  return {
                    ...room,
                    spaces: [
                      ...room.spaces,
                      {
                        id: generateShortId(),
                        name,
                        type: "Máquina",
                      },
                    ],
                  };
                }
                return room;
              }),
            })),
          },
        })),

      addMachineToFloor: (floorId, name) =>
        set((state) => ({
          hotel: {
            floors: state.hotel.floors.map((floor) => {
              if (floor.id === floorId) {
                return {
                  ...floor,
                  rooms: [
                    ...floor.rooms,
                    {
                      id: generateShortId(),
                      name,
                      type: "Máquina",
                    },
                  ],
                };
              }
              return floor;
            }),
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
                ...(instanceOfRoom(room) && {
                  spaces: room.spaces.filter((space) => space.id !== spaceId),
                }),
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
                ...(instanceOfRoom(room) && {
                  spaces: room.spaces.map((space) => {
                    if (instanceOfMachine(space)) {
                      return space;
                    }
                    return {
                      ...space,
                      machines: space.machines.filter(
                        (machine) => machine.id !== machineId,
                      ),
                    };
                  }),
                }),
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
                  if (
                    room.id === id &&
                    (entityType === "room" ||
                      (entityType === "machine" && instanceOfMachine(room)))
                  ) {
                    return { ...room, name: newName };
                  }
                  return {
                    ...room,
                    ...(instanceOfRoom(room) && {
                      spaces: room.spaces.map((space) => {
                        if (entityType === "space" && space.id === id) {
                          return { ...space, name: newName };
                        }
                        if (
                          entityType === "machine" &&
                          instanceOfMachine(space)
                        ) {
                          return { ...space, name: newName };
                        }
                        if (instanceOfSpace(space)) {
                          return {
                            ...space,
                            machines: space.machines.map((machine) =>
                              machine.id === id && entityType === "machine"
                                ? { ...machine, name: newName }
                                : machine,
                            ),
                          };
                        }
                        return space;
                      }),
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
      updateRoomOrder: (floorId: string, fromIndex: number, toIndex: number) =>
        set((state) => {
          const floor = state.hotel.floors.find((f) => f.id === floorId);
          if (!floor) return state;

          const updatedRooms = [...floor.rooms];
          const [movedRoom] = updatedRooms.splice(fromIndex, 1);
          updatedRooms.splice(toIndex, 0, movedRoom);

          return {
            hotel: {
              ...state.hotel,
              floors: state.hotel.floors.map((f) =>
                f.id === floorId ? { ...f, rooms: updatedRooms } : f,
              ),
            },
          };
        }),
      updateFloorOrder: (fromIndex: number, toIndex: number) =>
        set((state) => {
          const updatedFloors = [...state.hotel.floors];
          const [movedFloor] = updatedFloors.splice(fromIndex, 1);
          updatedFloors.splice(toIndex, 0, movedFloor);

          return {
            hotel: {
              ...state.hotel,
              floors: updatedFloors,
            },
          };
        }),
      updateSpaceOrder: (roomId: string, fromIndex: number, toIndex: number) =>
        set((state) => {
          const updatedFloors = state.hotel.floors.map((floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) => {
              if (room.id !== roomId || !instanceOfRoom(room)) return room;
              const updatedSpaces = [...room.spaces];
              const [movedSpace] = updatedSpaces.splice(fromIndex, 1);
              updatedSpaces.splice(toIndex, 0, movedSpace);

              return { ...room, spaces: updatedSpaces };
            }),
          }));
          return {
            hotel: {
              ...state.hotel,
              floors: updatedFloors,
            },
          };
        }),
      updateSpaceMachineOrder: (
        spaceId: string,
        fromIndex: number,
        toIndex: number,
      ) =>
        set((state) => {
          const updatedFloors = state.hotel.floors.map((floor) => ({
            ...floor,
            rooms: floor.rooms.map((room) => ({
              ...room,
              ...(instanceOfRoom(room) && {
                spaces: room.spaces.map((space) => {
                  if (space.id === spaceId && instanceOfSpace(space)) {
                    const updatedMachines = [...space.machines];
                    const [movedMachine] = updatedMachines.splice(fromIndex, 1);
                    updatedMachines.splice(toIndex, 0, movedMachine);

                    return {
                      ...space,
                      machines: updatedMachines,
                    };
                  }
                  return space;
                }),
              }),
            })),
          }));
          return {
            hotel: {
              floors: updatedFloors,
            },
          };
        }),
      deleteAll: () => set({ hotel: { floors: [] } }),
    }),
    {
      name: "hotel-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

const getNewRoomId = (floor: Floor) =>
  Math.max(
    ...floor.rooms.filter(instanceOfRoom).map((r) => +r.id),
    Number(floor.id) * 100,
  ) +
  1 +
  "";

const getNewFloorId = (hotel: Hotel) =>
  Math.max(...hotel.floors.map((f) => +f.id), 0) + 1 + "";
