import React, { useState } from 'react';
import { Typography, Box, TextField, Button } from '@mui/material';
import { useGetLotLedgerQuery } from '../../store/services/reportService';
import SharedTable from '../../components/SharedTable';

const LotLedger = () => {
	const [lotNumber, setLotNumber] = useState('');
	// New state for transactions pagination
	const [txnPage, setTxnPage] = useState(0);
	const [txnRowsPerPage, setTxnRowsPerPage] = useState(20);

	const { data, refetch, isLoading, error } = useGetLotLedgerQuery(lotNumber, { skip: !lotNumber });
	console.log('logdata', data);
	const handleLotChange = (e) => {
		setLotNumber(e.target.value);
	};

	const handleSearch = () => {
		refetch();
	};

	const handleBillPrint = () => {
		console.log('Printing bill for lot:', lotNumber);
		// Add logic to print bill
	};

	const handleStockSummary = () => {
		console.log('Viewing stock summary for lot:', lotNumber);
		// Add logic to view stock summary
	};

	// New pagination handlers for transactions
	const handleTxnChangePage = (event, newPage) => {
		setTxnPage(newPage);
	};

	const handleTxnChangeRowsPerPage = (event) => {
		setTxnRowsPerPage(parseInt(event.target.value, 10));
		setTxnPage(0);
	};

	return (
		<Box>
			<Typography variant="h4" mb={3}>Lot Ledger</Typography>
			<Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', gap: 2 }}>
				<TextField
					label="Lot #"
					value={lotNumber}
					onChange={handleLotChange}
					sx={{ minWidth: 200 }}
				/>
				<Button variant="contained" onClick={handleSearch}>Search</Button>
			</Box>
			{isLoading && <div>Loading...</div>}
			{error && <div>Error loading lot ledger</div>}
			{data && (
				<>
					{/* Table for lot details */}
					{data.lotDetails && (
						<>
							<Typography variant="h6" mt={2}>Lot Details</Typography>
							<SharedTable
								columns={[
									{ id: "lot_number", label: "LOT NUMBER" },
									{ id: "arrival_date", label: "ARRIVAL DATE" },
									{ id: "party_id", label: "PARTY ID" },
									{ id: "receiving_type", label: "RECEIVING TYPE" },
									{ id: "file_number", label: "FILE NUMBER" },
									{ id: "remarks", label: "REMARKS" },
									{ id: "total", label: "TOTAL" },
									{ id: "discount_percent", label: "DISCOUNT %" },
									{ id: "grand_total", label: "GRAND TOTAL" }
								]}
								// Map lotDetails to an array with a unique id
								data={[{ ...data.lotDetails, id: data.lotDetails.id ?? 0 }]}
								page={0}
								rowsPerPage={1}
								handleChangePage={() => {}}
								handleChangeRowsPerPage={() => {}}
								totalRows={1}
								showActions={false}
							/>
						</>
					)}
					{/* Table for transactions */}
					{data.transactions && data.transactions.length > 0 && (
						<>
							<Typography variant="h6" mt={2}>Transactions</Typography>
							<SharedTable
								columns={[
									{ id: "transaction_date", label: "TRANSACTION DATE" },
									{ id: "description", label: "DESCRIPTION" },
									{ id: "amount", label: "AMOUNT" }
								]}
								data={data.transactions}
								page={txnPage}
								rowsPerPage={txnRowsPerPage}
								handleChangePage={handleTxnChangePage}
								handleChangeRowsPerPage={handleTxnChangeRowsPerPage}
								totalRows={data.transactions.length}
								showActions={false}
							/>
						</>
					)}
				</>
			)}
		</Box>
	);
};

export default LotLedger;