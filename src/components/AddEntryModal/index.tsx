import {Dialog, DialogTitle, DialogContent, Divider, Alert, Typography} from '@mui/material';

import AddEntryForm from "./AddEntryForm";
import {Diagnosis, EntryWithoutId} from "../../types";

interface Props {
    modalOpen: boolean;
    onClose: () => void;
    onSubmit: (values: EntryWithoutId) => void;
    error?: string;
    patientName?: string;
    diagnosis: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, patientName, diagnosis }: Props) => (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
        <DialogTitle sx={{ bgcolor: 'black'}}>
            <Typography sx={{ p: 1, textAlign: 'center', fontSize: '1.5rem', color: 'white' }}>
                Add a new entry to patient: <strong>{patientName}</strong>
            </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
            {error && <Alert severity="error" style={{ whiteSpace: 'pre-line' }}>{error}</Alert>}
            <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnosis={diagnosis}/>
        </DialogContent>
    </Dialog>
);

export default AddEntryModal;