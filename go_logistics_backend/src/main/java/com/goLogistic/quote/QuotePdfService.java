package com.goLogistic.quote;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class QuotePdfService {

    public byte[] generatePdf(Quote quote) {

        try {
            ByteArrayOutputStream output =
                new ByteArrayOutputStream();

            Document document = new Document();

            PdfWriter.getInstance(
                document,
                output
            );

            document.open();

            document.add(
                new Paragraph("GO LOGISTICS")
            );

            document.add(
                new Paragraph("Quotation")
            );

            document.add(
                new Paragraph(
                    "Quote ID: " +
                    quote.getId()
                )
            );

            document.add(
                new Paragraph(
                    "Status: " +
                    quote.getStatus()
                )
            );

            document.add(
                new Paragraph(" ")
            );

            PdfPTable table =
                new PdfPTable(2);

            addRow(
                table,
                "Customer",
                quote.getCustomer().getName()
            );

            addRow(
                table,
                "Pickup",
                quote.getPickupLocation()
            );

            addRow(
                table,
                "Delivery",
                quote.getDeliveryLocation()
            );

            addRow(
                table,
                "Cargo",
                quote.getCargoType()
            );

            addRow(
                table,
                "Weight",
                quote.getWeight()
            );

            addRow(
                table,
                "Vehicle",
                quote.getVehicleCategory()
            );

            addRow(
                table,
                "Body Type",
                quote.getBodyType()
            );

            addRow(
                table,
                "Container Size",
                quote.getContainerSize()
            );

            addRow(
                table,
                "Pickup Date",
                quote.getPickupDate().toString()
            );

            addRow(
                table,
                "Valid Until",
                quote.getValidUntil().toString()
            );

            addRow(
                table,
                "Transportation",
                quote.getTransportationCharge()
                    .toString()
            );

            addRow(
                table,
                "Handling",
                quote.getHandlingCharge()
                    .toString()
            );

            addRow(
                table,
                "Toll",
                quote.getTollCharge()
                    .toString()
            );

            addRow(
                table,
                "Other Charges",
                quote.getOtherCharges()
                    .toString()
            );

            addRow(
                table,
                "Total Amount",
                quote.getTotalAmount()
                    .toString()
            );

            document.add(table);

            document.close();

            return output.toByteArray();

        } catch (Exception e) {
            throw new IllegalStateException(
                "Failed to generate quote PDF",
                e
            );
        }
    }

    private void addRow(
        PdfPTable table,
        String key,
        String value
    ) {
        table.addCell(key);
        table.addCell(
            value == null ? "-" : value
        );
    }
}