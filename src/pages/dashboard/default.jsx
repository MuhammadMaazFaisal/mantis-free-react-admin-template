import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { useGetDashboardDataQuery } from '../../store/services/dashboard';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';

export default function DashboardDefault() {
  const { data, error, isLoading } = useGetDashboardDataQuery();

  if (isLoading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (error || !data) {
    return <Typography>Error loading dashboard data</Typography>;
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* Row 1 - Summary Cards */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard Overview</Typography>
      </Grid>
      <Grid container size={12} spacing={2.75}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticEcommerce title="Total Products" count={data.summary.total_products} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticEcommerce title="Total Receivings" count={data.summary.total_receivings} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticEcommerce title="Total Processings" count={data.summary.total_processings} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticEcommerce title="Business Partners" count={data.summary.total_parties} />
        </Grid>
      </Grid>

      {/* Row 2 - Charts side by side */}
      <Grid container size={12} spacing={2.75}>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard sx={{ height: '100%' }}>
            <Typography variant="h5" gutterBottom>Monthly Expenses</Typography>
            <MonthlyBarChart data={data.charts.monthly_expenses} />
          </MainCard>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard sx={{ height: '100%' }}>
            <Typography variant="h5" gutterBottom>Monthly Receivings</Typography>
            <ReportAreaChart data={data.charts.monthly_receivings} />
          </MainCard>
        </Grid>
      </Grid>

      {/* Row 3 - Three tables side by side */}
      <Grid container size={12} spacing={2.75}>
        {/* Recent Expenses */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard sx={{ height: '100%' }}>
            <Typography variant="h5" gutterBottom>Recent Expenses</Typography>
            <List>
              {data.financials.recent_expenses.map((expense) => (
                <ListItem key={expense.id} divider>
                  <ListItemText
                    primary={`Expense: ${expense.reference}`}
                    secondary={`Date: ${expense.date} | Total: $${expense.total}`}
                  />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>

        {/* Recent Receivings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard sx={{ height: '100%' }}>
            <Typography variant="h5" gutterBottom>Recent Receivings</Typography>
            <List>
              {data.inventory.recent_receivings.map((receiving) => (
                <ListItem key={receiving.id} divider>
                  <ListItemText
                    primary={`Lot: ${receiving.lot_number}`}
                    secondary={`Arrival: ${receiving.arrival_date} | Grand Total: $${receiving.grand_total}`}
                  />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>

        {/* Recent Processings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <MainCard sx={{ height: '100%' }}>
            <Typography variant="h5" gutterBottom>Recent Processings</Typography>
            <List>
              {data.inventory.recent_processings.map((processing) => (
                <ListItem key={processing.id} divider>
                  <ListItemText
                    primary={`Processing: ${processing.description}`}
                    secondary={`Date: ${processing.date} | Charges: $${processing.charges_total}`}
                  />
                </ListItem>
              ))}
            </List>
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}