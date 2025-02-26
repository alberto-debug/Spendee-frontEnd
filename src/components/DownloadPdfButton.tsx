import React from "react";
import { Button, Icon, useMediaQuery } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DownloadPdfButtonProps {
  transactions: any[];
  balance: number;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({
  transactions,
  balance,
}) => {
  const handleDownloadPdf = () => {
    const doc = new jsPDF();

    // Add balance information
    doc.text("Balance: $" + balance.toFixed(2), 10, 10);

    // Add transactions table
    const tableData = [
      ["Date", "Description", "Type", "Amount"],
      ...transactions.map((transaction) => [
        new Date(transaction.date).toLocaleDateString(),
        transaction.description,
        transaction.type,
        transaction.type === "INCOME"
          ? `+$${transaction.amount}`
          : `-$${transaction.amount}`,
      ]),
    ];

    autoTable(doc, {
      head: [tableData[0]],
      body: tableData.slice(1),
      startY: 20,
    });

    doc.save("transactions.pdf");
  };

  // Responsive font size using Chakra UI's useMediaQuery hook
  const [isSmallScreen] = useMediaQuery("(max-width: 600px)");
  const fontSize = isSmallScreen ? "sm" : "md";

  return (
    <Button
      bg="black"
      border="1px solid #1a1a1d"
      color="white"
      borderRadius="10px"
      _hover={{ bg: "#0C0F15" }}
      _active={{ bg: "#1a1a1d" }}
      onClick={handleDownloadPdf}
      leftIcon={
        <Icon
          as={FaDownload}
          color="blue.500"
          boxSize={{ base: "16px", md: "20px", lg: "24px" }}
        />
      }
      size="lg"
      height={{ base: "60px", md: "75px", lg: "90px" }}
      width={{ base: "100px", md: "115px", lg: "130px" }}
      fontSize={{ base: "12px", md: "14px", lg: "16px" }}
    >
      Download
    </Button>
  );
};

export default DownloadPdfButton;
