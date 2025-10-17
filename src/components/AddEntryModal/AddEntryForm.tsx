import { useState } from "react";
import { Alert, Box, Button, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { Diagnosis, EntryWithoutId, HealthCheckRating } from "../../types.ts";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";
import * as React from "react";

interface Props {
    onCancel: () => void;
    onSubmit: ( values: EntryWithoutId ) => Promise<void>;
    diagnosis: Diagnosis[];
}

const assertNever = ( value: never ): never => {
    throw new Error(
        `Unhandled discriminated union member: ${ JSON.stringify(value) }`
    );
};

const EntryForm = ( { onSubmit, onCancel, diagnosis }: Props ) => {
    const [ description, setDescription ] = useState<string>('');
    const [ date, setDate ] = useState<string>('');
    const [ specialist, setSpecialist ] = useState<string>('');
    const [ diagnosisCodes, setDiagnosisCodes ] = useState([ diagnosis[0].code ]);

    const [ type, setType ] = useState<EntryWithoutId['type']>('OccupationalHealthcare');

    const [ healthCheckRating, setHealthCheckRating ] = useState(HealthCheckRating.Healthy);
    const [ employerName, setEmployerName ] = useState('');
    const [ sickLeave, setSickLeave ] = useState({ startDate: '', endDate: '' });
    const [ discharge, setDischarge ] = useState({ date: '', criteria: '' });

    const [ submitError, setSubmitError ] = useState('');

    const addEntry = async ( event: React.FormEvent ) => {
        event.preventDefault();

        try {
            const baseData = { description, date, specialist, diagnosisCodes };

            let entryData: EntryWithoutId;

            switch (type) {
                case 'HealthCheck':
                    entryData = { ...baseData, type: 'HealthCheck', healthCheckRating };
                    break;
                case 'Hospital':
                    entryData = { ...baseData, type: 'Hospital', discharge };
                    break;
                case 'OccupationalHealthcare':
                    const sickLeaveValid =
                        sickLeave?.startDate?.trim() && sickLeave?.endDate?.trim();

                    entryData = {
                        ...baseData,
                        type: 'OccupationalHealthcare',
                        employerName, ...(sickLeaveValid ? { sickLeave } : {})
                    };
                    break;
                default:
                    return assertNever(type);
            }

            await onSubmit(entryData);
            resetForm();
        } catch (e: unknown) {
            if ( axios.isAxiosError(e) ) {
                const errorData = e?.response?.data;
                if ( errorData?.error && Array.isArray(errorData.error) ) {
                    const message = errorData.error.map(( error: {
                        message: string;
                    }, index: number ) => `${ index + 1 }. ${ error.message }`).join('\n');
                    setSubmitError(message);
                } else if ( typeof errorData === "string" ) {
                    setSubmitError(errorData);
                } else {
                    setSubmitError("An error occurred");
                }
            } else {
                console.error("Unknown error", e);
                setSubmitError("Unknown error");
            }
        }
    };

    const resetForm = () => {
        setDescription('');
        setDate('');
        setSpecialist('');
        setDiagnosisCodes([ diagnosis[0].code ]);
        setHealthCheckRating(HealthCheckRating.Healthy);
        setEmployerName('');
        setSickLeave({ startDate: '', endDate: '' });
        setDischarge({ date: '', criteria: '' });
    };

    const onHealthCheckRatingChange = ( event: SelectChangeEvent ) => {
        event.preventDefault();
        setHealthCheckRating(Number(event.target.value));
    };

    const onDiagnosisCodeChange = ( event: SelectChangeEvent ) => {
        event.preventDefault();
        console.log([ event.target.value ]);
        setDiagnosisCodes([ event.target.value ]);
    };

    const healthCheckOptions = Object.entries(HealthCheckRating)
        .filter(( [ key, _value ] ) => isNaN(Number(key)))
        .map(( [ label, value ] ) => ({
            label,
            value,
        }));


    return (
        <div>
            <Box component="section" sx={ { p: 2, border: '1px dashed grey' } }>
                { submitError && <Alert severity="error" style={ { whiteSpace: 'pre-line' } }>{ submitError }</Alert> }
                <form onSubmit={ addEntry }>

                    <Box component="section" sx={ { p: 2, border: '2px dashed grey' } }
                         style={ { marginTop: 8, marginBottom: 12 } }
                    >
                        <InputLabel style={ { marginBottom: 12 } }>Entry Type</InputLabel>
                        <Select
                            fullWidth
                            value={ type }
                            onChange={ ( event ) => setType(event.target.value as EntryWithoutId['type']) }
                        >
                            <MenuItem value="HealthCheck">Health Check</MenuItem>
                            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
                            <MenuItem value="Hospital">Hospital</MenuItem>
                        </Select>
                    </Box>

                    <TextField
                        label="Description"
                        fullWidth
                        value={ description }
                        onChange={ ( { target } ) => setDescription(target.value) }
                        style={ { marginBottom: 12 } }
                    />

                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        value={ date }
                        onChange={ ( { target } ) => setDate(target.value) }
                        InputLabelProps={ { shrink: true } }
                        style={ { marginBottom: 8 } }
                    />

                    <TextField
                        label="Specialist"
                        placeholder="Dr. Emmet Brown"
                        fullWidth
                        value={ specialist }
                        onChange={ ( { target } ) => setSpecialist(target.value) }
                        style={ { marginBottom: 12 } }
                    />

                    <Select style={ { marginBottom: 12 } }
                            fullWidth
                            value={ diagnosisCodes.toString() }
                            onChange={ onDiagnosisCodeChange }
                    >
                        { diagnosis.map(option =>
                            <MenuItem
                                key={ option.code }
                                value={ option.code.toString() }
                            >
                                <strong>{ option.code }</strong> - <i>{ option.name }</i>
                            </MenuItem>
                        ) }
                    </Select>

                    { type && type === 'HealthCheck' &&
                        (
                            <>
                                <InputLabel style={ { marginTop: 8 } }>HealthCheck Rating</InputLabel>
                                <Select style={ { marginBottom: 12 } }
                                        fullWidth
                                        value={ healthCheckRating.toString() }
                                        onChange={ onHealthCheckRatingChange }
                                >
                                    { healthCheckOptions.map(option =>
                                        <MenuItem
                                            key={ option.label }
                                            value={ option.value.toString() }
                                        >
                                            { option.label }
                                        </MenuItem>
                                    ) }
                                </Select>
                            </>
                        )
                    }


                    { type && type === 'Hospital' &&
                        (
                            <>
                                <TextField
                                    label="Discharge Date"
                                    type="date"
                                    fullWidth
                                    value={ discharge.date }
                                    onChange={ ( { target } ) => setDischarge({ ...discharge, date: target.value }) }
                                    InputLabelProps={ { shrink: true } }
                                    style={ { marginTop: 8, marginBottom: 8 } }
                                />
                                <TextField
                                    label="Criteria"
                                    fullWidth
                                    value={ discharge.criteria }
                                    onChange={ ( { target } ) => setDischarge({
                                        ...discharge,
                                        criteria: target.value
                                    }) }
                                    style={ { marginBottom: 12 } }
                                />
                            </>
                        ) }

                    { type && type === 'OccupationalHealthcare' &&
                        (
                            <>
                                <TextField
                                    label="Employer Name"
                                    placeholder="Don Canelones Pastas & Coding on the Go"
                                    fullWidth
                                    value={ employerName }
                                    onChange={ ( { target } ) => setEmployerName(target.value) }
                                    style={ { marginBottom: 8 } }
                                />

                                <InputLabel
                                    style={ { marginBottom: 12 } }>
                                    Sick Leave</InputLabel>
                                <TextField
                                    label="Start Date"
                                    type="date"
                                    fullWidth
                                    value={ sickLeave.startDate }
                                    onChange={ ( { target } ) => setSickLeave({
                                        ...sickLeave,
                                        startDate: target.value
                                    }) }
                                    inputProps={ {
                                        max: sickLeave.endDate || undefined
                                    } }
                                    InputLabelProps={ { shrink: true } }
                                    style={ { marginBottom: 12 } }
                                />

                                <TextField
                                    label="End Date"
                                    type="date"
                                    fullWidth
                                    value={ sickLeave.endDate }
                                    onChange={ ( { target } ) => setSickLeave({ ...sickLeave, endDate: target.value }) }
                                    inputProps={ {
                                        min: sickLeave.startDate
                                    } }
                                    InputLabelProps={ { shrink: true } }
                                    style={ { marginBottom: 8 } }
                                />
                            </>
                        ) }


                    <Grid>
                        <Grid item>
                            <Button
                                color="secondary"
                                variant="contained"
                                type="button"
                                onClick={ onCancel }
                                size="small"
                                style={ {
                                    float: "inline-start",
                                } }
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button
                                type="submit"
                                variant="contained"
                                size="medium"
                                endIcon={ <SendIcon/> }
                                style={ {
                                    float: "inline-end",
                                } }
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </div>
    );
};

export default EntryForm;