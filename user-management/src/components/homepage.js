import React, { useState, useEffect } from 'react';
import {
  setUserList,
  loadNextPage,
  resetConfig
} from '../redux/action-creators/users';
import { connect } from 'react-redux';
import {
  initUser,
  initEdit,
  deleteUser,
  changeSortType,
  changeSearchText,
  getSuperior,
  getSubordinates
} from '../redux/action-creators/users';
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
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

const HomePage = ({
  users,
  setUserList,
  history,
  deleteUser,
  loadNextPage,
  isLoading,
  config,
  resetConfig,
  changeSortType,
  changeSearchText,
  getSuperior,
  getSubordinates
}) => {
  const { pageSize, pageNumber } = config;
  const [query, setQuery] = useState('');
  const handleSearch = e => {
    setQuery(e.target.value);
    changeSearchText(e.target.value);
    setUserList(config);
  };

  useEffect(() => {
    resetConfig();
  }, []);

  const handleCreate = e => {
    history.push('/createuser');
  };

  const handleEdit = id => {
    history.push(`/edituser/${id}`);
  };


  const handleDelete = (id, users) => {
    deleteUser(id, users);
  };

  const order = [
    'name',
    'sex',
    'rank',
    'startdate',
    'phone',
    'email',
    'superiorname'
  ];
  const [asc, setAsc] = useState(true);
  const handleSort = e => {
    const typ = order.indexOf(e.target.id);
    if (asc) {
      setAsc(!asc);
      changeSortType(2 * typ + 1);
      setUserList(config);
    } else {
      setAsc(!asc);
      changeSortType(2 * typ + 2);
      setUserList(config);
    }
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
              value={query}
              onChange={e => {
                handleSearch(e);
              }}
            />
          <Button
            onClick={resetConfig}
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
                  loadNextPage(config, users);
                }}
                hasMore={users.length / pageSize === pageNumber - 1}
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>ALL SOLDIER</b>
                  </p>
                }
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Profile</TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='name'
                      >
                        Name
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 1 && <ArrowUpwardIcon />}
                          {config.sortType === 2 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='sex'
                      >
                        Sex
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 3 && <ArrowUpwardIcon />}
                          {config.sortType === 4 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='rank'
                      >
                        Rank
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 5 && <ArrowUpwardIcon />}
                          {config.sortType === 6 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='startdate'
                      >
                        Start Date
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 7 && <ArrowUpwardIcon />}
                          {config.sortType === 8 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='phone'
                      >
                        Phone
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 9 && <ArrowUpwardIcon />}
                          {config.sortType === 10 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='email'
                      >
                        Email
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 11 && <ArrowUpwardIcon />}
                          {config.sortType === 12 && <ArrowDownwardIcon />}
                        </span>
                      </TableCell>
                      <TableCell
                        align='right'
                        onClick={e => {
                          handleSort(e);
                        }}
                        id='superiorname'
                      >
                        Superior
                        <span style={{ position: 'relative', top: 5 }}>
                          {config.sortType === 13 && <ArrowUpwardIcon />}
                          {config.sortType === 14 && <ArrowDownwardIcon />}
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
    loadNextPage: (config, users) => dispatch(loadNextPage(config, users)),
    resetConfig: () => dispatch(resetConfig()),
    changeSortType: typ => dispatch(changeSortType(typ)),
    changeSearchText: query => dispatch(changeSearchText(query)),
    getSuperior: id => dispatch(getSuperior(id)),
    getSubordinates: (id, len) => dispatch(getSubordinates(id, len))
  };
};

export default connect(
  mapStateToProps,
  mapStateToDispatch
)(HomePage);
