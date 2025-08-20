import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

const GenericTable = ({ title, columns, data }) => {
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      {title && (
        <Typography variant="h6" fontWeight="bold" p={2}>
          {title}
        </Typography>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell key={index} sx={{ fontWeight: "bold" }}>
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <TableCell key={colIndex}>
                    {col.render ? col.render(row) : row[col.field]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                Aucun enregistrement trouvé
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GenericTable;
