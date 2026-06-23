"use client";
import React, { useState } from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

const categories = ["Electronics", "Furniture", "Clothing", "Books", "Home & Garden"];
const methods = ["Weighted Average", "FIFO", "LIFO"];
const statuses = ["Active", "Dead Stock", "Low Stock"];

const buildValuation = (formData) => {
  const currentStock = Number(formData.currentStock) || 0;
  const unitCost = Number(formData.unitCost) || 0;
  const sellingPrice = Number(formData.sellingPrice) || 0;
  const totalCost = currentStock * unitCost;
  const totalValue = currentStock * sellingPrice;
  const profitMargin = unitCost > 0 ? ((sellingPrice - unitCost) / unitCost) * 100 : 0;
  return {
    productName: formData.productName,
    skuCode: formData.skuCode,
    category: formData.category,
    currentStock,
    unitCost,
    sellingPrice,
    totalCost,
    totalValue,
    profitMargin,
    valuationMethod: formData.valuationMethod,
    status: formData.status,
  };
};

const CreateValuation = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    productName: "",
    skuCode: "",
    category: "",
    currentStock: "",
    unitCost: "",
    sellingPrice: "",
    valuationMethod: "Weighted Average",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.productName || !formData.category || !formData.currentStock || !formData.unitCost || !formData.sellingPrice) {
      alert("Please fill all required fields");
      return;
    }
    onSave(buildValuation(formData));
  };

  return (
    <Grid container spacing={3}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Product Name"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="SKU Code"
          name="skuCode"
          value={formData.skuCode}
          onChange={handleChange}
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Current Stock"
          type="number"
          name="currentStock"
          value={formData.currentStock}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Unit Cost"
          type="number"
          name="unitCost"
          value={formData.unitCost}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Selling Price"
          type="number"
          name="sellingPrice"
          value={formData.sellingPrice}
          onChange={handleChange}
          required
        />
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Valuation Method</InputLabel>
          <Select name="valuationMethod" value={formData.valuationMethod} onChange={handleChange}>
            {methods.map((m) => (
              <MenuItem key={m} value={m}>{m}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={6}>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select name="status" value={formData.status} onChange={handleChange}>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={12} display="flex" justifyContent="flex-end" gap={2}>
        <Button onClick={onClose} variant="outlined" sx={{ transform: "none", textTransform: "none" }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" sx={{ transform: "none", textTransform: "none" }}>
          Save
        </Button>
      </Grid>
    </Grid>
  );
};

export { buildValuation };
export default CreateValuation;
