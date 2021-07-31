import React, { useState, useEffect } from 'react';
import { setUserList, infiniteScrolling, fetchUsers } from '../redux/action-creators/users';
import { connect } from 'react-redux';
import { initUser, initEdit, deleteUser, changeSearchText, getSuperior, getSubordinates } from '../redux/action-creators/users';
import { Loading } from './load';
import InfiniteScroll from 'react-infinite-scroll-component';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import InputBase from '@material-ui/core/InputBase';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';


const HomePage = ({
  users,
  setUserList,
  history,
  deleteUser,
  isLoading,
  config,
  changeSearchText,
  getSuperior,
  getSubordinates,
  infiniteScrolling,
  fetchUsers
}) => {
  
  useEffect(() => {
    fetchUsers();
    //setUserList(config);
  }, []);
  
  const { pageSize, pageNumber, searchText, superiorId } = config;
  const [search, setSearch] = useState('');
  const handleSearch = e => {
    changeSearchText(e.target.value);
    setSearch(e.target.value);
    setUserList(config);
  };

  const handleCreate = e => {
    history.push('/createuser');
    console.log(pageNumber);
  };

  const handleEdit = id => {
    history.push(`/edituser/${id}`);
  };


  const handleDelete = (id, users) => {
    deleteUser(id, users);
  };
 
  return (
    <div>
      <AppBar position='static' color='transparent'>
          <div>
          <h2 align='center'><img src='https://www.linkpicture.com/q/depositphotos_103266082-stock-illustration-us-army-emblem-flag-of.jpeg' width="80" height="80"/> US Army Personnel Registry  </h2>
          </div>
          <Toolbar>
            <InputBase
              placeholder='SEARCH…'
              type='search'
              value={search}
              onChange={e => {
                handleSearch(e);
              }}
            />
          <Button
            onClick={fetchUsers}
            >
            RESET
          </Button>
          <Button
          onClick={handleCreate}>
              CREATE
          </Button>
        </Toolbar>
      </AppBar>
      <div>
        {isLoading ? (
          <Loading />
        ) : (
          <div>
            <Paper>
            <InfiniteScroll
                dataLength={users.length}
                next={() => {
                  infiniteScrolling(config, users)
                }}
                hasMore={users.length / pageSize === pageNumber - 1 }
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>All Users</b>
                  </p>
                }
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile</TableCell>
                      <TableCell
                        align='right'
                        id='name'
                      >
                        Name
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='sex'
                      >
                        Sex
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='rank'
                      >
                        Rank
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='startdate'
                      >
                        Start Date
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='phone'
                      >
                        Phone
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='email'
                      >
                        Email
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        id='superiorname'
                      >
                        Superior
                        <span style={{ position: 'relative', top: 5 }}>
                        </span>
                      </TableCell>
                      <TableCell align='right'># of D.S.</TableCell>
                      <TableCell align='center'>Edit</TableCell>
                      <TableCell align='center'>Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user._id}>
                        <TableCell component='th' scope='row'>
                          <Grid container alignItems='center'>
                            <Avatar
                              src={user.avatar}
                            />
                          </Grid>
                        </TableCell>
                        <TableCell align='right'>
                          {user.name}
                        </TableCell>
                        <TableCell align='right'>
                          {user.sex}
                        </TableCell>
                        <TableCell align='right'>
                          {user.rank}
                        </TableCell>
                        <TableCell align='right'>
                          {user.startdate}
                        </TableCell>
                        <TableCell align='right'>
                          <a href={'tel: ' + user.phone}>{user.phone}</a>
                        </TableCell>
                        <TableCell align='right'>
                          <a href={'mailto: ' + user.email}>{user.email}</a>
                        </TableCell>
                        <TableCell
                          align='right'
                          onClick={() => getSuperior(user.superior)}
                        >
                          {user.superiorname}
                        </TableCell>
                        <TableCell
                          align='right'
                          onClick={() =>
                            getSubordinates(
                              user._id,
                              user.directsubordinates.length
                            )
                          }
                        >
                          {user.directsubordinates.length}
                        </TableCell>
                        <TableCell align='right'>
                        <Button
                            aria-label='edit'
                            onClick={() => {
                            handleEdit(user._id);
                        }}>
                        <EditIcon />
                        </Button>
                        </TableCell>
                        <TableCell align='right'>
                          <Button
                            aria-label='delete'
                            onClick={() => {
                              handleDelete(user._id, users);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </InfiniteScroll>
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    users: state.users.users,
    isLoading: state.users.isLoading,
    error: state.users.error,
    deleteError: state.users.deleteError,
    config: state.users.config,
  };
};

const mapStateToDispatch = dispatch => {
  return {
    setUserList: config => dispatch(setUserList(config)),
    initUser: () => dispatch(initUser()),
    initEdit: () => dispatch(initEdit()),
    deleteUser: (id, users) => dispatch(deleteUser(id, users)),
    changeSearchText: query => dispatch(changeSearchText(query)),
    getSuperior: id => dispatch(getSuperior(id)),
    getSubordinates: (id, len) => dispatch(getSubordinates(id, len)),
    infiniteScrolling: (config, users) => dispatch(infiniteScrolling(config, users)),
    fetchUsers: () => dispatch(fetchUsers())
    
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(HomePage);
