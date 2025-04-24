import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import ViewDetails from '../../components/ViewDetails';
import { 
  useChartsOfAccountsQuery, 
  useAddChartOfAccountMutation, 
  useUpdateChartOfAccountMutation,
  useDeleteChartOfAccountMutation 
} from '../../store/services/settings';

const ChartsOfAccounts = () => {
  const { data: chartsData = [], isLoading, isError, error, refetch } = useChartsOfAccountsQuery();
  const [addChartOfAccount] = useAddChartOfAccountMutation();
  const [updateChartOfAccount] = useUpdateChartOfAccountMutation();
  const [deleteChartOfAccount] = useDeleteChartOfAccountMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    nature: '',
    parent_id: '',
    account_code: '',
    account_name: '',
    is_transaction_account: false,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();

  const fields = [
    {
      name: 'nature',
      label: 'Nature',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        { value: 'A', label: 'Asset' },
        { value: 'L', label: 'Liability' },
        { value: 'E', label: 'Equity' },
        { value: 'R', label: 'Revenue' },
        { value: 'X', label: 'Expense' },
      ],
      required: true,
      sm: 6,
    },
    {
      name: 'parent_id',
      label: 'Parent Account',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        ...chartsData.map(account => ({
          value: account.id,
          label: `${account.account_code} - ${account.account_name}`
        }))
      ],
      sm: 6,
    },
    { name: 'account_code', label: 'Account Code', required: true, sm: 6 },
    { name: 'account_name', label: 'Account Name', required: true, sm: 6 },
    {
      name: 'is_transaction_account',
      label: 'Is Transaction Account',
      type: 'checkbox',
      sm: 6,
    },
  ];

  const viewFields = [
    { name: 'nature', label: 'Nature' },
    { 
      name: 'parent_id', 
      label: 'Parent Account', 
      render: (value) => {
         let parent = typeof value === 'object' && value !== null ? value : chartsData.find(a => a.id === value);
         return parent ? `${parent.account_code} - ${parent.account_name}` : '-';
      }
    },
    { name: 'account_code', label: 'Account Code' },
    { name: 'account_name', label: 'Account Name' },
    { name: 'is_transaction_account', label: 'Is Transaction Account', render: (value) => value ? 'Yes' : 'No' },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'nature', label: 'Nature' },
    { 
      id: 'parent_id', 
      label: 'Parent Account',
      format: (value, row) => {
        let parent = typeof value === 'object' && value !== null ? value : chartsData.find(a => a.id === value);
        return parent ? `${parent.account_code || '-'} - ${parent.account_name || '-'}` : '-';
      }
    },
    { id: 'account_code', label: 'Account Code' },
    { id: 'account_name', label: 'Account Name' },
    {
      id: 'is_transaction_account',
      label: 'Is Transaction Account',
      format: (value) => (value ? 'Yes' : 'No'),
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, account = null) => {
    setModalMode(mode);
    setSelectedAccount(account);
    if (account) {
      setFormData(account);
    } else {
      setFormData({
        nature: '',
        parent_id: '',
        account_code: '',
        account_name: '',
        is_transaction_account: false,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAccount(null);
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        nature: '',
        parent_id: '',
        account_code: '',
        account_name: '',
        is_transaction_account: false,
      });
    } else {
      const { name, type, value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const { id, ...payload } = formData;  // remove id from payload
      if (modalMode === 'add') {
        await addChartOfAccount(payload).unwrap();
        toast.success('Chart of Account created successfully');
      } else {
        await updateChartOfAccount({ id: selectedAccount.id, ...payload }).unwrap();
        toast.success('Chart of Account updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.data?.message || 'Operation failed');
    }
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteChartOfAccount(itemToDelete.id).unwrap();
      toast.success('Chart of Account deleted successfully');
      await refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Delete failed');
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography color="error">Error: {error.data?.message || 'Failed to load data'}</Typography>;

  return (
    <Box>
      {viewItem ? (
        <>
          <ViewDetails data={viewItem} title={`Chart of Account Details - ID ${viewItem.id}`} fields={viewFields} />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => setViewItem(null)}>
              Back to Chart List
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Charts of Accounts</Typography>
            <Button
              variant="contained"
              startIcon={<PlusOutlined />}
              onClick={() => handleOpenModal('add')}
            >
              Add new
            </Button>
          </Box>
          <SharedTable
            columns={columns}
            data={chartsData}
            onView={(account) => setViewItem(account)}
            onEdit={(account) => {
              tableRef.current = null;
              handleOpenModal('edit', account);
            }}
            onDelete={handleDelete}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={chartsData.length}
            tableRef={tableRef}
          />
          <SharedModal
            open={modalOpen}
            onClose={handleCloseModal}
            title={modalMode === 'add' ? 'Charts of Accounts, Add new' : 'Edit Chart of Account'}
            formData={formData}
            onChange={handleFormChange}
            onSubmit={handleSubmit}
            mode={modalMode}
            fields={fields}
          />
          {/* Delete confirmation dialog remains unchanged */}
          {deleteConfirmOpen && (
            <Box sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1300,
            }}>
              <Box sx={{
                backgroundColor: 'background.paper',
                p: 4,
                borderRadius: 1,
                maxWidth: 400,
                width: '100%',
              }}>
                <Typography variant="h6" gutterBottom>
                  Confirm Delete
                </Typography>
                <Typography sx={{ mb: 3 }}>
                  Are you sure you want to delete "{itemToDelete?.account_name}"?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setDeleteConfirmOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="contained" color="error" onClick={confirmDelete}>
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ChartsOfAccounts;