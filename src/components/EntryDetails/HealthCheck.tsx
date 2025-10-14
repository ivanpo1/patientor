import { Box } from "@mui/material";
import type { Diagnosis, HealthCheckEntry, HealthCheckRating } from "../../types.ts";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import EntryBase from "./EntryBase.tsx";

interface EntryBaseProps {
    entry: HealthCheckEntry;
    header?: string;
    diagnosis?: Diagnosis[]
}

const buildHealthRating = ( healthCheckRating: HealthCheckRating ) => {
    return Array.from({ length: 4 }, ( _, index ) => {
        const isFilled = index < (4 - healthCheckRating);
        return isFilled ? <StarIcon key={ index }/> : <StarBorderIcon key={ index }/>;
    });
};

const HealthCheck = ( { entry, diagnosis }: EntryBaseProps ) =>
    (
        <Box component="section" sx={ { p: 2, border: '1px solid grey', marginBottom: 1 } }>
            <EntryBase entry={ entry } diagnosis={ diagnosis } header="Health Check"/>
            <Box component="section" sx={ {
                p: 2,
                border: '1px dashed grey',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            } }>
                <div>Health Rating</div>
                <div>
                    { buildHealthRating(entry.healthCheckRating) }
                </div>
            </Box>
        </Box>
    );

export default HealthCheck;