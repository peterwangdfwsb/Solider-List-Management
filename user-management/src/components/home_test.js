import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
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

import { withStyles } from '@material-ui/core/styles';
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

const Home_test = ({
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
  const { pageSize, pageNumber, sortType, searchText, superiorId } = config;
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

  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.blue,
      color: theme.palette.common.black
    },
    body: {
      fontSize: 16
    }
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default
      }
    }
  }))(TableRow);

  return (
    <div>
      <AppBar position='static' color='transparent'>
          <div>
          <h2 align='center'><img src='https://www.linkpicture.com/q/depositphotos_103266082-stock-illustration-us-army-emblem-flag-of.jpeg' width="80" height="80"/> US Army Personnel Registry  </h2>
          </div>
          <Toolbar>
            <InputBase
              placeholder='Search…'
              type='search'
              value={query}
              onChange={e => {
                handleSearch(e);
              }}
            />
          <button
            onClick={resetConfig}
            >
            Reset
          </button>
          <Link to={'/createuser'}>
              <button>
                  CREATE
              </button>
          </Link>
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
                {/*<Table className={classes.table} size='small'>*/}
                <Table>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Avatar</StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell
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
                      </StyledTableCell>
                      <StyledTableCell align='right'># of D.S.</StyledTableCell>
                      <StyledTableCell align='center'>Edit</StyledTableCell>
                      <StyledTableCell align='center'>Delete</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map(user => (
                      <StyledTableRow key={user._id}>
                        <StyledTableCell component='th' scope='row'>
                          <Grid container justify='center' alignItems='center'>
                            <Avatar
                              alt='Remy Sharp'
                              src={user.avatar}
                            />
                            {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" className={classes.bigAvatar} /> */}
                          </Grid>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {user.name}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {user.sex}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {user.rank}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          {//user.startdate.slice(0, 10)
                          user.startdate}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <a href={'tel: ' + user.phone}>{user.phone}</a>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <a href={'mailto: ' + user.email}>{user.email}</a>
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          onClick={() => getSuperior(user.superior)}
                        >
                          {user.superiorname}
                        </StyledTableCell>
                        <StyledTableCell
                          align='right'
                          onClick={() =>
                            getSubordinates(
                              user._id,
                              user.directsubordinates.length
                            )
                          }
                        >
                          {user.directsubordinates.length}
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                        <Button
                            aria-label='edit'
                            onClick={() => {
                            handleEdit(user._id);
                        }}>
                        <EditIcon />
                        </Button>
                        </StyledTableCell>
                        <StyledTableCell align='right'>
                          <Button
                            aria-label='delete'
                            onClick={() => {
                              handleDelete(user._id, users);
                            }}
                          >
                            <DeleteIcon />
                          </Button>
                        </StyledTableCell>
                      </StyledTableRow>
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
    alertContent: state.alert.alertContent
    // lock: state.users.lock
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
)(Home_test);
