import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
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
    parent: '',
    accountCode: '',
    accountName: '',
    isTransactionAccount: false,
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
      name: 'parent',
      label: 'Parent Account',
      type: 'select',
      options: [
        { value: '', label: 'Please select' },
        ...chartsData.map(account => ({
          value: account.id,
          label: `${account.accountCode} - ${account.accountName}`
        }))
      ],
      sm: 6,
    },
    { name: 'accountCode', label: 'Account Code', required: true, sm: 6 },
    { name: 'accountName', label: 'Account Name', required: true, sm: 6 },
    {
      name: 'isTransactionAccount',
      label: 'Is Transaction Account',
      type: 'checkbox',
      sm: 6,
    },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'nature', label: 'Nature' },
    { 
      id: 'parent', 
      label: 'Parent Account',
      format: (value, row) => {
        const parent = chartsData.find(a => a.id === value);
        return parent ? `${parent.accountCode} - ${parent.accountName}` : '-';
      }
    },
    { id: 'accountCode', label: 'Account Code' },
    { id: 'accountName', label: 'Account Name' },
    {
      id: 'isTransactionAccount',
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
        parent: '',
        accountCode: '',
        accountName: '',
        isTransactionAccount: false,
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
        parent: '',
        accountCode: '',
        accountName: '',
        isTransactionAccount: false,
      });
    } else {
      const { name, value, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: name === 'isTransactionAccount' ? checked : value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === 'add') {
        await addChartOfAccount(formData).unwrap();
        toast.success('Chart of Account created successfully');
      } else {
        await updateChartOfAccount({ id: selectedAccount.id, ...formData }).unwrap();
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
        title={
          modalMode === 'add'
            ? 'Charts of Accounts, Add new'
            : 'Edit Chart of Account'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
      />
      
      {/* Delete confirmation dialog */}
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
              Are you sure you want to delete "{itemToDelete?.accountName}"?
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
    </Box>
  );
};

export default ChartsOfAccounts;