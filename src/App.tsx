import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Divider
} from '@mui/material';
import { BarChart } from './components/BarChart';
import { DoughnutChart } from './components/DoughnutChart';

interface DataItem {
  count: number;
  acv: number;
  closed_fiscal_quarter: string;
  Cust_Type: string;
}

interface DashboardData {
  accountIndustry: DataItem[];
  acvRange: DataItem[];
  customerType: DataItem[];
  team: DataItem[];
}

function App() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  const totalACV = data?.customerType.reduce((sum, item) => sum + item.acv, 0) || 0;

  // Grouped data for doughnut chart
  const groupedCustomerTypeData = data?.customerType.reduce((acc, item) => {
    const key = item.Cust_Type;
    if (!acc[key]) {
      acc[key] = { Cust_Type: key, acv: 0 };
    }
    acc[key].acv += item.acv;
    return acc;
  }, {} as Record<string, { Cust_Type: string; acv: number }>);

  // Convert to array format
  const groupedDoughnutData = Object.values(groupedCustomerTypeData);
  const totalGroupedACV = groupedDoughnutData.reduce((sum, item) => sum + item.acv, 0);


  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        📊 Analytics Dashboard
      </Typography>

      <Grid container spacing={4}>
        {/* Customer Type Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={500} mb={2}>
              Customer Type Analysis
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                {data && <BarChart data={data.customerType} type="stacked" />}
              </Grid>
              <Grid item xs={12} md={4}>
                {groupedDoughnutData && (
                  <DoughnutChart data={groupedDoughnutData} total={totalGroupedACV} />
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Data Table Section */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
              Breakdown Table
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Fiscal Quarter</b></TableCell>
                    <TableCell><b>Customer Type</b></TableCell>
                    <TableCell align="right"><b># of Opps</b></TableCell>
                    <TableCell align="right"><b>ACV</b></TableCell>
                    <TableCell align="right"><b>% of Total</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.customerType.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.closed_fiscal_quarter}</TableCell>
                      <TableCell>{row.Cust_Type}</TableCell>
                      <TableCell align="right">{row.count}</TableCell>
                      <TableCell align="right">${row.acv.toLocaleString()}</TableCell>
                      <TableCell align="right">
                        {((row.acv / totalACV) * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
