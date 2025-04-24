// material-ui
import { useTheme } from '@mui/material/styles';

import { BarChart } from '@mui/x-charts/BarChart';

// ==============================|| MONTHLY BAR CHART ||============================== //

export default function MonthlyBarChart({ data: chartData }) {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 12, fill: theme.palette.text.secondary };
  const monthMap = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'};
  const seriesData = chartData.map(item => parseFloat(item.total));
  const xLabels = chartData.map(item => monthMap[item.month] || item.month);

  return (
    <BarChart
      height={380}
      series={[{ data: seriesData, label: 'Monthly Expenses' }]}
      xAxis={[{ data: xLabels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      leftAxis={[
        { 
          tickMaxStep: 10, 
          tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary } 
        }
      ]}
      slotProps={{ legend: { hidden: false }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}
