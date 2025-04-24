// material-ui
import { useTheme } from '@mui/material/styles';

import { chartsGridClasses, LineChart } from '@mui/x-charts';

const monthMap = {1:'Jan',2:'Feb',3:'Mar',4:'Apr',5:'May',6:'Jun',7:'Jul',8:'Aug',9:'Sep',10:'Oct',11:'Nov',12:'Dec'};

// ==============================|| REPORT AREA CHART ||============================== //

export default function ReportAreaChart({ data: chartData }) {
  const theme = useTheme();
  const axisFonstyle = { fontSize: 12, fill: theme.palette.text.secondary };
  const seriesData = chartData.map(item => parseFloat(item.total));
  const xLabels = chartData.map(item => monthMap[item.month] || item.month);

  return (
    <LineChart
      grid={{ horizontal: true }}
      xAxis={[{ data: xLabels, scaleType: 'point', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[
        { 
          tickMaxStep: 10, 
          tickLabelStyle: { fontSize: 12, fill: theme.palette.text.secondary } 
        }
      ]}
      leftAxis={null}
      series={[
        {
          data: seriesData,
          showMark: false,
          id: 'ReportAreaChart',
          color: theme.palette.warning.main,
          label: 'Total Receivings'
        }
      ]}
      slotProps={{ legend: { hidden: false } }}
      height={340}
      margin={{ top: 30, bottom: 50, left: 20, right: 20 }}
      sx={{
        '& .MuiLineElement-root': { strokeWidth: 1 },
        [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' }
      }}
    />
  );
}
