import EntryBase from "./EntryBase.tsx";
import { Box } from "@mui/material";
import { Diagnosis, OccupationalHealthcareEntry } from "../../types.ts";

interface EntryBaseProps {
    entry: OccupationalHealthcareEntry;
    header?: string;
    diagnosis?: Diagnosis[]
}

const OccupationalHealthcare = ( { entry, diagnosis }: EntryBaseProps ) => (
    <Box component="section" sx={ { p: 2, border: '1px solid grey', marginBottom: 1 } }>
        <EntryBase entry={ entry } diagnosis={ diagnosis } header="Occupational Healthcare"/>
        <Box sx={ {
            p: 1, border: '1px dashed grey', marginBottom: 1
        } }>Employer: <strong>{ entry.employerName }</strong></Box>
        {
            entry.sickLeave && (
                <Box sx={ {
                    p: 1, border: '1px dashed grey',
                } }>
                    <Box sx={ { p: 1, fontSize: '1.2rem', alignItems: 'center', marginBottom: 1 } }>
                        Sick Leave
                    </Box>

                    <Box sx={ { p: 1, fontSize: '1rem', alignItems: 'center' } }>
                        Start date: <strong>{ entry.sickLeave?.startDate }</strong>
                    </Box>
                    <Box sx={ { p: 1, fontSize: '1rem', alignItems: 'center' } }>
                        End date: <strong>{ entry.sickLeave?.endDate }</strong>
                    </Box>
                </Box>
            )
        }
    </Box>
);

export default OccupationalHealthcare;