"use client";
import React from "react";
import { Grid, Typography, Chip } from "@mui/material";

const getMarginColor = (margin) => {
  if (margin >= 30) return { backgroundColor: "#e8f5e8", color: "#2e7d32" };
  if (margin >= 20) return { backgroundColor: "#e3f2fd", color: "#1976d2" };
  if (margin >= 10) return { backgroundColor: "#fff3e0", color: "#f57c00" };
  return { backgroundColor: "#ffebee", color: "#d32f2f" };
};

const Field = ({ label, value }) => (
  <Grid size={6}>
    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ mb: 2 }}>
      {value}
    </Typography>
  </Grid>
);

const ViewValuation = ({ valuationData }) => {
  if (!valuationData) return null;

  return (
    <Grid container spacing={3}>
      <Field label="Product Name" value={valuationData.productName} />
      <Field label="SKU Code" value={valuationData.skuCode || "-"} />
      <Field label="Category" value={valuationData.category} />
      <Field label="Current Stock" value={valuationData.currentStock} />
      <Field label="Unit Cost" value={`₹${Number(valuationData.unitCost || 0).toLocaleString()}`} />
      <Field label="Selling Price" value={`₹${Number(valuationData.sellingPrice || 0).toLocaleString()}`} />
      <Field label="Total Cost" value={`₹${Number(valuationData.totalCost || 0).toLocaleString()}`} />
      <Field label="Total Value" value={`₹${Number(valuationData.totalValue || 0).toLocaleString()}`} />
      <Field label="Valuation Method" value={valuationData.valuationMethod || "-"} />
      <Field label="Status" value={valuationData.status} />
      <Grid size={6}>
        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold" }}>
          Profit Margin
        </Typography>
        <Chip
          label={`${Number(valuationData.profitMargin || 0).toFixed(2)}%`}
          size="small"
          sx={{ ...getMarginColor(valuationData.profitMargin || 0), fontWeight: 500, mb: 2 }}
        />
      </Grid>
    </Grid>
  );
};

export default ViewValuation;
