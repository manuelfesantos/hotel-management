import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useHotelStore } from "../store";

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

  const isLeaf = (node: any): boolean => {
    const childrenNodes = [
      ...(node.rooms || []),
      ...(node.spaces || []),
      ...(node.machines || []),
    ];
    return childrenNodes.length === 0;
  };

  const renderNode = (node: any, depth: number) => {
    const childrenNodes = [
      ...(node.rooms || []),
      ...(node.spaces || []),
      ...(node.machines || []),
    ];

    return (
      <div className="relative">
        <div className="flex items-center gap-2 py-2 -ml-0.5">
          <span className="text-lg">
            {node.type === "Piso"
              ? "🏢"
              : node.type === "Quarto"
                ? "🚪"
                : node.type === "Espaço"
                  ? "🗄"
                  : "⚙️"}
          </span>
          <div>
            <h3 className="font-semibold">
              {node.name ?? `${node.type} ${node.id}`}
            </h3>
          </div>
        </div>

        {childrenNodes.length > 0 && (
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 h-full border-l-2"></div>
            <div className="space-y-4">
              {childrenNodes.map((child: any) => (
                <div key={child.id} className="relative">
                  <span
                    className="absolute -left-6 w-6 border-t-2"
                    style={{
                      top: isLeaf(child) ? "calc(50% + 4px)" : "50%",
                      transform: "translateY(-50%)",
                    }}
                  ></span>
                  {renderNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    generateTree();
    return () => treeRef.current?.remove();
  }, []);

  return (
    <>
      {isGenerating && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          //style={{ backgroundColor: "black", opacity: 0.5 }}
        >
          <div className="p-4 rounded-lg">
            Generating PDF... This may take a moment.
          </div>
        </div>
      )}

      {/* Hidden container for PDF capture */}
      <div className="fixed top-0 left-0 z-[9999]">
        <div ref={treeRef} className="p-8 w-[1123px] min-h-[1587px]">
          <h1 className="text-2xl font-bold mb-8">
            Estrutura de Máquinas do Hotel
          </h1>
          <div className="h-[50px]" />

          {/* Floors start at the beginning of a new page while preserving 3-column layout */}
          <div className="grid grid-cols-3 gap-4">
            {hotel.floors.map((floor: any, index: number) => (
              <div
                key={floor.id}
                className={`p-4 rounded ${
                  index === 0 ? "" : "break-before-page"
                }`}
              >
                {renderNode(floor, 0)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
