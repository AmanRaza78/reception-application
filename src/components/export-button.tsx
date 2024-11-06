"use client"
import { Button } from "./ui/button";

export default function ExportButton() {
  const handleExport = async () => {
    try {
      // Call the server to export the CSV
      const response = await fetch("/api/export-csv");

      if (!response.ok) {
        throw new Error("Failed to export CSV");
      }

      // Create a link and trigger a download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "visitors.csv";  // File name for download
      document.body.appendChild(a); // Append to body
      a.click();                    // Trigger the download
      a.remove();                   // Cleanup

    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  return (
    <Button onClick={handleExport}>
      Export Visitors to CSV
    </Button>
  );
}
