import patientService from "../../services/patients";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { EntryWithoutId, Patient } from "../../types.ts";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from "../EntryDetails";
import { Alert, Button } from "@mui/material";
import { Diagnosis } from '../../types.js';
import AddEntryModal from "../AddEntryModal";

interface Props {
    diagnosis: Diagnosis[]
}

const PatientView = ( { diagnosis }: Props ) => {
    const { id } = useParams();
    const [ patient, setPatient ] = useState<Patient | undefined>(undefined);
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ error, setError ] = useState<string>();

    const [ modalOpen, setModalOpen ] = useState<boolean>(false);
    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    useEffect(() => {
        const fetchPatient = async () => {
            if ( !id ) {
                setError('No ID!');
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const patient = await patientService.getPatientById(id);
                setPatient(patient);
            } catch (error) {
                setError('Failed to fetch');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchPatient();
    }, [ id ]);

    const submitNewEntry = async ( values: EntryWithoutId ): Promise<void> => {
        if ( !id ) throw new Error('No patient ID');

        const patient = await patientService.createPatientEntry(id, values);
        setPatient(patient);
    };

    if ( loading ) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if ( !patient ) {
        return <div>Patient not found</div>;
    }

    const genderIcon = patient.gender === 'male' ? <MaleIcon/> : patient.gender === 'female' ? <FemaleIcon/> :
        <TransgenderIcon/>;

    return (
        <div className="App">
            <h2>{ patient.name } { genderIcon }</h2>
            <p>SSN: { patient.ssn }</p>
            <p>Occupation: { patient.occupation }</p>
            <AddEntryModal
                modalOpen={ modalOpen }
                patientName={ patient?.name }
                error={ error }
                onSubmit={ submitNewEntry }
                diagnosis={ diagnosis }
                onClose={ closeModal }
            />
            <Button variant="contained" onClick={ () => openModal() }>
                Add New Entry
            </Button>
            { error && <Alert severity="error" style={ { whiteSpace: 'pre-line' } }>{ error }</Alert> }
            { patient.entries.length > 0 && (<h3>Entries</h3>) }
            <div>
                { patient.entries.map(entry => (
                    <div key={ entry.id }>
                        <EntryDetails entry={ entry } diagnosis={ diagnosis }/>
                    </div>
                )) }
            </div>
        </div>
    );
};

export default PatientView;