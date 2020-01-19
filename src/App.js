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
}));


const sizeList = ['S','M','L','XL'];
const ButtonSize = ({size}) => (
  <Button variant="outlined" color="primary">{size}</Button>
)

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

const MediaCard = ({product,itemsSelected, updateItemsSelected }) => {
  const classes = useStyles();
  const [itemSize, setItemSize] = useState("");
  return(
  <Card className={classes.card}>
    <CardActionArea>
    <CardMedia component="img" alt="T-shirt" image= {"./data/products/"+product.sku+"_1.jpg"} title="T-shirt"/>
    <CardContent>
      <Typography gutterBottom variant="h9" component="h2">{product.title}</Typography>
      <Typography variant="body2" color="textSecondary" component="p">{product.desc}</Typography>
      <Typography variant="body1" color="textPrimary" component="p">${product.price}</Typography>
      {sizeList.map(size => <SelectSize setItemSize = {setItemSize} selectedSize = {itemSize} size = {size} />)}
    </CardContent>
    </CardActionArea>
    <CardActions>
        <Button size="small" color="primary" onClick={() => itemSize ? updateItemsSelected(product, itemSize) : alert("Choose product size")}>
          Add to cart
        </Button>
      </CardActions>
  </Card>
  )
};

const CardList = ({ products,itemsSelected, updateItemsSelected }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
       <Grid container spacing={3}>
        { products.map(product =>
        <Grid item xs={3}>
           <MediaCard  product={product} itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected}/>
           </Grid>) }
        </Grid>
    </div>
  );
};

const useSelected = () => {
  const [itemsSelected, updateItemsSelected] = useState([]);
  const addItemCart = (itm, size) => {
    updateItemsSelected(
      itemsSelected.find(product => product.sku === itm.sku) ? itemsSelected.map(product =>
          product.sku === itm.sku ?
            { ...product, quantity: product.quantity + 1 }
            :
            product
        )
        :
        [{ ...itm, size, quantity: 1 }].concat(itemsSelected)
    );
  }
  return [itemsSelected, addItemCart];
}

const getTotalPrice = ({items}) => {
  return <p> {items.reduce((total, p) => total + p.price * p.quantity, 0)} </p>
}
const CartDrawer = ({itemsSelected, updateItemsSelected}) => {
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
    <div className = {classes.list} role = "presentation" onClick = {toggleDrawer(side, false)} onKeyDown = {toggleDrawer(side, false)}>
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
                </Card>
              </Grid>
              <Grid item>
                <img className = {classes.cartmedia} src = {'./data/products/' + items.sku + '_1.jpg'} />
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
        {sideList('right')}
      </Drawer>
    </React.Fragment>
  )
};

const App = () => {
  const [data, setData] = useState({});
  const [itemsSelected, updateItemsSelected] = useSelected();
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <ul>
      <CartDrawer itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected}/>
      <CardList products = {products} itemsSelected = {itemsSelected} updateItemsSelected = {updateItemsSelected}/>
    </ul>
  );
};

export default App;
