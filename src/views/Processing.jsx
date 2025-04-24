import React, { useState, useRef } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { PlusOutlined } from '@ant-design/icons';
import { useGetProcessingsQuery, useAddProcessingMutation, useUpdateProcessingMutation } from '../store/services/processing';
import { useGetPartiesQuery } from '../store/services/party';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import ProcessingOutTable from '../components/ProcessingOutTable';
import ProcessingInTable from '../components/ProcessingInTable';
import ProcessingExpensesTable from '../components/ProcessingExpensesTable';
import { useNavigate } from 'react-router-dom';

const Processing = () => {
  const navigate = useNavigate();
  const { data: apiResponse, isLoading, isError, error, refetch } = useGetProcessingsQuery();
  const { data: partyData } = useGetPartiesQuery();
  const [addProcessing] = useAddProcessingMutation();
  const [updateProcessing] = useUpdateProcessingMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProcessing, setSelectedProcessing] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    party_id: '',
    description: '',
    charges_total: 0.0,
    active: true,
    processing_outs: [],
    processing_ins: [],
    processing_expenses: [],
  });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const tableRef = useRef();
  const detailsRef = useRef();

  // Transform API data to match the expected format
  const transformProcessingData = (data) => {
    if (!data) return [];
    
    return data.map(item => ({
      id: item.id,
      date: item.date,
      party_id: item.party_id,
      description: item.description,
      charges_total: item.charges_total,
      active: item.active,
      processing_outs: item.processing_outs || [],
      processing_ins: item.processing_ins || [],
      processing_expenses: item.processing_expenses || [],
    }));
  };

  const processings = transformProcessingData(apiResponse);

  // Build dynamic options for Party field
  const partyOptions = [
    { value: '', label: 'Please select' },
    ...((partyData && Array.isArray(partyData)) ? partyData.map(p => ({ value: p.id, label: p.name })) : [])
  ];

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6, InputLabelProps: { shrink: true } },
    {
      name: 'party_id',
      label: 'Party',
      type: 'select',
      options: partyOptions,
      required: true,
      sm: 6,
    },
    { name: 'description', label: 'Description', multiline: true, rows: 2 },
    { name: 'charges_total', label: 'Charges Total (₹)', type: 'number', required: true, sm: 6 },
    { name: 'active', label: 'Active', type: 'checkbox' },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    {
      id: 'party_id',
      label: 'Party',
      format: (value) => {
        const party = partyOptions.find((opt) => opt.value == value);
        return party ? party.label : value;
      }
    },
    { id: 'description', label: 'Description' },
    { id: 'charges_total', label: 'Charges Total (₹)' },
    {
      id: 'active',
      label: 'Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
  ];

  const viewFields = [
    ...fields,
    { name: 'addedBy', label: 'Added By' },
    { name: 'addedOn', label: 'Added On' },
    { name: 'modifiedBy', label: 'Modified By' },
    { name: 'modifiedOn', label: 'Modified On' },
    { id: 'processingStatus', label: 'Processing Status' },
  ];

  const subTableConfig = {
    tabs: [
      {
        label: 'Processing Out / Raw Material',
        type: 'processingOut',
        dataKey: 'processingOut',
      },
      {
        label: 'Processing In / Finished Products',
        type: 'processingIn',
        dataKey: 'processingIn',
      },
      {
        label: 'Processing Expenses',
        type: 'processingExpenses',
        dataKey: 'processingExpenses',
      },
    ],
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = (mode, processing = null) => {
    setModalMode(mode);
    setSelectedProcessing(processing);
    if (processing) {
      setFormData(processing);
    } else {
      setFormData({
        date: '',
        party_id: '',
        description: '',
        charges_total: 0.0,
        active: true,
        processing_outs: [],
        processing_ins: [],
        processing_expenses: [],
      });
    }
    if (mode !== 'view') {
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProcessing(null);
    if (modalMode === 'view') {
      navigate('/processing');
    }
  };

  const handleFormChange = (e) => {
    if (e.reset) {
      setFormData({
        date: '',
        party_id: '',
        description: '',
        charges_total: 0.0,
        active: true,
        processing_outs: [],
        processing_ins: [],
        processing_expenses: [],
      });
    } else if (Array.isArray(e)) {
      if (e[0]?.type === 'processingOut') {
        setFormData((prev) => ({ ...prev, processing_outs: e }));
      } else if (e[0]?.type === 'processingIn') {
        setFormData((prev) => ({ ...prev, processing_ins: e }));
      } else if (e[0]?.type === 'processingExpenses') {
        setFormData((prev) => ({ ...prev, processing_expenses: e }));
      }
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    // Added validation for required nested fields
    if (
      !formData.processing_outs.length ||
      !formData.processing_ins.length ||
      !formData.processing_expenses.length
    ) {
      alert("Please add at least one entry for Processing Outs, Processing Ins, and Processing Expenses.");
      return;
    }
    try {
      // Transform data for API with updated key mapping
      const apiData = {
        date: formData.date,
        party_id: formData.party_id,
        description: formData.description,
        charges_total: formData.charges_total,
        active: formData.active,
        processing_outs: formData.processing_outs.map(item => ({
          lot_number: item.lot_number,            // changed from item.lotNumber
          date: item.date,
          location_id: item.location_id,
          product_id: item.product_id,
          unit_id: item.unit_id,
          available_qty: item.available_qty,        // changed from item.availableQty
          qty: item.qty,
          qty_less: item.qty_less,                  // changed from item.qtyLess
          available_weight: item.available_weight,  // changed from item.availableWeight
          weight: item.weight,
          weight_less: item.weight_less,            // changed from item.weightLess
        })),
        processing_ins: formData.processing_ins.map(item => ({
          lot_number: item.lot_number,            // changed from item.lotNumber
          date: item.date,
          location_id: item.location_id,
          product_id: item.product_id,
          unit_id: item.unit_id,
          qty: item.qty,
          rate: item.rate,
          amount: item.amount,
          weight: item.weight,
          product_type: item.product_type,        // changed from item.productType
          weight_less: item.weight_less,          // changed from item.weightLess
        })),
        processing_expenses: formData.processing_expenses.map(item => ({
          charges_type_id: item.charges_type_id,
          details: item.details,
          qty: item.qty,
          weight: item.weight,
          rate: item.rate,
          amount: item.amount,
        })),
      };

      if (modalMode === 'add') {
        await addProcessing(apiData).unwrap();
      } else if (modalMode === 'edit') {
        await updateProcessing({ id: selectedProcessing.id, ...apiData }).unwrap();
      }
      
      refetch(); // Refresh the data after successful operation
      handleCloseModal();
    } catch (err) {
      console.error('Failed to save processing:', err);
      // You might want to show an error message to the user here
    }
  };

  const renderProcessingOut = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processing_outs || [];
    return (
      <ProcessingOutTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingIn = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processing_ins || [];
    return (
      <ProcessingInTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingExpenses = ({ data, formData, onChange, isViewMode }) => {
    const details = (data || formData)?.processing_expenses || [];
    return (
      <ProcessingExpensesTable
        details={details}
        onChange={(updatedDetails) => onChange(updatedDetails)}
        isViewMode={isViewMode}
      />
    );
  };

  const renderCustomContent = (props) => (
    <>
      {renderProcessingOut(props)}
      {renderProcessingIn(props)}
      {renderProcessingExpenses(props)}
    </>
  );

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (isError) {
    return (
      <Typography color="error">
        Error fetching processings: {error?.data?.message || error?.message || 'An unexpected error occurred.'}
      </Typography>
    );
  }

  return (
    <Box>
      {modalMode === 'view' && selectedProcessing ? (
        <>
          <ViewDetails
            data={selectedProcessing}
            title={`Processing [${selectedProcessing.id}]`}
            detailsRef={detailsRef}
            fields={viewFields}
            renderCustomContent={renderCustomContent}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={() => navigate('/processing')}>
              Back to list
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h4">Processing</Typography>
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
            data={processings}
            onEdit={(processing) => {
              tableRef.current = null;
              handleOpenModal('edit', processing);
            }}
            onView={(processing) => {
              tableRef.current = null;
              handleOpenModal('view', processing);
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            handleChangePage={handleChangePage}
            handleChangeRowsPerPage={handleChangeRowsPerPage}
            totalRows={processings.length}
            tableRef={tableRef}
            subTableConfig={subTableConfig}
          />
        </>
      )}
      <SharedModal
        open={modalOpen}
        onClose={handleCloseModal}
        title={
          modalMode === 'add'
            ? 'Processing, Add new'
            : modalMode === 'edit'
            ? 'Edit Processing'
            : 'View Processing'
        }
        formData={formData}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        mode={modalMode}
        fields={fields}
        renderCustomContent={renderCustomContent}
      />
    </Box>
  );
};

export default Processing;