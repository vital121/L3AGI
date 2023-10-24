import { useState } from 'react'
import { useTable } from 'react-table'
import styled, { css } from 'styled-components'
import TableCell from './components/TableCell'

type ColumnProps = {
  Header: any
  accessor: string
  isEdit?: boolean
  cellEditor?: any
  cellEditorParams?: any
  valueSetter?: any
  maxWidth?: number
}

type TableProps = {
  columns: ColumnProps[]
  data: any
}

const Table = ({ columns, data }: TableProps) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  return (
    <StyledRoot>
      <StyledTable {...getTableProps()}>
        <StyledThead>
          {headerGroups.map((headerGroup: any, index: number) => (
            <StyledTr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any, index: number) => (
                <StyledTh key={index} {...column.getHeaderProps()} maxWidth={column.maxWidth}>
                  {column.render('Header')}
                </StyledTh>
              ))}
            </StyledTr>
          ))}
        </StyledThead>
        <StyledTbody {...getTableBodyProps()}>
          {rows.map((row: any, index: number) => {
            prepareRow(row)
            return (
              <StyledTr {...row.getRowProps()} key={index} bodyRow>
                {row.cells.map((cell: any, index: number) => {
                  const { column } = cell
                  const { isEdit, cellEditor } = column

                  return <TableCell key={index} cell={cell} />
                })}
              </StyledTr>
            )
          })}
        </StyledTbody>
      </StyledTable>
    </StyledRoot>
  )
}

export default Table

const StyledRoot = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;

  /* height: 100vh; */
  border-radius: 24px;
  max-height: calc(100vh - 300px);
`

const StyledTable = styled.table`
  min-height: 200px;
  width: 100%;

  color: ${({ theme }) => theme.typography.contentPrimary};

  background-color: ${({ theme }) => theme.body.tableBackgroundColor};

  overflow: hidden;
`
const StyledThead = styled.thead`
  background-color: ${({ theme }) => theme.body.tableBackgroundColor};

  width: 100%;

  display: flex;

  position: sticky;
  top: 0px;
  margin: 0 0 0 0;
`
const StyledTbody = styled.tbody`
  width: 100%;

  /* height: 100%; */

  display: flex;
  flex-direction: column;
`

const StyledTr = styled.tr<{ bodyRow?: boolean }>`
  width: 100%;

  height: 40px;

  display: flex;

  :hover {
    ${p =>
      p.bodyRow &&
      css`
        background-color: rgba(255, 255, 255, 0.2);
      `};
  }
`
const StyledTh = styled.th<{ maxWidth: number }>`
  width: 100%;
  /* max-width: ${p => (p.maxWidth ? `${p.maxWidth}px` : '100%')}; */

  text-align: center;

  padding: 10px 20px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(0, 0, 0, 0.2);

  overflow: hidden;
  :hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`