'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Grid,
  Typography,
  Skeleton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../lib/api';

// Safely fetch a list endpoint and return its data array (or [] on any failure).
async function fetchList(path) {
  try {
    const res = await fetchWithAuth(path);
    const json = await res.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch (_) {
    return [];
  }
}

const STAT_CONFIG = [
  { key: 'products', label: 'Total Products', icon: Inventory2OutlinedIcon, color: '#1976D2', href: '/item/all-products' },
  { key: 'warehouses', label: 'Warehouses', icon: WarehouseOutlinedIcon, color: '#009688', href: '/warehouse/setup' },
  { key: 'suppliers', label: 'Suppliers', icon: LocalShippingOutlinedIcon, color: '#7E57C2', href: '/supplier' },
  { key: 'customers', label: 'Customers', icon: PeopleAltOutlinedIcon, color: '#EC407A', href: '/customer' },
  { key: 'salesOrders', label: 'Sales Orders', icon: ShoppingCartOutlinedIcon, color: '#FF9800', href: '/sales/orders' },
  { key: 'lowStock', label: 'Low Stock Items', icon: WarningAmberOutlinedIcon, color: '#F44336', href: '/item/all-products' },
];

const QUICK_ACTIONS = [
  { label: 'Add Product', icon: AddCircleOutlineIcon, href: '/item/all-products/create', color: '#1976D2' },
  { label: 'New Sale', icon: ShoppingCartOutlinedIcon, href: '/sales/orders', color: '#FF9800' },
  { label: 'Create Invoice', icon: ReceiptLongOutlinedIcon, href: '/invoices', color: '#009688' },
  { label: 'View Reports', icon: AssessmentOutlinedIcon, href: '/reports/summary', color: '#7E57C2' },
];

// Colors for the stock-status donut: In Stock (green), Low (orange), Out (red).
const STOCK_STATUS_COLORS = ['#4CAF50', '#FF9800', '#F44336'];

const Dashboard = () => {
  const { admin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({});
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [stockStatusData, setStockStatusData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [products, warehouses, suppliers, customers, salesOrders, lowStock] =
        await Promise.all([
          fetchList('/items'),
          fetchList('/warehouses'),
          fetchList('/suppliers'),
          fetchList('/customers'),
          fetchList('/sales/orders'),
          fetchList('/item/low-stock'),
        ]);
      if (!active) return;
      setCounts({
        products: products.length,
        warehouses: warehouses.length,
        suppliers: suppliers.length,
        customers: customers.length,
        salesOrders: salesOrders.length,
        lowStock: lowStock.length,
      });
      setLowStockItems(lowStock.slice(0, 5));
      setRecentProducts(products.slice(0, 5));

      // Stock status breakdown (donut): out of stock / low / healthy.
      let outOfStock = 0;
      let low = 0;
      let healthy = 0;
      products.forEach((p) => {
        const stock = Number(p.stock) || 0;
        const min = Number(p.minStock) || 0;
        if (stock <= 0) outOfStock += 1;
        else if (stock <= min) low += 1;
        else healthy += 1;
      });
      setStockStatusData([
        { name: 'In Stock', value: healthy },
        { name: 'Low Stock', value: low },
        { name: 'Out of Stock', value: outOfStock },
      ]);

      // Top products by stock quantity (bar).
      const top = [...products]
        .sort((a, b) => (Number(b.stock) || 0) - (Number(a.stock) || 0))
        .slice(0, 6)
        .map((p) => ({
          name: (p.productName || p.name || '—').slice(0, 14),
          stock: Number(p.stock) || 0,
        }));
      setTopProductsData(top);

      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const adminName = admin?.name || admin?.email?.split('@')[0] || 'Admin';
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="content-area">
      {/* Welcome banner */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 60%, #009688 100%)',
          borderRadius: '0.75rem',
          padding: { xs: '1.5rem', md: '2rem' },
          color: '#fff',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(25,118,210,0.25)',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: '0.85rem', opacity: 0.85, mb: 0.5 }}>{today}</Typography>
          <Typography sx={{ fontSize: { xs: '1.4rem', md: '1.8rem' }, fontWeight: 700, lineHeight: 1.2 }}>
            {greeting}, {adminName} 👋
          </Typography>
          <Typography sx={{ fontSize: '0.95rem', opacity: 0.9, mt: 0.5 }}>
            Here&apos;s what&apos;s happening in your inventory today.
          </Typography>
        </Box>
        <Avatar
          sx={{
            bgcolor: 'rgba(255,255,255,0.15)',
            width: 64,
            height: 64,
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <Inventory2OutlinedIcon sx={{ fontSize: 34 }} />
        </Avatar>
      </Box>

      {/* Stat cards */}
      <Grid container spacing={2} sx={{ mb: 1 }}>
        {STAT_CONFIG.map((stat) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={stat.key}>
              <Link href={stat.href} style={{ textDecoration: 'none' }}>
                <Box
                  className="dashboard-stat-card"
                  sx={{
                    background: '#fff',
                    border: '1px solid #E0E0E0',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    borderTop: `3px solid ${stat.color}`,
                    height: '100%',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Avatar sx={{ bgcolor: `${stat.color}18`, color: stat.color, width: 42, height: 42 }}>
                      <Icon />
                    </Avatar>
                  </Box>
                  {loading ? (
                    <Skeleton variant="text" width={50} height={40} />
                  ) : (
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#212121', lineHeight: 1.1 }}>
                      {counts[stat.key] ?? 0}
                    </Typography>
                  )}
                  <Typography sx={{ fontSize: '0.8rem', color: '#757575', mt: 0.25 }}>{stat.label}</Typography>
                </Box>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts row */}
      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* Stock status donut */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box className="hrms-card" sx={{ mb: 0, height: '100%' }}>
            <Box className="hrms-card-header">
              <Typography className="hrms-card-title" sx={{ fontSize: '1.05rem' }}>
                Stock Status
              </Typography>
            </Box>
            <Box className="hrms-card-content" sx={{ height: 300 }}>
              {loading ? (
                <Skeleton variant="rounded" width="100%" height={260} />
              ) : stockStatusData.every((d) => d.value === 0) ? (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#757575' }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>No product data to chart yet.</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {stockStatusData.map((entry, i) => (
                        <Cell key={entry.name} fill={STOCK_STATUS_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Top products by stock (bar) */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box className="hrms-card" sx={{ mb: 0, height: '100%' }}>
            <Box className="hrms-card-header">
              <Typography className="hrms-card-title" sx={{ fontSize: '1.05rem' }}>
                Top Products by Stock
              </Typography>
            </Box>
            <Box className="hrms-card-content" sx={{ height: 300 }}>
              {loading ? (
                <Skeleton variant="rounded" width="100%" height={260} />
              ) : topProductsData.length === 0 ? (
                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#757575' }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>No product data to chart yet.</Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topProductsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#757575' }} interval={0} />
                    <YAxis tick={{ fontSize: 11, fill: '#757575' }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'rgba(25,118,210,0.06)' }} />
                    <Bar dataKey="stock" fill="#1976D2" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0.5 }}>
        {/* Low stock alerts */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Box className="hrms-card" sx={{ mb: 0, height: '100%' }}>
            <Box
              className="hrms-card-header"
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <WarningAmberOutlinedIcon sx={{ color: '#F44336' }} />
              <Typography className="hrms-card-title" sx={{ fontSize: '1.05rem' }}>
                Low Stock Alerts
              </Typography>
              {!loading && lowStockItems.length > 0 && (
                <Chip
                  label={`${counts.lowStock} item${counts.lowStock === 1 ? '' : 's'}`}
                  size="small"
                  sx={{ ml: 'auto', bgcolor: 'rgba(244,67,54,0.1)', color: '#F44336', fontWeight: 600 }}
                />
              )}
            </Box>
            <Box className="hrms-card-content" sx={{ p: 0 }}>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <Skeleton key={i} variant="rectangular" height={44} sx={{ m: 1.5, borderRadius: 1 }} />
                ))
              ) : lowStockItems.length === 0 ? (
                <Box sx={{ p: 4, textAlign: 'center', color: '#757575' }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 40, opacity: 0.3 }} />
                  <Typography sx={{ mt: 1, fontSize: '0.9rem' }}>
                    All good! No products are running low on stock.
                  </Typography>
                </Box>
              ) : (
                <Table className="hrms-table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>SKU</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lowStockItems.map((item, i) => (
                      <TableRow key={item._id || i}>
                        <TableCell sx={{ fontWeight: 600 }}>{item.productName || item.name || '—'}</TableCell>
                        <TableCell>{item.SKUcode || item.sku || '—'}</TableCell>
                        <TableCell align="right">
                          <Box
                            className="hrms-badge hrms-badge-error"
                            component="span"
                            sx={{ display: 'inline-flex' }}
                          >
                            {item.stock ?? 0} / {item.minStock ?? 0}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </Box>
        </Grid>

        {/* Quick actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Box className="hrms-card" sx={{ mb: 0, height: '100%' }}>
            <Box className="hrms-card-header">
              <Typography className="hrms-card-title" sx={{ fontSize: '1.05rem' }}>
                Quick Actions
              </Typography>
            </Box>
            <Box className="hrms-card-content">
              <Grid container spacing={1.5}>
                {QUICK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Grid size={{ xs: 6 }} key={action.label}>
                      <Link href={action.href} style={{ textDecoration: 'none' }}>
                        <Box
                          className="dashboard-action-card"
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: 1,
                            p: 1.5,
                            borderRadius: '0.6rem',
                            border: '1px solid #E0E0E0',
                            background: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          <Avatar sx={{ bgcolor: `${action.color}18`, color: action.color, width: 38, height: 38 }}>
                            <Icon fontSize="small" />
                          </Avatar>
                          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#212121' }}>
                            {action.label}
                          </Typography>
                        </Box>
                      </Link>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Recent products */}
      <Box className="hrms-card" sx={{ mt: 2, mb: 0 }}>
        <Box className="hrms-card-header" sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography className="hrms-card-title" sx={{ fontSize: '1.05rem' }}>
            Recent Products
          </Typography>
          <Link href="/item/all-products" style={{ marginLeft: 'auto', textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#1976D2', fontSize: '0.85rem', fontWeight: 600 }}>
              View all <ArrowForwardIcon sx={{ fontSize: 16 }} />
            </Box>
          </Link>
        </Box>
        <Box className="hrms-card-content" sx={{ p: 0 }}>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={44} sx={{ m: 1.5, borderRadius: 1 }} />
            ))
          ) : recentProducts.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: '#757575' }}>
              <Typography sx={{ fontSize: '0.9rem' }}>No products yet. Add your first product to get started.</Typography>
            </Box>
          ) : (
            <Table className="hrms-table">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell align="right">Selling Price</TableCell>
                  <TableCell align="right">Stock</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentProducts.map((item, i) => (
                  <TableRow key={item._id || i}>
                    <TableCell sx={{ fontWeight: 600 }}>{item.productName || item.name || '—'}</TableCell>
                    <TableCell>{item.SKUcode || item.sku || '—'}</TableCell>
                    <TableCell>{item.brand || '—'}</TableCell>
                    <TableCell align="right">
                      {item.sellingPrice != null ? `₹${Number(item.sellingPrice).toLocaleString('en-IN')}` : '—'}
                    </TableCell>
                    <TableCell align="right">{item.stock ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
