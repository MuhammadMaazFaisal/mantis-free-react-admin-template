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
      {/* row 1 - Summary Cards */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard Overview</Typography>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce 
          title="Total Products" 
          count={data.summary.total_products} 
         
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce 
          title="Total Receivings" 
          count={data.summary.total_receivings} 
         
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce 
          title="Total Processings" 
          count={data.summary.total_processings} 
         
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce 
          title="Business Partners" 
          count={data.summary.total_parties} 
         
        />
      </Grid>

      {/* row 2 - Financial Overview */}
      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard sx={{ height: '100%' }}>
          <Typography variant="h5" gutterBottom>Financial Overview</Typography>
          <Grid container spacing={3}>
            <Grid size={6}>
              <Typography variant="subtitle1">Total Expenses</Typography>
              <Typography variant="h4">${data.financials.total_expenses}</Typography>
            </Grid>
            <Grid size={6}>
              <Typography variant="subtitle1">Total Payments Received</Typography>
              <Typography variant="h4">${data.financials.total_payments}</Typography>
            </Grid>
          </Grid>
          <MonthlyBarChart data={data.charts.monthly_expenses} />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard>
          <Typography variant="h5" gutterBottom>Recent Expenses</Typography>
          <List>
            {data.financials.recent_expenses.map((expense) => (
              <ListItem key={expense.id} divider>
                <ListItemText
                  primary={expense.reference}
                  secondary={`${expense.date} - $${expense.total}`}
                />
              </ListItem>
            ))}
          </List>
        </MainCard>
      </Grid>

      {/* row 3 - Inventory Activity */}
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Typography variant="h5" gutterBottom>Recent Receivings</Typography>
          <OrdersTable 
            data={data.inventory.recent_receivings.map(receiving => ({
              id: receiving.id,
              date: receiving.arrival_date,
              reference: receiving.lot_number,
              amount: receiving.grand_total,
              items: receiving.details.length
            }))}
          />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Typography variant="h5" gutterBottom>Recent Processings</Typography>
          <ReportAreaChart data={data.charts.monthly_receivings} />
        </MainCard>
      </Grid>
    </Grid>
  );
}

// Updated OrdersTable component to use real data
function OrdersTable({ data }) {
  return (
    <Box>
      <List>
        {data.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText
              primary={`#${item.id} - ${item.reference}`}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {item.date}
                  </Typography>
                  {` — ${item.items} items, $${item.amount}`}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}