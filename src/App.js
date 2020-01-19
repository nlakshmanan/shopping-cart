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

const MediaCard = ({product,itemsSelected, updateItemsSelected }) => {
  const classes = useStyles();
  const [itemSizeList, updateSizeList] = useState([]);
  const [addStatus,setAddStatus] = useState(false);
  const cartItems = itemSizeList;
  const addToCart = () => {
      updateItemsSelected(product,cartItems);
    };

  return(
  <Card className={classes.card}>
    <CardActionArea>
    <CardMedia component="img" alt="T-shirt" image= {"./data/products/"+product.sku+"_1.jpg"} title="T-shirt"/>
    <CardContent>
      <Typography gutterBottom variant="h9" component="h2">{product.title}</Typography>
      <Typography variant="body2" color="textSecondary" component="p">{product.desc}</Typography>
      <Typography variant="body1" color="textPrimary" component="p">${product.price}</Typography>
      {sizeList.map(size => <ButtonSize size = {size} itemSizeList={itemSizeList} updateSizeList={updateSizeList}/>)}
      
    </CardContent>
    </CardActionArea>
    <CardActions>
      <Tooltip disableFocusListener title="">
        <span>
          <Button size="small" disabled={itemSizeList.length > 0 ? false: true} color="primary" onClick={addToCart}>
            Add to cart
          </Button>
        </span>
      </Tooltip>
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
  const addItemToCart = (product, sizeList) => {
    let tempItems = [...itemsSelected];
    //console.log("tempItems", tempItems)

    sizeList.forEach(size => {
      console.log("size", size)
      const itemKey = product.sku + size;
      if (tempItems.find (x => x.key === itemKey)){
        //console.log("Found", itemKey)
        tempItems.forEach( (data, index) => {
            if(data.key === itemKey){
              let t = tempItems[index]
              t.quantity = t.quantity + 1
              tempItems[index] = t
            }
        })
      }
      else{
        tempItems = tempItems.concat([{key: itemKey, ...product, size,quantity:1}])
      }
      })
      console.log("tempItems 2", tempItems)
      updateItemsSelected(tempItems)
    }      
  return [itemsSelected, addItemToCart];
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
