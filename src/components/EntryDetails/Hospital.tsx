import { Box, Chip } from "@mui/material";
import EntryBase from "./EntryBase.tsx";
import type { Diagnosis, HospitalEntry } from "../../types.ts";

interface EntryBaseProps {
    entry: HospitalEntry;
    header?: string;
    diagnosis?: Diagnosis[]
}

const Hospital = ( { entry, diagnosis }: EntryBaseProps ) => (
    <Box component="section" sx={ { p: 2, border: '1px solid grey', marginBottom: 1 } }>
        <EntryBase entry={ entry } diagnosis={ diagnosis } header="Hospital"/>
        <Box sx={ {
            border: '1px dashed grey',
            display: 'flex',
            justifyContent: 'space-between',
            paddingRight: 2
        } }>
            <Box sx={ { p: 2 } }>
                <Chip color="secondary" label={ entry.discharge?.date } variant="outlined"
                      sx={ { marginRight: 2, fontSize: '1rem' } }/>
                <i style={ { fontSize: '1.2rem' } }>{ entry.discharge?.criteria }</i>
            </Box>
            <Chip variant="outlined" color="success" label="Discharged"
                  sx={ {
                      p: 3,
                      fontSize: '2rem',
                      fontStyle: 'italic',
                      alignSelf: 'center',
                      opacity: 0.8
                  } }/>
        </Box>
    </Box>
);

export default Hospital;