import type {Diagnosis, Entry, HealthCheckRating} from "../../types.ts";
import {Box, Chip, Tooltip} from "@mui/material";
import FaceIcon from '@mui/icons-material/Face';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

interface EntryBaseProps {
    entry: Entry;
    header?: string;
    diagnosis?: Diagnosis[]
}

const EntryBase = ({entry, header, diagnosis}: EntryBaseProps) => (
    <>
        <Box sx={{
            textAlign: 'center',
            fontSize: '24px',
            opacity: 0.8,
            fontWeight: 'bold'
        }}>{header}</Box>

        <Box
            component="section"
            sx={{
                p: 2,
                border: '1px dashed grey',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 1,
                marginTop: 2,
                marginBottom: 1,
            }}
        >
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Chip color="secondary" label={entry.date} variant="outlined" sx={{fontSize: '1rem', marginRight: 2}}/>
                <i style={{fontSize: '1.2rem', color: 'gray'}}>
                    {entry.description}
                </i>
            </Box>
            <Tooltip title="Specialist">
            <Chip icon={<FaceIcon/>} label={entry.specialist} variant="outlined"/>
            </Tooltip>
        </Box>
        {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (entry.diagnosisCodes?.map(code =>
            (<Box key={code} sx={{
                    display: 'flex',
                    border: '1px dashed grey', alignItems: 'center', gap: 1
                    , marginBottom: 1,
                    p: 2,
                }}>
                    <Chip variant="outlined" color="info" label={code}/>
                    {diagnosis?.map(d => {
                        if (d.code === code) {
                            return (<i key={code} style={{fontSize: '1rem'}}>{d.name}</i>)
                        }
                    })}

                </Box>
            )))}

    </>
)

const buildHealthRating = (healthCheckRating: HealthCheckRating) => {
    return Array.from({length: 4}, (_, index) => {
        const isFilled = index < (4 - healthCheckRating)
        return isFilled ? <StarIcon key={index}/> : <StarBorderIcon key={index}/>
    })
}

const EntryDetails = ({entry, diagnosis}: EntryBaseProps) => {
    switch (entry.type) {
        case "HealthCheck":
            return (
                <Box component="section" sx={{p: 2, border: '1px solid grey', marginBottom: 1}}>
                    <EntryBase entry={entry} diagnosis={diagnosis} header="Health Check"/>
                    <Box component="section" sx={{
                        p: 2,
                        border: '1px dashed grey',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>Health Rating</div>
                        <div>
                            {buildHealthRating(entry.healthCheckRating)}
                        </div>
                    </Box>
                </Box>
            )
        case "Hospital":
            return (
                <Box component="section" sx={{p: 2, border: '1px solid grey', marginBottom: 1}}>

                    <EntryBase entry={entry} diagnosis={diagnosis} header="Hospital"/>

                    <Box sx={{border: '1px dashed grey', display: 'flex', justifyContent: 'space-between', paddingRight: 2}}>

                        <Box sx={{p: 2}}>
                            <Chip color="secondary" label={entry.discharge?.date} variant="outlined"
                                  sx={{marginRight: 2, fontSize: '1rem'}}/>
                            <i style={{fontSize: '1.2rem', color: 'gray'}}>{entry.discharge?.criteria}</i>
                        </Box>
                        <Chip variant="outlined" color="success" label="Discharged" sx={{p: 3, fontSize: '2rem', fontStyle: 'italic', alignSelf: 'center', opacity: 0.8}}/>
                    </Box>

                </Box>
            )
        case "OccupationalHealthcare":
            return (
                <Box component="section" sx={{p: 2, border: '1px solid grey', marginBottom: 1}}>
                    <EntryBase entry={entry} diagnosis={diagnosis} header="Occupational Healthcare"/>
                    <Box sx={{
                        p: 1, border: '1px dashed grey', marginBottom: 1
                    }}>Employer: <strong>{entry.employerName}</strong></Box>
                    {
                        entry.sickLeave && (
                            <Box sx={{
                                p: 1, border: '1px dashed grey',
                            }}>
                                <Box sx={{p: 1, fontSize: '1.2rem', alignItems: 'center', marginBottom: 1}}>
                                    Sick Leave
                                </Box>

                                <Box sx={{p: 1, fontSize: '1rem', alignItems: 'center'}}>
                                    Start date: <strong>{entry.sickLeave?.startDate}</strong>
                                </Box>
                                <Box sx={{p: 1, fontSize: '1rem', alignItems: 'center'}}>
                                    End date: <strong>{entry.sickLeave?.endDate}</strong>
                                </Box>
                            </Box>
                        )
                    }
                </Box>
            )
        default:
            return assertNever(entry)
    }
}

export default EntryDetails;