import { HotelPage } from "./components/HotelPage.tsx";
import { FloorPage } from "./components/FloorPage.tsx";
import { RoomPage } from "./components/RoomPage.tsx";
import { SpacePage } from "./components/SpacePage.tsx";
import { NotFoundPage } from "./components/NotFoundPage.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <div
      className={"w-screen h-screen flex flex-col items-center justify-center"}
    >
      <div className={"w-[95%] h-[95%]"}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HotelPage />} />
            <Route path="/floors/:floorId" element={<FloorPage />} />
            <Route
              path="/floors/:floorId/rooms/:roomId"
              element={<RoomPage />}
            />
            <Route
              path="/floors/:floorId/rooms/:roomId/spaces/:spaceId"
              element={<SpacePage />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
