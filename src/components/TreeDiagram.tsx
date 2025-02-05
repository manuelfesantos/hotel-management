import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useHotelStore } from "../hooks/HotelStore";

export const TreeDiagram = ({ onClose }: { onClose: () => void }) => {
  const { hotel } = useHotelStore();
  const treeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateTree = async () => {
    if (!treeRef.current) return;
    setIsGenerating(true);

    try {
      const pdf = new jsPDF("portrait", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const canvas = await html2canvas(treeRef.current, {
        scale: 2,
        useCORS: true,
        logging: true,
        scrollY: -window.scrollY,
      });

      const imgWidth = pageWidth - 40;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      let remainingHeight = imgHeight;

      // Split image into multiple pages
      while (remainingHeight > 0) {
        const sectionHeight = Math.min(remainingHeight, pageHeight - 20);
        const sectionCanvas = document.createElement("canvas");
        const ctx = sectionCanvas.getContext("2d")!;

        sectionCanvas.width = canvas.width;
        sectionCanvas.height = (sectionHeight * canvas.width) / imgWidth;

        ctx.drawImage(
          canvas,
          0,
          position * (canvas.height / imgHeight),
          canvas.width,
          sectionCanvas.height,
          0,
          0,
          canvas.width,
          sectionCanvas.height,
        );

        pdf.addImage(
          sectionCanvas.toDataURL("image/png"),
          "PNG",
          20,
          10,
          imgWidth,
          sectionHeight,
        );

        if (remainingHeight > sectionHeight) {
          pdf.addPage();
          position += sectionHeight;
          remainingHeight -= sectionHeight;
        } else {
          remainingHeight = 0;
        }
      }

      pdf.save("hotel-structure.pdf");
    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  const renderNode = (node: any, depth: number, isLast: boolean) => (
    <div
      className={`relative ${depth > 0 ? "ml-12" : ""} ${!isLast ? "mb-6" : ""}`}
      key={node.id}
    >
      {/* Node content */}
      <div className="flex items-start">
        <div className={`p-4 rounded-lg`}>
          <div className="flex items-center gap-2">
            <span
              className={`${
                depth === 0
                  ? "w-[30px]"
                  : depth === 1
                    ? "w-[60px]"
                    : depth === 2
                      ? "w-[90px]"
                      : "w-[120px]"
              }`}
            />
            <span className={`text-lg`}>
              {depth === 0
                ? "🏢"
                : depth === 1
                  ? "🚪"
                  : depth === 2
                    ? "🗄️"
                    : "⚙️"}
            </span>
            <div>
              <h3 className="font-semibold">
                {node.name ?? `${node.type} ${node.id}`}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Children */}
      {node.rooms?.map((child: any, index: number) =>
        renderNode(child, depth + 1, index === node.rooms.length - 1),
      )}
      {node.spaces?.map((child: any, index: number) =>
        renderNode(child, depth + 1, index === node.spaces.length - 1),
      )}
      {node.machines?.map((child: any, index: number) =>
        renderNode(child, depth + 1, index === node.machines.length - 1),
      )}
    </div>
  );

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="p-4 rounded-lg">
            Generating PDF... This may take a moment
          </div>
        </div>
      )}

      {/* Temporary visible container for capture */}
      <div className="fixed top-0 left-0 z-[9999]">
        <div
          ref={treeRef}
          className="p-8 w-[1123px] min-h-[1587px]" // A4 dimensions in pixels (landscape)
        >
          <h1 className="text-2xl font-bold mb-8">
            Estrutura de Máquinas do Hotel
          </h1>
          <div className={"h-[50px]"} />
          {hotel.floors.map((floor, index) =>
            renderNode(floor, 0, index === hotel.floors.length - 1),
          )}
        </div>
      </div>

      {useEffect(() => {
        generateTree();
        return () => treeRef.current?.remove();
      }, [])}
    </>
  );
};
