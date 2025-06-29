import React, { useState, useRef } from 'react';
import { Typography, Button, Box, CircularProgress, Divider, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { PlusOutlined, PrinterOutlined } from '@ant-design/icons';
import { useGetProcessingsQuery, useAddProcessingMutation, useUpdateProcessingMutation } from '../store/services/processing';
import { useGetPartiesQuery } from '../store/services/party';
import SharedTable from '../components/SharedTable';
import SharedModal from '../components/SharedModal';
import ViewDetails from '../components/ViewDetails';
import ProcessingOutTable from '../components/ProcessingOutTable';
import ProcessingInTable from '../components/ProcessingInTable';
import ProcessingExpensesTable from '../components/ProcessingExpensesTable';
import { useNavigate } from 'react-router-dom';
import ReactDOMServer from 'react-dom/server';
import { toast } from 'react-toastify';

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

  const handlePrint = (processing = null) => {
    // Use the provided processing or fall back to selectedProcessing (for view details)
    const processingToPrint = processing || selectedProcessing;

    console.log('[Processing] Print button clicked. Processing ID:', processingToPrint?.id);

    if (!processingToPrint) {
      console.error('[Processing] No processing provided to print function');
      toast.error('No processing data available to print');
      return;
    }

    const fullProcessing = processings.find(p => p.id === processingToPrint.id) || processingToPrint;
    console.log('[Processing] Full processing object:', fullProcessing);

    try {
      console.log('[Processing] Generating print content...');
      const printContent = ReactDOMServer.renderToStaticMarkup(
        <PrintProcessingDocument processing={fullProcessing} />
      );

      const style = `
      <style>
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; }
      .print-header { background: #f8f8f8; padding: 5px; border-bottom: 1px solid #ddd; }
      .print-title { font-size: 22px; font-weight: bold; margin: 0; }
      .print-subtitle { font-size: 14px; margin: 0; }
      .print-section { margin: 12px 0; }
      .print-section-title { font-size: 16px; font-weight: bold; margin-bottom: 6px; border-bottom: 1px solid #ddd; padding-bottom: 3px; }
      .print-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
      .print-table th, .print-table td {
        border: 1px solid #999;
        padding: 2px 4px;
        font-size: 10px;
      }
      .print-table th {
        background: #eee;
        text-align: left;
      }
      .print-total { font-size: 14px; font-weight: bold; text-align: right; margin-top: 8px; }
      .print-note { font-size: 12px; font-style: italic; margin-top: 10px; }
    </style>

    `;

      console.log('[Processing] Opening print window...');
      const printWindow = window.open('', '', 'width=1000,height=800');

      if (!printWindow) {
        console.error('[Processing] Failed to open print window - popup may be blocked');
        toast.error('Please allow popups to print this document');
        return;
      }

      printWindow.document.write(`
      <html>
        <head>
          <title>Processing Document #${fullProcessing.id}</title>
          ${style}
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

      printWindow.document.close();

      // Close the print window after printing or closing the print dialog
      const closePrintWindow = () => {
        setTimeout(() => {
          if (!printWindow.closed) {
            printWindow.close();
          }
        }, 100);
      };

      printWindow.onload = () => {
        console.log('[Processing] Print window loaded, initiating print...');
        try {
          printWindow.focus();
          setTimeout(() => {
            printWindow.print();
          }, 500);
        } catch (printErr) {
          console.error('[Processing] Error during printing:', printErr);
          toast.error('Failed to print document');
        }
      };

      // Listen for print events and close the window
      printWindow.addEventListener('afterprint', closePrintWindow);
      printWindow.addEventListener('focus', () => {
        // In some browsers, afterprint may not fire, so close on focus after print
        setTimeout(() => {
          if (printWindow.document.readyState === 'complete') {
            closePrintWindow();
          }
        }, 500);
      });

      // Fallback: close if the window is unloaded (user closes tab)
      printWindow.addEventListener('beforeunload', closePrintWindow);
    } catch (err) {
      console.error('[Processing] Error in handlePrint:', err);
      toast.error('Failed to generate print document');
    }
  };

  // Transform API data to match the expected format
  const transformProcessingData = (apiResponse) => {
    if (!apiResponse) return [];
    const dataArr = apiResponse.data ? apiResponse.data : apiResponse;
    return dataArr.map(item => ({
      id: item.id,
      date: item.date,
      party_id: item.party ? item.party.id : item.party_id,
      partyName: item.party ? item.party.name : '',
      description: item.description,
      charges_total: item.charges_total,
      active: item.active == 1, // convert numeric flag to boolean
      processing_outs: item.processing_outs || [],
      processing_ins: item.processing_ins || [],
      processing_expenses: item.processing_expenses || [],
      addedBy: item.added_by,
      addedOn: item.added_on,
      modifiedBy: item.modified_by,
      modifiedOn: item.modified_on,
      processingStatus: item.processing_status,
    }));
  };

  const processings = transformProcessingData(apiResponse);

  // Build dynamic options for Party field
  const partyOptions = [
    { value: '', label: 'Please select' },
    ...((partyData && Array.isArray(partyData)) ? partyData.map(p => ({ value: p.id, label: p.name })) : [])
  ];

  const fields = [
    { name: 'date', label: 'Date', type: 'date', required: true, sm: 6, InputLabelProps: { shrink: true }, helperText: 'Processing date' },
    {
      name: 'party_id',
      label: 'Party',
      type: 'select',
      options: partyOptions,
      required: true,
      sm: 6,
      helperText: 'Select the party for this processing'
    },
    { name: 'description', label: 'Description', multiline: true, rows: 2, sm: 12, helperText: 'Describe the processing batch' },
    { name: 'charges_total', label: 'Charges Total (Rs)', type: 'number', required: true, sm: 6, helperText: 'Total charges for this processing' },
    { name: 'active', label: 'Active', type: 'checkbox', sm: 6, helperText: 'Is this processing active?' },
  ];

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'date', label: 'Date' },
    { id: 'partyName', label: 'Party' },
    { id: 'description', label: 'Description' },
    { id: 'charges_total', label: 'Charges Total (Rs)' },
    {
      id: 'active',
      label: 'Active',
      format: (value) => (value ? 'Yes' : 'No'),
    },
    {
      id: 'actions',
      label: 'Actions',
      render: (...args) => {
        const row = args.find(arg => arg && typeof arg === 'object' && 'id' in arg);
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Print">
              <Button
                size="small"
                variant="outlined"
                startIcon={<PrinterOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!row || typeof row.id === 'undefined') {
                    console.error('[Processing] Print button: row is undefined or missing id', row);
                    toast.error('Cannot print: invalid processing data');
                    return;
                  }
                  console.log('[Processing] Print button clicked for row:', row.id);
                  handlePrint(row);
                }}
                sx={{ minWidth: 90 }}
              >
                Print
              </Button>
            </Tooltip>
          </Box>
        );
      },
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
        dataKey: 'processing_outs',
      },
      {
        label: 'Processing In / Finished Products',
        type: 'processingIn',
        dataKey: 'processing_ins',
      },
      {
        label: 'Processing Expenses',
        type: 'processingExpenses',
        dataKey: 'processing_expenses',
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
    if (processing && mode === 'view') {
      // Always use the latest, full data from processings array
      const fullProcessing = processings.find(p => p.id === processing.id);
      setSelectedProcessing(fullProcessing || processing);
      setFormData(fullProcessing || processing);
    } else if (processing) {
      setSelectedProcessing(processing);
      setFormData(processing);
    } else {
      setSelectedProcessing(null);
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
      // Ensure we have at least one item and a valid type
      if (e.length > 0 && e[0]?.type) {
        const type = e[0]?.type;

        if (type === 'processingOut') {
          setFormData((prev) => ({ ...prev, processing_outs: e }));
        } else if (type === 'processingIn') {
          setFormData((prev) => ({ ...prev, processing_ins: e }));
        } else if (type === 'processingExpenses') {
          setFormData((prev) => ({ ...prev, processing_expenses: e }));
        }
      }
    } else {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.processing_outs.length ||
      !formData.processing_ins.length ||
      !formData.processing_expenses.length
    ) {
      alert("Please add at least one entry for Processing Outs, Processing Ins, and Processing Expenses.");
      return;
    }
    try {
      const apiData = {
        date: formData.date,
        party_id: formData.party_id,
        description: formData.description,
        charges_total: formData.charges_total,
        active: formData.active,
        processing_outs: formData.processing_outs.map(item => {
          const out = {
            lot_number: item.lot_number,
            date: item.date,
            location_id: item.location_id,
            product_id: item.product_id,
            unit_id: item.unit_id,
            available_qty: item.available_qty,
            qty: item.qty,
            qty_less: item.qty_less,
            available_weight: item.available_weight,
            weight: item.weight,
            weight_less: item.weight_less,
          };
          // Only include id if it exists (editing)
          if (item.id) out.id = item.id;
          return out;
        }),
        processing_ins: formData.processing_ins.map(item => {
          const ins = {
            lot_number: item.lot_number,
            date: item.date,
            location_id: item.location_id,
            product_id: item.product_id,
            unit_id: item.unit_id,
            qty: item.qty,
            rate: item.rate,
            amount: item.amount,
            weight: item.weight,
            product_type: item.product_type,
            weight_less: item.weight_less,
          };
          if (item.id) ins.id = item.id;
          return ins;
        }),
        processing_expenses: formData.processing_expenses.map(item => {
          const exp = {
            charges_type_id: item.charges_type_id,
            details: item.details,
            qty: item.qty,
            weight: item.weight,
            rate: item.rate,
            amount: item.amount,
          };
          if (item.id) exp.id = item.id;
          return exp;
        }),
      };

      if (modalMode === 'add') {
        await addProcessing(apiData).unwrap();
      } else if (modalMode === 'edit') {
        await updateProcessing({ id: selectedProcessing.id, ...apiData }).unwrap();
      }

      refetch();
      handleCloseModal();
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "An error occurred.";
      toast.error(errMsg);
      console.error('Failed to save processing:', err);
    }
  };

  const renderProcessingOut = ({ data, formData, onChange, isViewMode }) => {
    const details = Array.isArray((data || formData)?.processing_outs)
      ? (data || formData)?.processing_outs.map(item => ({ ...item, type: 'processingOut' }))
      : [];

    return (
      <ProcessingOutTable
        details={details}
        onChange={(updatedDetails) => {
          onChange(updatedDetails);
        }}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingIn = ({ data, formData, onChange, isViewMode }) => {
    const details = Array.isArray((data || formData)?.processing_ins)
      ? (data || formData)?.processing_ins.map(item => ({ ...item, type: 'processingIn' }))
      : [];

    return (
      <ProcessingInTable
        details={details}
        onChange={(updatedDetails) => {
          onChange(updatedDetails);
        }}
        isViewMode={isViewMode}
      />
    );
  };

  const renderProcessingExpenses = ({ data, formData, onChange, isViewMode }) => {
    const details = Array.isArray((data || formData)?.processing_expenses)
      ? (data || formData)?.processing_expenses.map(item => ({ ...item, type: 'processingExpenses' }))
      : [];

    return (
      <ProcessingExpensesTable
        details={details}
        onChange={(updatedDetails) => {
          onChange(updatedDetails);
        }}
        isViewMode={isViewMode}
      />
    );
  };

  const renderCustomContent = (props) => (
    <Box>
      {/* Show all sub-tables at once, separated by Divider */}
      {renderProcessingOut(props)}
      <Divider sx={{ my: 2 }} />
      {renderProcessingIn(props)}
      <Divider sx={{ my: 2 }} />
      {renderProcessingExpenses(props)}
    </Box>
  );

  // Get all products and units for resolving names in print
  // (You may already have these in context or props, but for print, fetch from the first available processing)
  const allProducts =
    processings.flatMap(p => [
      ...(p.processing_outs || []),
      ...(p.processing_ins || [])
    ])
      .map(item => item.product)
      .filter(Boolean);

  const allUnits =
    processings.flatMap(p => [
      ...(p.processing_outs || []),
      ...(p.processing_ins || [])
    ])
      .map(item => item.unit)
      .filter(Boolean);

  // Helper to resolve product/unit by id
  const resolveProduct = (id) =>
    allProducts.find(p => String(p?.id) === String(id));
  const resolveUnit = (id) =>
    allUnits.find(u => String(u?.id) === String(id));

  const PrintProcessingDocument = ({ processing }) => {
    console.log('PrintProcessingDocument', processing);

    if (!processing) return null;

    // Patch processing_outs/ins to always have .product and .unit objects (like in view)
    const processing_outs = (processing.processing_outs || []).map(item => ({
      ...item,
      product: item.product || resolveProduct(item.product_id) || {},
      unit: item.unit || resolveUnit(item.unit_id) || {},
    }));
    const processing_ins = (processing.processing_ins || []).map(item => ({
      ...item,
      product: item.product || resolveProduct(item.product_id) || {},
      unit: item.unit || resolveUnit(item.unit_id) || {},
    }));

    // Calculate totals using patched arrays
    const rawMaterialTotal = processing_outs.reduce((acc, item) => ({
      qty: acc.qty + Number(item.available_qty || item.qty || 0),
      netQty: acc.netQty + Number((item.available_qty || 0) - (item.qty_less || 0)),
      weight: acc.weight + Number(item.available_weight || item.weight || 0),
      netWeight: acc.netWeight + Number((item.available_weight || 0) - (item.weight_less || 0)),

    }), { qty: 0, netQty: 0, weight: 0, netWeight: 0 });

    const finishedProductsTotal = processing_ins
      .filter(item => item.product_type === 'Processed')
      .reduce((acc, item) => ({
        qty: acc.qty + Number(item.qty || 0),
        weight: acc.weight + Number(item.weight || 0),
        netWeight: acc.netWeight + Number(item.weight - (item.weight_less || 0))
      }), { qty: 0, weight: 0, netWeight: 0 });

    const byProductsTotal = processing_ins
      .filter(item => item.product_type === 'Byproduct')
      .reduce((acc, item) => ({
        qty: acc.qty + Number(item.qty || 0),
        weight: acc.weight + Number(item.weight || 0),
        netWeight: acc.netWeight + Number(item.weight - (item.weight_less || 0))
      }), { qty: 0, weight: 0, netWeight: 0 });

    const grandTotal = {
      qty: finishedProductsTotal.qty + byProductsTotal.qty,
      weight: finishedProductsTotal.weight + byProductsTotal.weight,
      netWeight: finishedProductsTotal.netWeight + byProductsTotal.netWeight,
    };

    const weightDifference = rawMaterialTotal.netWeight - grandTotal.netWeight;

    const invoiceTotal = (processing.processing_expenses || []).reduce((sum, exp) => {
      return sum + Number(exp.amount || 0);
    }, 0);

    const totalExpenseWeight = (processing.processing_expenses || []).reduce((sum, exp) => {
  return sum + Number(exp.weight || 0);
}, 0);

    return (
      <div style={{
        padding: '15px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        maxWidth: '100%',
        margin: '0 auto'
      }}>
        {/* Prominent Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '15px',
          borderBottom: '2px solid #000',
          paddingBottom: '10px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '5px',
            color: '#333'
          }}>SA RICE MILL</div>
          <div style={{
            fontSize: '16px',
            marginBottom: '5px'
          }}>
            Plot # 208 & 209 Yousuf Goth, Hub River Road, Karachi
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '500'
          }}>
            Contact: 03212244574 | Email: ioointernation@gmail.com
          </div>
        </div>

        {/* Document Info */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '15px',
          fontSize: '14px',
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '5px'
        }}>
          <div>
            <strong>Date:</strong> {processing.date}
          </div>
          <div>
            <strong>Party:</strong> {processing.party ? processing.party.name : processing.partyName}
          </div>
          <div>
            <strong>Process#:</strong> {processing.id}
          </div>
        </div>

        {/* Raw Material Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: '2px solid #000',
            marginBottom: '10px',
            paddingBottom: '5px'
          }}>RAW MATERIAL</div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #000',
                backgroundColor: '#f5f5f5'
              }}>
                <th style={{ width: '5%', textAlign: 'left', padding: '8px' }}>S.No.</th>
                <th style={{ width: '10%', padding: '8px' }}>Date</th>
                <th style={{ width: '10%', padding: '8px' }}>Lot #</th>
                <th style={{ width: '20%', padding: '8px' }}>Product</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Qty</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Less</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Net Qty</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Weight</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Less</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Net Wt.</th>
                <th style={{ width: '5%', padding: '8px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_outs.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.date}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.lot_number}</td>
                  <td style={{ padding: '8px' }}>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.available_qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.qty_less || 0}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.available_weight}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td colSpan="4" style={{ textAlign: 'right', padding: '8px' }}>Total</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{rawMaterialTotal.qty}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}></td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{rawMaterialTotal.netQty}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{rawMaterialTotal.weight}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}></td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{rawMaterialTotal.netWeight}</td>
                <td style={{ padding: '8px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Finished Products Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: '2px solid #000',
            marginBottom: '10px',
            paddingBottom: '5px'
          }}>FINISHED PRODUCTS</div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #000',
                backgroundColor: '#f5f5f5'
              }}>
                <th style={{ width: '5%', textAlign: 'left', padding: '8px' }}>S.No.</th>
                <th style={{ width: '10%', padding: '8px' }}>Date</th>
                <th style={{ width: '10%', padding: '8px' }}>Lot #</th>
                <th style={{ width: '20%', padding: '8px' }}>Product</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Qty</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Weight</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Less</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Net Wt.</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Ratio %</th>
                <th style={{ width: '5%', padding: '8px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_ins.filter(item => item.product_type === 'Processed').map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.date}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.lot_number}</td>
                  <td style={{ padding: '8px' }}>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight - (item.weight_less || 0)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    {rawMaterialTotal.netWeight ? (((item.weight - (item.weight_less || 0)) / rawMaterialTotal.netWeight * 100).toFixed(2)) : '0.00'}%
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td colSpan="4" style={{ textAlign: 'right', padding: '8px' }}>Total</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{finishedProductsTotal.qty}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{finishedProductsTotal.weight}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}></td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{finishedProductsTotal.netWeight}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>
                  {rawMaterialTotal.netWeight ? ((finishedProductsTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%
                </td>
                <td style={{ padding: '8px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* By Products Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: '2px solid #000',
            marginBottom: '10px',
            paddingBottom: '5px'
          }}>BY PRODUCTS</div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #000',
                backgroundColor: '#f5f5f5'
              }}>
                <th style={{ width: '5%', textAlign: 'left', padding: '8px' }}>S.No.</th>
                <th style={{ width: '10%', padding: '8px' }}>Date</th>
                <th style={{ width: '10%', padding: '8px' }}>Lot #</th>
                <th style={{ width: '20%', padding: '8px' }}>Product</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Qty</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Weight</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Less</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Net Wt.</th>
                <th style={{ width: '8%', textAlign: 'right', padding: '8px' }}>Ratio %</th>
                <th style={{ width: '5%', padding: '8px' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_ins.filter(item => item.product_type === 'Byproduct').map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.date}</td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.lot_number}</td>
                  <td style={{ padding: '8px' }}>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>{item.weight - (item.weight_less || 0)}</td>
                  <td style={{ textAlign: 'right', padding: '8px' }}>
                    {rawMaterialTotal.netWeight ? (((item.weight - (item.weight_less || 0)) / rawMaterialTotal.netWeight * 100).toFixed(2)) : '0.00'}%
                  </td>
                  <td style={{ textAlign: 'center', padding: '8px' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td colSpan="4" style={{ textAlign: 'right', padding: '8px' }}>Total</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{byProductsTotal.qty}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{byProductsTotal.weight}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}></td>
                <td style={{ textAlign: 'right', padding: '8px' }}>{byProductsTotal.netWeight}</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>
                  {rawMaterialTotal.netWeight ? ((byProductsTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%
                </td>
                <td style={{ padding: '8px' }}></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div style={{
          marginBottom: '20px',
          textAlign: 'right',
          fontWeight: 'bold',
          fontSize: '16px',
          backgroundColor: '#f5f5f5',
          padding: '10px',
          borderRadius: '5px'
        }}>
          <div>Grand Total: {grandTotal.qty} | {grandTotal.weight} | {grandTotal.netWeight} |
            {rawMaterialTotal.netWeight ? ((grandTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%
          </div>
          <div>Weight Difference: {weightDifference}</div>
        </div>

        {/* Invoice Section */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '18px',
            borderBottom: '2px solid #000',
            marginBottom: '10px',
            paddingBottom: '5px'
          }}>INVOICE</div>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{
                borderBottom: '2px solid #000',
                backgroundColor: '#f5f5f5'
              }}>
                <th style={{ width: '5%', textAlign: 'left', padding: '8px' }}>S.No.</th>
                <th style={{ width: '45%', padding: '8px' }}>Description</th>
                <th style={{ width: '10%', textAlign: 'right', padding: '8px' }}>Qty</th>
                <th style={{ width: '10%', textAlign: 'right', padding: '8px' }}>Weight</th>
                <th style={{ width: '15%', textAlign: 'right', padding: '8px' }}>Rate</th>
                <th style={{ width: '15%', textAlign: 'right', padding: '8px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(processing.processing_expenses) && processing.processing_expenses.length > 0 ? (
                processing.processing_expenses.map((expense, idx) => (
                  <tr key={expense.id || idx} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: '8px' }}>{idx + 1}</td>
                    <td style={{ padding: '8px' }}>{expense.charges_type?.name || '-'}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{expense.qty || 0}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{expense.weight || 0}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{expense.rate || 0}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>{expense.amount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '8px' }}>No expenses available.</td>
                </tr>
              )}
              <tr style={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
                <td colSpan="5" style={{ textAlign: 'right', padding: '8px' }}>Total</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>
  {invoiceTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div style={{
          fontSize: '14px',
          fontStyle: 'italic',
          textAlign: 'center',
          marginTop: '20px',
          padding: '10px',
          borderTop: '1px solid #000'
        }}>
          NOTE: Rent Would Be Charged After 15 Days Of Milling.
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">Processing [{selectedProcessing.id}]</Typography>
            <Button
              variant="contained"
              startIcon={<PrinterOutlined />}
              onClick={() => handlePrint()} // No parameter needed here as it will use selectedProcessing
              sx={{ ml: 2 }}
            >
              Print
            </Button>
          </Box>

          <ViewDetails
            data={selectedProcessing}
            title=""
            detailsRef={detailsRef}
            fields={viewFields}
            renderCustomContent={renderCustomContent}
          />
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" onClick={handleCloseModal}>
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
        maxWidth="xl"
        fullWidth
        actions={
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, p: 2, position: 'sticky', bottom: 0, bgcolor: 'background.paper', zIndex: 1 }}>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmit} disabled={modalMode === 'view'}>Save</Button>
          </Box>
        }
      />
    </Box>
  );
};

export default Processing;