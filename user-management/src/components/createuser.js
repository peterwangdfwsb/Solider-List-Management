import React, { useState, useEffect, useRef } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { createUser, initUser,setUserList } from '../redux/action-creators/users';
import { Loading } from './load';
import axios from 'axios';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import { FormLabel, InputLabel } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import 'date-fns';

const CreateUser = ({
  createUser,
  history,
  createSuccess,
  isLoading,
  setUserList,
  superiorList
}) => {
  const inf = Number.MAX_SAFE_INTEGER;
  useEffect(
    () =>
      setUserList({ pageSize: inf, pageNumber: 1, searchText: '__NO_SEARCH_TEXT__', superiorId: '__NO_SUPERIOR_ID__'}),
    []);

  const [userData, setUserData] = useState({
    avatar:
      'https://www.linkpicture.com/q/下載_2.png',

    name: '',
    sex: '',
    rank: '',
    startdate: '',
    phone: '',
    email: '',
    superior: '' 
  });

  const {
    avatar,
    name,
    sex,
    rank,
    startdate,
    phone,
    email,
    superior
  } = userData;

  const handleCreate = e => {
    e.preventDefault();
    createUser({
      avatar,
      name,
      sex,
      rank,
      startdate,
      phone,
      email,
      superior
    });
  };

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };


  const handleBack = () => {
    history.push('/');
  };

  const rankList = ['General', 'Colonel', 'Major', 'Private'];

  const [file, setFile] = useState(null);

  const handleSelect = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = e => {
    const fd = new FormData();
    fd.append('image', file);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };
    axios
      .post('http://localhost:5000/upload', fd, config)
      .then(res => {
        setUserData({ ...userData, avatar: `http://localhost:5000/${res.data.filePath}` });
      })
      .catch(err => console.log(err));
  };

  const handleSelectRef = () => {
    uploadEl.current.click();
  };

  const uploadEl = useRef(null);

  const useStyles = makeStyles(theme => ({
    layout: {
      width: 'auto',
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
        width: 600,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
    },
    paper: {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      padding: theme.spacing(2),
      [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
        marginTop: theme.spacing(6),
        marginBottom: theme.spacing(6),
        padding: theme.spacing(3)
      }
    },
    sex: {
      position: 'relative',
      top: theme.spacing(1.7),
      marginRight: theme.spacing(2),
      color: 'black'
    },
    buttons: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    button: {
      marginTop: theme.spacing(1),
      marginLeft: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    fillSpace: {
      width: theme.spacing(15),
      margin: theme.spacing(1, 1, 1, 1)
    },
    badge: {
      width: theme.spacing(5),
      margin: theme.spacing(1, 1, 1, 0)
    },
    formName: {
      marginTop: theme.spacing(1)
    },
    avatarHead: {
      textAlign: 'center'
    },
    avatar: {
      margin: '0 auto',
      width: theme.spacing(30),
      height: theme.spacing(30)
    },
    uploadButtons: {
      margin: '0 auto',
      padding: theme.spacing(0, 0, 0, 1)
    }
  }));

  const classes = useStyles();

  return (
    <div>
    {createSuccess ? (
      <Redirect to='/' />
    ) : isLoading ? (
      <Loading />
    ) : (
        <div>
          <main 
          className={classes.layout}
          >
            <Paper 
            className={classes.paper}
            >
              <form onSubmit={handleCreate}>
                <div 
                className={classes.buttons}
                >
                  <img
                    className={classes.badge}
                    src='https://www.linkpicture.com/q/depositphotos_103266082-stock-illustration-us-army-emblem-flag-of.jpeg'
                  />
                  <Typography
                    className={classes.formName}
                    variant='h4'
                    gutterBottom
                  >
                    New Soldier
                  </Typography>
                  <div 
                  className={classes.fillSpace} 
                  />

                  <Button
                    variant='contained'
                    onClick={handleBack}
                    className={classes.button}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    type='submit'
                    className={classes.button}
                  >
                    Save
                  </Button>
                </div>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6} lg={6}>
                    <div
                      className={classes.avatarHead}
                    >
                      Profile
                    </div>
                    <br />
                    <div className={classes.avatar}>
                      <img
                        alt='avatar'
                        src={avatar}
                        id='avatar'
                        name='avatar-preview'
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>

                    <input
                      name='avatar-upload'
                      accept='image/*'
                      style={{ display: 'none' }}
                      onChange={handleSelect}
                      ref={uploadEl}
                      multiple
                      type='file'
                    />
                    <div className={classes.uploadButtons}>
                      <div>
                        <Button
                          variant='contained'
                          className={classes.button}
                          onClick={handleSelectRef}
                        >
                          Choose
                        </Button>
                        
                        <Button
                          variant='contained'
                          className={classes.button}
                          onClick={handleUpload}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6} lg={6}>
                    <TextField
                      required
                      id='name'
                      name='name'
                      value={name}
                      onChange={handleChange}
                      label='Name'
                    />
                    <FormControl fullWidth>
                      <InputLabel htmlFor='rank-native-helper'>Rank</InputLabel>
                      <Select
                        native
                        value={rank}
                        onChange={handleChange}
                        inputProps={{ name: 'rank', id: 'rank-native-helper' }}
                      >
                        <option value='' />
                        {rankList.map((rank, id) => {
                          return <option value={rank} key={id}>{rank}</option>;
                        })}
                      </Select>
                    </FormControl>

                    <RadioGroup
                      name='sex'
                      aria-label='sex'
                      value={sex}
                      onChange={handleChange}
                      row
                    >
                      <FormLabel className={classes.sex}>Sex: </FormLabel>
                      {['Male', 'Female'].map((sex, id) => (
                        <FormControlLabel
                          value={sex}
                          control={<Radio />}
                          label={sex}
                          key={id}
                        />
                      ))}
                    </RadioGroup>

                    <TextField
                      required
                      id='startdate'
                      name='startdate'
                      value={startdate}
                      onChange={handleChange}
                      label='Start Date'
                    />

                    <TextField
                      required
                      id='phone'
                      name='phone'
                      value={phone}
                      onChange={handleChange}
                      label='Office Phone'
                    />

                    <TextField
                      required
                      id='email'
                      name='email'
                      value={email}
                      onChange={handleChange}
                      label='Email'
                    />

                    <FormControl fullWidth>
                      <InputLabel htmlFor='superior-native-helper'>
                        Superior
                      </InputLabel>
                      <Select
                        native
                        value={superior._id}
                        onChange={handleChange}
                        inputProps={{
                          name: 'superior',
                          id: 'superior-native-helper'
                        }}
                      >
                        <option value='' />
                        {superiorList.map((superior, id) => {
                          return (
                            <option value={superior._id} key={id}>
                              {superior.name}
                            </option>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </main>
        </div>
        )}
        </div>
  );
};

const mapStateToProps = state => {
  return {
    createSuccess: state.createUser.createSuccess,
    isLoading: state.createUser.isLoading,
    error: state.createUser.error,
    superiorList: state.users.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setUserList: config => dispatch(setUserList(config)),
    createUser: data => dispatch(createUser(data)),
    initUser: () => dispatch(initUser())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateUser);
