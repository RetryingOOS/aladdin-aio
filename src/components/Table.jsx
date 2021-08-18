import {
  Header,
  Sidenav,
  Sidebar,
  Nav,
  Dropdown,
  Icon,
  Navbar,
  Container,
  Content,
  Notification,
  Affix,
  Table,
} from 'rsuite';

import React from 'react';

const { Column, HeaderCell, Cell, Pagination } = Table;
function createData(id, store, product, mode, size, profile, status) {
  return { id, store, product, mode, size, profile, status };
}
function size() {
  let sizes = Math.floor(Math.random() * 34) + 4;
  sizes /= 2;
  return sizes;
}
function passwordGenerator() {
  return Math.random().toString(25).substr(2, 6).toUpperCase();
}
const rows = [
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
  createData(
    passwordGenerator(),
    'Footlocker',
    'Dunk Low',
    'Fast',
    size(),
    'Main Debit',
    'Checked Out Successfully'
  ),
];

class FixedColumnTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: rows,
    };
  }

  render() {
    return (
      <div>
        <Table
          height={400}
          data={this.state.data}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column width={70} align="center">
            <HeaderCell>Id</HeaderCell>
            <Cell dataKey="id" />
          </Column>

          <Column width={200}>
            <HeaderCell>Store</HeaderCell>
            <Cell dataKey="store" />
          </Column>

          <Column width={200}>
            <HeaderCell>Product</HeaderCell>
            <Cell dataKey="product" />
          </Column>

          <Column width={200}>
            <HeaderCell>Size</HeaderCell>
            <Cell dataKey="size" />
          </Column>

          <Column width={200}>
            <HeaderCell>Profile</HeaderCell>
            <Cell dataKey="profile" />
          </Column>

          <Column width={300}>
            <HeaderCell>Status</HeaderCell>
            <Cell style={{color:"springgreen"}} dataKey="status" />
          </Column>
          <Column width={120} fixed="right">
            <HeaderCell>Action</HeaderCell>

            <Cell>
              {(rowData) => {
                function handleAction() {
                  alert(`id:${rowData.id}`);
                }
                return (
                  <span>
                    <Icon icon="play" onClick={handleAction} />
                    <Icon icon="stop" onClick={handleAction} />
                  </span>
                );
              }}
            </Cell>
          </Column>
        </Table>
      </div>
    );
  }
}

export default FixedColumnTable;
