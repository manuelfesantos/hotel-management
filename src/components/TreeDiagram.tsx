import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useHotelStore } from "../store";

interface TreeNodeProps {
  node: any;
}

/**
 * Recursive component for rendering a node in a horizontal tree style.
 */
const TreeNode = ({ node }: TreeNodeProps) => {
  // Gather all possible children from different node properties.
  const childrenNodes = [
    ...(node.rooms || []),
    ...(node.spaces || []),
    ...(node.machines || []),
  ];

  return (
    <div className="flex flex-col items-center relative">
      {/* Node box */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-2 bg-white border rounded shadow">
        <span className="text-2xl mb-1">
          {node.type === "Piso"
            ? "🏢"
            : node.type === "Quarto"
              ? "🚪"
              : node.type === "Espaço"
                ? "🗄"
                : "⚙️"}
        </span>
        <div className="font-semibold text-center">
          {node.name ?? `${node.type} ${node.id}`}
        </div>
      </div>

      {/* Render connectors and children if any */}
      {childrenNodes.length > 0 && (
        <>
          {/* Vertical line from current node to the horizontal connector */}
          <div className="w-px h-6 bg-gray-500"></div>

          {/* Horizontal line connecting all children */}
          {childrenNodes.length > 1 && (
            <div className="w-full relative flex justify-center items-center">
              <div className="absolute top-0 w-full h-px bg-gray-500"></div>
            </div>
          )}

          {/* Row of children */}
          <div className="flex justify-center gap-8">
            {childrenNodes.map((child: any) => (
              <div
                key={child.id}
                className="flex flex-col items-center relative"
              >
                {/* Vertical line from the horizontal connector to the child */}
                <div className="w-px h-6 bg-gray-500"></div>
                <TreeNode node={child} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const TreeDiagram = ({ onClose }: { onClose: () => void }) => {
  const { hotel } = useHotelStore();
  const treeRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * Generates the PDF by capturing the hidden tree container.
   * Orientation is set to landscape.
   */
  const generateTree = async () => {
    if (!treeRef.current) return;
    setIsGenerating(true);

    try {
      // Create the PDF in landscape mode
      const pdf = new jsPDF("landscape", "pt", "a4");
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

        remainingHeight -= sectionHeight;
        if (remainingHeight > 0) {
          pdf.addPage();
          position += sectionHeight;
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

  useEffect(() => {
    generateTree();
    return () => {
      if (treeRef.current) {
        treeRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isGenerating && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="p-4 rounded-lg text-white">
            A gerar PDF... Isto pode durar um tempinho.
          </div>
        </div>
      )}

      {/* Hidden container for PDF capture */}
      <div className="fixed top-0 left-0 z-[9999] opacity-0 pointer-events-none">
        <div
          ref={treeRef}
          className="p-8 min-w-[1123px] min-h-[1587px] bg-gray-50"
        >
          <h1 className="text-3xl font-bold mb-8 text-center">
            Estrutura de Máquinas do Hotel
          </h1>

          {/* Each floor is rendered as its own tree. Adjust as necessary if you have more hierarchy. */}
          <div className="space-y-12">
            {hotel.floors.map((floor: any, index: number) => (
              <div
                key={floor.id}
                className={`${index === 0 ? "" : "break-before-page"}`}
              >
                <h2 className="text-2xl font-semibold text-center mb-4">
                  {floor.name ?? `Piso ${floor.id}`}
                </h2>
                <TreeNode node={floor} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
