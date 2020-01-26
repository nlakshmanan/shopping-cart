import React, { useEffect, useState } from 'react';
import './App.css';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AddShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { IconButton } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
const firebaseConfig = {
  apiKey: "AIzaSyAyhJmOnKjXwrdNfugfiEsXgaU9WoS6IcI",
  authDomain: "shoppingcart-a0a90.firebaseapp.com",
  databaseURL: "https://shoppingcart-a0a90.firebaseio.com",
  projectId: "shoppingcart-a0a90",
  storageBucket: "shoppingcart-a0a90.appspot.com",
  messagingSenderId: "659981250360",
  appId: "1:659981250360:web:f796b39557aa0b32295bcd",
  measurementId: "G-CCCJHPRGSF"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref();

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: '100',
    width: 'auto',
    paddingRight: '56.25%'

  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  addToCart: {
    display: "None"
  }
}));

const CartItemStyles = makeStyles(theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 25,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  cartImage: {
    height: 60,
    width: 60
  },
}));


const sizeList = ['S','M','L','XL'];


const SelectSize = ({ setItemSize, selectedSize, size }) => {
  return (
      size === selectedSize ?
          <Button variant = "outlined" color = "primary" onClick={() => setItemSize(size)}>
              {size}
          </Button>
          :
          <Button variant = "outlined" onClick={() => setItemSize(size)}>
              {size}
          </Button>

  );
}

const ButtonSize = ({size,itemSizeList,updateSizeList}) => {
  const [selected,setSelected] = useState(false);
  const onClickAction = () => {
    setSelected(!selected)
    if(!selected){
      updateSizeList(itemSizeList.concat(size));
      //(itemSizeList.concat(size));
    }
    else{
      if(itemSizeList.length > 0){
      updateSizeList(itemSizeList.filter(item => item !== size));}
      //console.log(itemSizeList.filter(item => item !== size));
    }
  }
  return (
    <Button variant = {selected? "contained" : "outlined"} color = "primary" onClick={onClickAction}>{size}</Button>
  );
}

const AvailableSizes = ({product,inventory,setInventory,itemsSelected, updateItemsSelected,itemSizeList, updateSizeList}) => {
  if (Object.keys(inventory).length === 0) {
    return null;
  }
  const sku = product.sku;
  return (
    <div>
      {inventory[sku]["S"] !== 0 ? (
        <ButtonSize size = {"S"} itemSizeList={itemSizeList} updateSizeList={updateSizeList}/>
      ) : null}
      {inventory[sku]["M"] !== 0 ? (
        <ButtonSize size = {"M"} itemSizeList={itemSizeList} updateSizeList={updateSizeList}/>
      ) : null}
      {inventory[sku]["L"] !== 0 ? (
        <ButtonSize size = {"L"} itemSizeList={itemSizeList} updateSizeList={updateSizeList}/>
      ) : null}
      {inventory[sku]["XL"] !== 0 ? (
        <ButtonSize size = {"XL"} itemSizeList={itemSizeList} updateSizeList={updateSizeList}/>
      ) : null}
    </div>
  );

}

const MediaCard = ({user, product,inventory,setInventory,itemsSelected, updateItemsSelected }) => {
  const classes = useStyles();
  const [itemSizeList, updateSizeList] = useState([]);
  const cartItems = itemSizeList;
  const addToCart = () => {
      updateItemsSelected(product,cartItems,inventory,setInventory);
      let tempitemSizeList = itemSizeList
      updateSizeList(tempitemSizeList.filter(size => inventory[product.sku][size] !== 0))
    };

  return(
  <Card className={classes.card}>
    <CardActionArea>
    <CardMedia component="img" alt="T-shirt" image= {"./data/products/"+product.sku+"_1.jpg"} title="T-shirt"/>
    <CardContent>
      <Typography gutterBottom variant="h9" component="h2">{product.title}</Typography>
      <Typography variant="body2" color="textSecondary" component="p">{product.desc}</Typography>
      <Typography variant="body1" color="textPrimary" component="p">${product.price}</Typography>
      <AvailableSizes product={product} inventory={inventory} setInventory={setInventory} itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected} itemSizeList={itemSizeList} updateSizeList={updateSizeList} />
      
    </CardContent>
    </CardActionArea>
    <CardActions>
      <Tooltip disableFocusListener title="">
        <span>
          <Button className={user === null ? classes.addToCart : null} size="small" disabled={itemSizeList.length > 0 ? false: true} color="primary" onClick={addToCart}>
            Add to cart
          </Button>
        </span>
      </Tooltip>
      </CardActions>
  </Card>
  )
};

const CardList = ({ user,products,inventory,setInventory,itemsSelected, updateItemsSelected }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
       <Grid container spacing={3}>
        { products.map(product =>
        <Grid item xs={3}>
           <MediaCard user={ user } product={product} inventory={inventory} setInventory={setInventory} itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected}/>
           </Grid>) }
        </Grid>
    </div>
  );
};

