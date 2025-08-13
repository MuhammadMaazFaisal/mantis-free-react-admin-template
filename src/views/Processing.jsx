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
    reference_number: '',
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
    const processingToPrint = processing || selectedProcessing;
    if (!processingToPrint) {
      toast.error('No processing data available to print');
      return;
    }
    const fullProcessing = processings.find(p => p.id === processingToPrint.id) || processingToPrint;

    try {
      const printContent = ReactDOMServer.renderToStaticMarkup(
        <PrintProcessingDocument processing={fullProcessing} />
      );

      // Compact print CSS with improved table UI and subtle header background
      const style = `
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Arial, sans-serif; font-size: 12px; color: #111; }
        .doc { padding: 6px; max-width: 100%; margin: 0 auto; }
        .main-header { text-align: center; margin-bottom: 6px; border-bottom: 2px solid #000; padding-bottom: 4px; }
        .main-header .title { font-size: 24px; font-weight: bold; margin-bottom: 4px; } /* KEEP 24px */
        .info-bar { display:flex; justify-content:space-between; gap:8px; margin-bottom:6px; font-size:14px; background:#f6f7f9; padding:6px; border-radius:3px; }
        .section-title { font-weight: 700; font-size: 16px; margin-bottom:6px; border-bottom:1px solid #ddd; padding-bottom:4px; } /* slightly smaller than before */
        /* Tables: compact, neat UI */
        table.compact-table { width:100%; border-collapse:collapse; font-size:13px; }
        table.compact-table th, table.compact-table td { padding:6px 5px; border: 1px solid #e1e3e6; vertical-align:middle; }
        table.compact-table th { background: linear-gradient(180deg, #f6f7f9, #f2f4f6); font-weight:700; text-align:left; font-size:12.5px; }
        table.compact-table tbody tr:nth-child(even) { background: #fbfbfc; }
        table.compact-table tbody tr { page-break-inside: avoid; }
        /* Totals row */
        .totals-row td { font-weight:700; background:#f6f7f9; }
        /* Summary smaller */
        .summary { text-align:right; font-weight:700; font-size:13px; background:#f6f7f9; padding:6px; border-radius:3px; margin-bottom:6px; }
        .footer-note { font-size:12px; font-style:italic; text-align:center; margin-top:8px; padding:4px; border-top:1px solid #000; }
        /* reduce margins for print */
        .section { margin-bottom:6px; }
        /* make invoice columns crisper */
        table.compact-table th.num, table.compact-table td.num { text-align:right; }
      </style>
      `;

      const printWindow = window.open('', '', 'width=1000,height=800');
      if (!printWindow) {
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

      const closePrintWindow = () => {
        setTimeout(() => {
          if (!printWindow.closed) printWindow.close();
        }, 100);
      };

      printWindow.onload = () => {
        try {
          printWindow.focus();
          setTimeout(() => printWindow.print(), 500);
        } catch (e) {
          toast.error('Failed to print document');
        }
      };

      printWindow.addEventListener('afterprint', closePrintWindow);
      printWindow.addEventListener('focus', () => {
        setTimeout(() => {
          if (printWindow.document.readyState === 'complete') closePrintWindow();
        }, 500);
      });
      printWindow.addEventListener('beforeunload', closePrintWindow);
    } catch (err) {
      toast.error('Failed to generate print document');
      console.error('[Processing] Error in handlePrint:', err);
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
      reference_number: item.reference_number || '',
      description: item.description,
      charges_total: item.charges_total,
      active: item.active == 1,
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
    { name: 'reference_number', label: 'Reference Number', type: 'text', sm: 6, helperText: 'Optional reference number for this processing' },
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
                    toast.error('Cannot print: invalid processing data');
                    return;
                  }
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
        reference_number: '',
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
        reference_number: '',
        description: '',
        charges_total: 0.0,
        active: true,
        processing_outs: [],
        processing_ins: [],
        processing_expenses: [],
      });
    } else if (Array.isArray(e)) {
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
        reference_number: formData.reference_number,
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
      {renderProcessingOut(props)}
      <Divider sx={{ my: 1 }} />
      {renderProcessingIn(props)}
      <Divider sx={{ my: 1 }} />
      {renderProcessingExpenses(props)}
    </Box>
  );

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

  const resolveProduct = (id) =>
    allProducts.find(p => String(p?.id) === String(id));
  const resolveUnit = (id) =>
    allUnits.find(u => String(u?.id) === String(id));

  const PrintProcessingDocument = ({ processing }) => {
    if (!processing) return null;

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

    return (
      <div className="doc">
        <div className="main-header">
          <div className="title">SA RICE MILL</div>
          <div style={{ fontSize: '16px', marginBottom: '2px' }}>Plot # 208 & 209 Yousuf Goth, Hub River Road, Karachi</div>
          <div style={{ fontSize: '14px', fontWeight: 500 }}>Contact: 03212244574 | Email: ioointernation@gmail.com</div>
        </div>

        <div className="info-bar">
          <div><strong>Date:</strong> {processing.date}</div>
          <div><strong>Party:</strong> {processing.party ? processing.party.name : processing.partyName}</div>
          <div><strong>Process#:</strong> {processing.id}</div>
          {processing.reference_number && <div><strong>Ref#:</strong> {processing.reference_number}</div>}
        </div>

        {/* RAW MATERIAL */}
        <div className="section">
          <div className="section-title">RAW MATERIAL</div>
          <table className="compact-table">
            <thead>
              <tr>
                <th style={{ width: '4%' }}>#</th>
                <th style={{ width: '12%' }}>Date</th>
                <th style={{ width: '10%' }}>Lot #</th>
                <th style={{ width: '20%' }}>Product</th>
                <th className="num" style={{ width: '8%' }}>Qty</th>
                <th className="num" style={{ width: '8%' }}>Less</th>
                <th className="num" style={{ width: '8%' }}>Net Qty</th>
                <th className="num" style={{ width: '8%' }}>Weight</th>
                <th className="num" style={{ width: '8%' }}>Less</th>
                <th className="num" style={{ width: '8%' }}>Net Wt.</th>
                <th style={{ width: '5%' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_outs.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>{item.date}</td>
                  <td style={{ textAlign: 'center' }}>{item.lot_number}</td>
                  <td>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right' }}>{item.available_qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.qty_less || 0}</td>
                  <td style={{ textAlign: 'right' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.available_weight}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight}</td>
                  <td style={{ textAlign: 'center' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td colSpan="4" style={{ textAlign: 'right' }}>Total</td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.qty}</td>
                <td></td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.netQty}</td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.weight}</td>
                <td></td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.netWeight}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FINISHED PRODUCTS */}
        <div className="section">
          <div className="section-title">FINISHED PRODUCTS</div>
          <table className="compact-table">
            <thead>
              <tr>
                 <th style={{ width: '3%' }}>#</th>
                <th style={{ width: '12%' }}>Date</th>
                <th style={{ width: '10%' }}>Lot #</th>
                <th style={{ width: '20%' }}>Product</th>
                <th className="num" style={{ width: '8%' }}>Qty</th>
                <th className="num" style={{ width: '8%' }}>Weight</th>
                <th className="num" style={{ width: '8%' }}>Less</th>
                <th className="num" style={{ width: '8%' }}>Net Wt.</th>
                <th className="num" style={{ width: '8%' }}>Ratio %</th>
                <th style={{ width: '5%' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_ins.filter(item => item.product_type === 'Processed').map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>{item.date}</td>
                  <td style={{ textAlign: 'center' }}>{item.lot_number}</td>
                  <td>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight - (item.weight_less || 0)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {rawMaterialTotal.netWeight ? (((item.weight - (item.weight_less || 0)) / rawMaterialTotal.netWeight * 100).toFixed(2)) : '0.00'}%
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td colSpan="4" style={{ textAlign: 'right' }}>Total</td>
                <td style={{ textAlign: 'right' }}>{finishedProductsTotal.qty}</td>
                <td style={{ textAlign: 'right' }}>{finishedProductsTotal.weight}</td>
                <td></td>
                <td style={{ textAlign: 'right' }}>{finishedProductsTotal.netWeight}</td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.netWeight ? ((finishedProductsTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* BY PRODUCTS */}
        <div className="section">
          <div className="section-title">BY PRODUCTS</div>
          <table className="compact-table">
            <thead>
              <tr>
                 <th style={{ width: '3%' }}>#</th>
                <th style={{ width: '12%' }}>Date</th>
                <th style={{ width: '10%' }}>Lot #</th>
                <th style={{ width: '20%' }}>Product</th>
                <th className="num" style={{ width: '8%' }}>Qty</th>
                <th className="num" style={{ width: '8%' }}>Weight</th>
                <th className="num" style={{ width: '8%' }}>Less</th>
                <th className="num" style={{ width: '8%' }}>Net Wt.</th>
                <th className="num" style={{ width: '8%' }}>Ratio %</th>
                <th style={{ width: '5%' }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {processing_ins.filter(item => item.product_type === 'Byproduct').map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>{item.date}</td>
                  <td style={{ textAlign: 'center' }}>{item.lot_number}</td>
                  <td>{item.product?.name || 'Product'}</td>
                  <td style={{ textAlign: 'right' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight_less || 0}</td>
                  <td style={{ textAlign: 'right' }}>{item.weight - (item.weight_less || 0)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {rawMaterialTotal.netWeight ? (((item.weight - (item.weight_less || 0)) / rawMaterialTotal.netWeight * 100).toFixed(2)) : '0.00'}%
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.unit?.name || 'Unit'}</td>
                </tr>
              ))}
              <tr className="totals-row">
                <td colSpan="4" style={{ textAlign: 'right' }}>Total</td>
                <td style={{ textAlign: 'right' }}>{byProductsTotal.qty}</td>
                <td style={{ textAlign: 'right' }}>{byProductsTotal.weight}</td>
                <td></td>
                <td style={{ textAlign: 'right' }}>{byProductsTotal.netWeight}</td>
                <td style={{ textAlign: 'right' }}>{rawMaterialTotal.netWeight ? ((byProductsTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary: smaller font */}
        <div className="summary">
          <div>Grand Total: {grandTotal.qty} | {grandTotal.weight} | {grandTotal.netWeight} | {rawMaterialTotal.netWeight ? ((grandTotal.netWeight / rawMaterialTotal.netWeight) * 100).toFixed(2) : '0.00'}%</div>
          <div>Weight Difference: {weightDifference}</div>
        </div>

        {/* INVOICE */}
        <div className="section">
          <div className="section-title">INVOICE</div>
          <table className="compact-table">
            <thead>
              <tr>
                 <th style={{ width: '3%' }}>#</th>
                <th style={{ width: '45%' }}>Description</th>
                <th className="num" style={{ width: '10%' }}>Qty</th>
                <th className="num" style={{ width: '10%' }}>Weight</th>
                <th className="num" style={{ width: '15%' }}>Rate</th>
                <th className="num" style={{ width: '15%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(processing.processing_expenses) && processing.processing_expenses.length > 0 ? (
                processing.processing_expenses.map((expense, idx) => (
                  <tr key={expense.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{expense.charges_type?.name || '-'}</td>
                    <td style={{ textAlign: 'right' }}>{expense.qty || 0}</td>
                    <td style={{ textAlign: 'right' }}>{expense.weight || 0}</td>
                    <td style={{ textAlign: 'right' }}>{expense.rate || 0}</td>
                    <td style={{ textAlign: 'right' }}>{expense.amount || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center' }}>No expenses available.</td>
                </tr>
              )}
              <tr className="totals-row">
                <td colSpan="5" style={{ textAlign: 'right' }}>Total</td>
                <td style={{ textAlign: 'right' }}>{invoiceTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="footer-note">NOTE: Rent Would Be Charged After 15 Days Of Milling.</div>
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
              onClick={() => handlePrint()}
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
