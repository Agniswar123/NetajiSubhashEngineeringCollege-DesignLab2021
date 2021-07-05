import React, {useState, useEffect} from 'react';

import {makeStyles, useTheme} from '@material-ui/core/styles';
import {
  CssBaseline, 
  Typography, 
  AppBar, 
  Toolbar, 
  Button, 
  Box,
  Container,
  Card,
  CardContent, 
  CardActionArea,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@material-ui/core';

import AccountCircleTwoToneIcon from '@material-ui/icons/AccountCircleTwoTone';



const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    // backgroundImage: `url(https://images.unsplash.com/photo-1625120742520-3f085b6894ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80)`,
    // backgroundRepeat: 'no-repeat',
    // backgroundSize: 'cover',
    background: '#dfe0de',
    paddingBottom: theme.spacing(5)
  },
  card:{
    maxWidth: '100%',
    marginBottom: theme.spacing(4)
  },
  cardMedia:{
    height: '140px'
  }
}))

const LoginDialog = (props) => {
  const classes = useStyles();
  const { onClose, open, toggleLogin, handleLogin } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [invalidCreds, setInvalidCreds] = useState(false);
  const [unknownUser, setUnknownUser] = useState(false);

  const handleClose = () => {
    onClose();

  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/login',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({email, password})
    })

    if(response.status === 404){
      setUnknownUser(true);
    } else if( response.status === 401){
      setInvalidCreds(true);
    } else {
      handleLogin(await response.json());
      toggleLogin();
    }
    handleClose();
    
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="login-dialog-title" open={open}>

      <DialogTitle id="login-dialog-title">Login</DialogTitle>

      <form onSubmit={handleFormSubmit}>
        <DialogContent>
          
            <Box paddingBottom={2}>
                <TextField 
                id='email' 
                label='Email' 
                variant='outlined'
                color='primary'
                type='email'
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
                required={true}
                />
            </Box>

            <Box paddingBottom={2}>
                <TextField 
                id='password' 
                label='Password' 
                variant='outlined'
                color='primary'
                type='password'
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
                required={true}
                />
            </Box>
            {
              invalidCreds && (email.length>0 || password.length>0) &&
              <Typography variant='subtitle2' color='secondary'>Incorrent Email or Password!</Typography>
            }
            {
              unknownUser && (email.length>0 || password.length>0) &&
              <Typography variant='subtitle2' color='secondary'>User Does not Exist!</Typography>
            }

        </DialogContent>
        <DialogActions>
          <Button color='primary' type='submit'>Login</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

const BlogDialog = (props) =>{
  const theme = useTheme();
  const {onClose, open, handleBlogAdd, addBlog} = props;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [img, setImg] = useState('');

  const handleClose = () => {
    onClose();
  };

  const handleFormSubmit = e => {
    e.preventDefault(); 
    addBlog({title, content, img})
    handleClose();
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="blog-dialog-title" open={open} maxWidth='lg' fullWidth={true}>
      <DialogTitle id="blog-dialog-title">Blog</DialogTitle>
      <form onSubmit={handleFormSubmit} >
        <DialogContent>
          <Box paddingBottom={2}>
            <TextField 
            id='title' 
            label='Title' 
            variant='outlined'
            color='primary'
            type='text'
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
            required={true}
            />
          </Box>

          <Box paddingBottom={2}>
            <TextField 
            id='content' 
            label='Content' 
            variant='outlined'
            color='primary'
            type='text'
            fullWidth
            onChange={(e) => setContent(e.target.value)}
            multiline={true}
            rows={10}
            required={true}
            />
          </Box>

          <Box paddingBottom={2}>
            <TextField 
            id='img' 
            label='Image URL' 
            variant='outlined'
            color='primary'
            type='url'
            fullWidth
            onChange={(e) => setImg(e.target.value)}
            required={true}
            />
          </Box>

        </DialogContent>
        <DialogActions>
          <Button variant='outlined' color='primary' style={{textTransform: 'none'}} type='submit'>Add Blog</Button>
        </DialogActions>
      </form>
    </Dialog>
  )

}

function App() {
  const classes = useStyles();
  const theme = useTheme();

  const [loginDialog, setloginDialog] = useState(false);
  const [loggedIn, setloggedIn] = useState(false);
  const [loggedInUser, setloggedInUser] = useState({});
  const [blogs, setBlogs] = useState([])
  const [blogDialog, setblogDialog] = useState(false);

  useEffect(() => {
    async function fetchData(){
      const response = await fetch('/blogs');
      const temp = await response.json()
      setBlogs(temp);
    }
    fetchData();
    
  }, [blogs, setBlogs])

  const addBlog = async({title, content, img}) => {
    const response = await fetch('/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loggedInUser.token}`
      },
      body: JSON.stringify({email: loggedInUser.email, title, content, imageLink: img})
    })
  };

  const toggleLogin = () => {
    setloggedIn(!loggedIn);
  };

  const handleLogin = (user) => {
    setloggedInUser(user);
  };

  const handleLogout = () => {
    setloggedIn(!loggedIn);
    setloggedInUser({});
  }

  const handleLoginDialogOpen = () => {
    setloginDialog(true);
  };

  const handleLoginDialogClose = () => {
    setloginDialog(false);
  };

  const handleBlogDialogOpen = () => {
    setblogDialog(true);
  };

  const handleBlogDialogClose = () => {
    setblogDialog(false);
  };
  return (
    <div className={classes.root}>
      <CssBaseline/>
      <AppBar position="static">
        <Toolbar>
          <Box style={{background: 'none', flexGrow:1}}>
            <Typography variant="h5" className={classes.title}>
              <b>Agniswar's Blog</b>
            </Typography>
          </Box>
          {
            !loggedIn &&
            <Button variant='contained' color="secondary" onClick={handleLoginDialogOpen}>Login</Button>
          }
          {
            loggedIn &&
            <>
            <AccountCircleTwoToneIcon/> 
            <Box padding={1} paddingRight={4} >
            <Typography>{loggedInUser.email}</Typography>
            </Box>
            
            <Button variant='contained' color="secondary" onClick={handleLogout}>Logout</Button>
            </>
          }
          
          {/* <Accordion>Login</Accordion> */}
        </Toolbar>
      </AppBar>

      <Container style={{paddingTop: theme.spacing(5),justifyContent: 'center'}}>
        {
          loggedIn &&
          <Box margin={2}>

          <Button variant='contained' color='primary' style={{textTransform: 'none'}} onClick={handleBlogDialogOpen}>Add Blog</Button>

          </Box>
        }
        {
          blogs.map((item, idx)=>
          <Card className={classes.card} key={idx}>
            <CardActionArea>
              <CardMedia
                className={classes.cardMedia}
                image={item.imageLink}
                title={item.title}
              />
              </CardActionArea>
              <CardContent>
                <Typography gutterBottom variant="h5">
                  {item.title}
                </Typography>
                <Typography gutterBottom variant="h6">
                  Author: {item.email}
                </Typography>
                {/* <Typography variant="body2" color="textSecondary" component="p"> */}
                  {item.content}
                {/* </Typography> */}
              </CardContent>
          </Card>
          )
        }
      

      </Container>

      <LoginDialog open={loginDialog} onClose={handleLoginDialogClose} toggleLogin={toggleLogin} handleLogin={handleLogin}/>
      <BlogDialog open={blogDialog} onClose={handleBlogDialogClose} addBlog={addBlog}/>
    </div>
  )
}

export default App;
