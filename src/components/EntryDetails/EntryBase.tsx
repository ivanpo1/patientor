import { Box, Chip, Tooltip } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { EntryBaseProps } from "./index.tsx";

const EntryBase = ( { entry, header, diagnosis }: EntryBaseProps ) => (
    <>
        <Box sx={ {
            textAlign: 'center',
            fontSize: '24px',
            opacity: 0.8,
            fontWeight: 'bold'
        } }>{ header }</Box>

        <Box component="section"
             sx={ {
                 p: 2,
                 border: '1px dashed grey',
                 display: 'flex',
                 justifyContent: 'space-between',
                 alignItems: 'center',
                 gap: 1,
                 marginTop: 2,
                 marginBottom: 1,
             } }>
            <Box sx={ { display: 'flex', alignItems: 'center', gap: 1 } }>
                <Chip color="secondary" label={ entry.date } variant="outlined"
                      sx={ { fontSize: '1rem', marginRight: 2 } }/>
                <i style={ { fontSize: '1.2rem' } }>
                    { entry.description }
                </i>
            </Box>
            <Tooltip title="Specialist">
                <Chip icon={ <FaceIcon/> } label={ entry.specialist } variant="outlined"/>
            </Tooltip>
        </Box>
        { entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (entry.diagnosisCodes?.map(code =>
            (
                <Box key={ code } sx={ {
                    display: 'flex', border: '1px dashed grey', alignItems: 'center', gap: 1, marginBottom: 1, p: 2,
                } }>
                    <Chip variant="outlined" color="info" label={ code }/>
                    { diagnosis?.map(d => {
                        if ( d.code === code ) {
                            return (<i key={ code } style={ { fontSize: '1.2rem' } }>{ d.name }</i>);
                        }
                    }) }
                </Box>
            ))) }

    </>
);

export default EntryBase;