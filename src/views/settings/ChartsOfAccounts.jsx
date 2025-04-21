import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import SharedTable from '../../components/SharedTable';
import SharedModal from '../../components/SharedModal';
import { useChartsOfAccountsQuery, useAddChartOfAccountMutation, useUpdateChartOfAccountMutation } from '../../store/services/settings';

// Mock data for Charts of Accounts
const mockChartsOfAccounts = [
  { id: 1, nature: 'A', parent: '', accountCode: '1', accountName: 'Asset', isTransactionAccount: false },
  { id: 6, nature: 'A', parent: 'Asset', accountCode: '1-01', accountName: 'Current Asset', isTransactionAccount: false },
  { id: 8, nature: 'A', parent: 'Current Asset', accountCode: '1-01-01', accountName: 'Customers', isTransactionAccount: false },
  { id: 106, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0001', accountName: 'SA Rice', isTransactionAccount: true },
  { id: 107, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0002', accountName: 'Party 2', isTransactionAccount: true },
  { id: 108, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0003', accountName: 'Siraj Rice', isTransactionAccount: true },
  { id: 110, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0004', accountName: 'Kafaaf Enterprises', isTransactionAccount: true },
  { id: 111, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0005', accountName: 'Zubair Enterprises', isTransactionAccount: true },
  { id: 112, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0006', accountName: 'Barkha Traders', isTransactionAccount: true },
  { id: 113, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0007', accountName: 'Younus Brothers', isTransactionAccount: true },
  { id: 114, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0008', accountName: 'Buraidha Rice', isTransactionAccount: true },
  { id: 115, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0009', accountName: 'Sami Ullah Shikarpur', isTransactionAccount: true },
  { id: 116, nature: 'A', parent: 'Customers', accountCode: '1-01-01-0010', accountName: 'Ali Humza Rice', isTransactionAccount: true },
];

const ChartsOfAccounts = () => {
  const { data: chartsData = [], refetch } = useChartsOfAccountsQuery();
  const [addChartOfAccount] = useAddChartOfAccountMutation();
  const [updateChartOfAccount] = useUpdateChartOfAccountMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit'
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [formData, setFormData] = useState({
    nature: '',
    parent: '',
    accountCode: '',
    accountName: '',
    isTransactionAccount: false,
  });

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
        { value: 'A', label: 'A' },
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
        { value: 'Asset', label: 'Asset' },
        { value: 'Current Asset', label: 'Current Asset' },
        { value: 'Customers', label: 'Customers' },
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
    { id: 'parent', label: 'Parent Account' },
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
        await addChartOfAccount(formData);
        toast.success('Chart of Account created successfully');
      } else {
        await updateChartOfAccount(formData);
        toast.success('Chart of Account updated successfully');
      }
      await refetch();
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

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
    </Box>
  );
};

export default ChartsOfAccounts;