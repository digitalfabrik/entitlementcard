import { Box, BoxProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface CalloutProps {
  children: ReactNode;
  color?: 'warning' | 'error' | 'info' | 'success';
  sx?: BoxProps['sx'];
}

export const Callout = ({ children, color = 'info', sx, ...props }: CalloutProps) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        bgcolor: theme.palette[color].light,
        padding: 2,
        ...sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
};