const useSelected = () => {
  const [itemsSelected, updateItemsSelected] = useState([]);
  const addItemToCart = (product, sizeList,inventory,setInventory) => {
    let tempItems = [...itemsSelected];
    let tempInventory = inventory
    //console.log("tempItems", tempItems)

    sizeList.forEach(size => {
      console.log("size", size)
      const itemKey = product.sku + size[0];
      if (tempItems.find (x => x.key === itemKey)){
        //console.log("Found", itemKey)
        tempItems.forEach( (data, index) => {
            if(data.key === itemKey){
              let t = tempItems[index]
              t.quantity = t.quantity + 1
              setInventory(tempInventory)
            }
        })
      }
      else{
        tempItems = tempItems.concat([{key: itemKey, ...product, size,quantity:1}])
      }
      tempInventory[product.sku][size] = tempInventory[product.sku][size] - 1
      setInventory(tempInventory)
      })
      console.log("tempItems 2", tempItems)

      updateItemsSelected(tempItems)
    }     

    const removeItemFromCart = (itemKey,inventory,setInventory) => {
      let tempInventory = inventory
      let tempItems = itemsSelected
      tempItems.forEach( (data, index) => {
        if(data.key === itemKey && data.quantity > 0){
          let t = tempItems[index]
          t.quantity = t.quantity - 1
          tempItems[index] = t
        }
    })
      let sku = itemKey.slice(0,itemKey.length - 1)
      let size = itemKey.slice(itemKey.length - 1)
      if(size === 'X')
        size = "XL"
      console.log(sku,size)
      tempInventory[sku][size] = tempInventory[sku][size] + 1
      setInventory(tempInventory)
      updateItemsSelected(tempItems.filter(item => item.quantity !== 0))
    }
    return [itemsSelected,addItemToCart,removeItemFromCart];
  } 
  


const getTotalPrice = ({items}) => {
  return <p> {items.reduce((total, p) => total + p.price * p.quantity, 0)} </p>
}
const CartDrawer = ({itemsSelected, inventory , setInventory, updateItemsSelected,removeItemFromCart}) => {
  const classes = CartItemStyles();
  const [state, setState] = useState({right: false});
  const items = itemsSelected;
  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };
  const sideList = side => (
    <div className = {classes.list} role = "presentation"  onKeyDown = {() => toggleDrawer(side, false)}>
      <List>
        {items.map(items => 
          <ListItem>
            
            <Grid container direction="row" alignItems="center">
              <Grid item>
              <Card className={classes.card}>
                <br/>{items.title}
                <br/>Price: ${items.price}
                <br/>Size: {items.size}
                <br/>Quantity: {items.quantity}
                <IconButton onClick= { () => removeItemFromCart(items.key,inventory , setInventory) } edge = "start" color="primary" aria-label="remove one item from cart">
                <RemoveCircleIcon />
                </IconButton>
                </Card>
              </Grid>
              <Grid item >
                <img className={classes.cartImage} alt="t-shirt" src = {'./data/products/' + items.sku + '_1.jpg'} />
              </Grid>
            </Grid>
            <Divider/>
          </ListItem>)}
          <ListItem>
            Total price = {getTotalPrice({items})}
          </ListItem>
      </List>
    </div>
  );
  return (
    <React.Fragment>
      <IconButton onClick= {toggleDrawer('right', true) } edge = "start" color="primary" aria-label="add to shopping cart">
        <AddShoppingCartIcon />
      </IconButton>
      <Drawer anchor = "right" open = {state.right} onClose={toggleDrawer('right', false)}>
        <p>Shopping Cart   </p>
        {sideList('right')}
      </Drawer>
    </React.Fragment>
  )
};

const Banner = ({ user }) => (
  <React.Fragment>
    { user ? <Welcome user={ user } /> : <SignIn /> }
  </React.Fragment>
);

const Welcome = ({ user }) => (
      <div>
      Welcome, {user.displayName}
      <Button primary onClick={() => firebase.auth().signOut()}>
        Log out
      </Button>
      </div>
);

const SignIn = () => (
  <StyledFirebaseAuth
    uiConfig={uiConfig}
    firebaseAuth={firebase.auth()}
  />
);


const App = () => {
  const [data, setData] = useState({});
  const [inventory, setInventory] = useState({});
  const [user, setUser] = useState(null);

  const [itemsSelected, updateItemsSelected,removeItemFromCart] = useSelected();
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();

    const handleData = snap => {
      if (snap.val()) setInventory(snap.val());
    }
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };

  }, []);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(setUser);
  }, []);

  return (
    <ul>
      <Banner user={ user } />
      <CartDrawer itemsSelected = {itemsSelected} inventory={inventory} setInventory={setInventory} updateItemsSelected = {updateItemsSelected} removeItemFromCart={removeItemFromCart}/>
      <CardList user={ user } products = {products} inventory={inventory} setInventory={setInventory} itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected}/>
    </ul>
  );
};

export default App;
