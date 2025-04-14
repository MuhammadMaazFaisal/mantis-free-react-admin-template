// project imports
import NavCard from './NavCard';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { useGetMenuMaster } from 'api/menu';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <SimpleBar 
        sx={{ 
          '& .simplebar-content': { 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%'
          },
          height: 'calc(100vh - 60px)', // Subtract header height
          overflowX: 'hidden',
          '& .simplebar-track.simplebar-vertical': {
            width: '8px'
          }
        }}
      >
        <Navigation />
        {/* Note: removed any potential NavCard or other components that might add extra space */}
      </SimpleBar>
    </>
  );
}
