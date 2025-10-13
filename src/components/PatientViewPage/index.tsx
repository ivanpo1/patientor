import patientService from "../../services/patients";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {EntryWithoutId, Patient} from "../../types.ts";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import EntryDetails from "../EntryDetails";
import EntryForm from "../EntryForm";
import axios from "axios";
import {Alert} from "@mui/material";
import {Diagnosis} from '../../types.js'

interface Props {
    diagnosis: Diagnosis[]
}

const PatientView = ({ diagnosis }: Props) => {
    const {id} = useParams()
    const [patient, setPatient] = useState<Patient | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) {
                setError('No ID!')
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const patient = await patientService.getPatientById(id)
                setPatient(patient)
            } catch (error) {
                setError('Failed to fetch')
                console.error(error)
            } finally {
                setLoading(false)
            }
        }

        void fetchPatient()
    }, [id])

    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            const patient = await patientService.createPatientEntry(id, values);
            setPatient(patient)
        } catch (e: unknown) {
            if (axios.isAxiosError(e)) {
                const errorData = e?.response?.data;
                if (errorData?.error && Array.isArray(errorData.error)) {
                    console.log(errorData.error)
                    const message = errorData.error.map((error: { message: any; }, index: number) => `${index + 1}. ${error.message}`).join('\n')
                    setError(message);
                } else if (typeof errorData === "string") {
                    setError(errorData);
                } else {
                    setError("An error occurred");
                }
            } else {
                console.error("Unknown error", e);
                setError("Unknown error");
            }
        }
    };

    if (loading) {
        return <div>Loading data...</div>
    }

    // if (error) {
    //     return <Alert severity="error">{error}</Alert>
    // }

    if (!patient) {
        return <div>Patient not found</div>
    }

    const genderIcon = patient.gender === 'male' ? <MaleIcon/> : patient.gender === 'female' ? <FemaleIcon/> :
        <TransgenderIcon/>

    return (
        <div className="App">
            <h2>{patient.name} {genderIcon}</h2>
            <p>SSN: {patient.ssn}</p>
            <p>Occupation: {patient.occupation}</p>
            {error && <Alert severity="error" style={{ whiteSpace: 'pre-line' }}>{error}</Alert>}
            <EntryForm onSubmit={submitNewEntry} />
            {patient.entries.length > 0 && (<h3>Entries</h3>)}
            <div>
                {patient.entries.map(entry => (
                    <div key={entry.id}>
                        <EntryDetails entry={entry} diagnosis={diagnosis}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PatientView